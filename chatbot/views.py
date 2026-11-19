import json
import os
import uuid
from pathlib import Path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.conf import settings
from .models import Document, DocumentChunk, ChatSession, ChatMessage, AppSetting
from .rag_engine import (
    ensure_policy_indexed,
    answer_question,
    parse_document,
    chunk_text,
    STANDARD_REFUSAL_MESSAGE
)

# ─────────────────────────────────────────────────────────────
# Session Endpoints (SRS 6.3)
# ─────────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(["GET", "POST"])
def sessions_view(request, session_id=None):
    ensure_policy_indexed()

    if request.method == "POST" and not session_id:
        # Create session
        new_id = str(uuid.uuid4())[:8]
        try:
            data = json.loads(request.body) if request.body else {}
            title = data.get('title', 'New Conversation')
        except Exception:
            title = 'New Conversation'

        session = ChatSession.objects.create(session_id=new_id, title=title)
        return JsonResponse({
            'session_id': session.session_id,
            'title': session.title,
            'created_at': session.created_at.isoformat()
        })

    elif request.method == "GET":
        # List recent sessions
        sessions = ChatSession.objects.all().order_by('-last_active')[:10]
        data = [{
            'session_id': s.session_id,
            'title': s.title,
            'last_active': s.last_active.isoformat(),
            'message_count': s.messages.count()
        } for s in sessions]
        return JsonResponse({'sessions': data})

    elif request.method == "DELETE" and session_id:
        # Clear/End session (FR-6.1)
        ChatSession.objects.filter(session_id=session_id).delete()
        Document.objects.filter(session_id=session_id).delete()
        return JsonResponse({'status': 'deleted', 'session_id': session_id})

    return JsonResponse({'error': 'Invalid request'}, status=400)


# ─────────────────────────────────────────────────────────────
# Chat Endpoint (SRS 6.3 - /api/sessions/{id}/chat)
# ─────────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(["POST"])
def session_chat(request, session_id):
    ensure_policy_indexed()

    try:
        data = json.loads(request.body)
    except Exception:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    question = data.get('question', '').strip()
    if not question:
        return JsonResponse({'error': 'Question cannot be empty'}, status=400)

    # Question length check (FR-1.8: max 2000 chars)
    if len(question) > 2000:
        return JsonResponse({'error': 'Question exceeds maximum limit of 2,000 characters'}, status=400)

    session, _ = ChatSession.objects.get_or_create(session_id=session_id)
    if session.title == 'New Conversation':
        session.title = question[:40] + ('...' if len(question) > 40 else '')
        session.save()

    # Get conversation history (last 10 turns per FR-3.7)
    recent_msgs = session.messages.order_by('-created_at')[:10]
    history = [{'role': m.role, 'content': m.content} for m in reversed(recent_msgs)]

    # Run RAG engine
    result = answer_question(question, session_id=session_id, conversation_history=history)

    # Persist in database
    user_msg = ChatMessage.objects.create(session=session, role='user', content=question)
    assistant_msg = ChatMessage.objects.create(session=session, role='assistant', content=result['answer'])
    assistant_msg.set_citations(result.get('citations', []))
    assistant_msg.save()

    return JsonResponse({
        'answer': result['answer'],
        'citations': result.get('citations', []),
        'sources': result.get('sources', []),
        'model_used': result.get('model_used', 'Gemini'),
        'session_id': session_id
    })


@require_http_methods(["GET"])
def session_messages(request, session_id):
    session = ChatSession.objects.filter(session_id=session_id).first()
    if not session:
        return JsonResponse({'messages': []})

    msgs = session.messages.order_by('created_at')
    data = [{
        'id': m.id,
        'role': m.role,
        'content': m.content,
        'citations': m.get_citations(),
        'created_at': m.created_at.isoformat()
    } for m in msgs]
    return JsonResponse({'messages': data, 'session_title': session.title})


# ─────────────────────────────────────────────────────────────
# Document Upload and Management (SRS FR-1.2 to FR-1.7, FR-2.1)
# ─────────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(["GET", "POST"])
def session_documents(request, session_id):
    ensure_policy_indexed()

    if request.method == "GET":
        # Return global handbook + user session documents
        docs = Document.objects.filter(session_id__in=['global', session_id]).order_by('-uploaded_at')
        data = [{
            'id': d.id,
            'title': d.title,
            'file_name': d.file_name,
            'file_type': d.file_type,
            'file_size': d.file_size,
            'page_count': d.page_count,
            'status': d.status,
            'chunk_count': d.chunks.count(),
            'is_global': d.session_id == 'global'
        } for d in docs]
        return JsonResponse({'documents': data})

    elif request.method == "POST":
        # Max 5 documents per session (FR-1.5)
        existing_count = Document.objects.filter(session_id=session_id).count()
        if existing_count >= 5:
            return JsonResponse({'error': 'Session document limit reached (maximum 5 documents per session).'}, status=400)

        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return JsonResponse({'error': 'No file uploaded.'}, status=400)

        # Validate file size (FR-1.4: max 20MB)
        if uploaded_file.size > 20 * 1024 * 1024:
            return JsonResponse({'error': 'File exceeds maximum allowed size of 20 MB.'}, status=400)

        file_name = uploaded_file.name
        ext = Path(file_name).suffix.lower()
        if ext not in ['.pdf', '.docx', '.txt', '.md']:
            return JsonResponse({'error': f'Unsupported file format: {ext}. Allowed: PDF, DOCX, TXT, MD.'}, status=400)

        # Save temporarily
        temp_dir = settings.BASE_DIR / 'uploads'
        temp_dir.mkdir(exist_ok=True)
        save_path = temp_dir / f"{uuid.uuid4()}_{file_name}"

        with open(save_path, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        try:
            pages = parse_document(save_path, file_name)
            if not pages or all(not p[1].strip() for p in pages):
                return JsonResponse({'error': 'The uploaded file has no readable text. (FR-2.6)'}, status=400)

            if len(pages) > 300:
                return JsonResponse({'error': 'Document exceeds maximum length of 300 pages.'}, status=400)

            doc = Document.objects.create(
                title=file_name.rsplit('.', 1)[0].replace('_', ' ').title(),
                file_name=file_name,
                file_type=ext.replace('.', ''),
                file_size=uploaded_file.size,
                page_count=len(pages),
                status='ready',
                session_id=session_id
            )

            chunks_data = chunk_text(pages, chunk_size=850, overlap=120)
            chunk_objs = [
                DocumentChunk(
                    document=doc,
                    chunk_index=c['chunk_index'],
                    page_number=c['page_number'],
                    section_title=c['section_title'],
                    text=c['text'],
                    token_count=c['token_count']
                ) for c in chunks_data
            ]
            DocumentChunk.objects.bulk_create(chunk_objs)

            return JsonResponse({
                'id': doc.id,
                'title': doc.title,
                'file_name': doc.file_name,
                'status': 'ready',
                'page_count': doc.page_count,
                'chunk_count': len(chunk_objs),
                'message': f"Document '{file_name}' successfully processed and indexed ({len(chunk_objs)} chunks)."
            })

        except Exception as e:
            return JsonResponse({'error': f"Failed to process document: {str(e)}"}, status=500)
        finally:
            if save_path.exists():
                try:
                    os.remove(save_path)
                except Exception:
                    pass


@csrf_exempt
@require_http_methods(["GET", "DELETE"])
def single_document(request, session_id, doc_id):
    doc = Document.objects.filter(id=doc_id, session_id=session_id).first()
    if not doc:
        return JsonResponse({'error': 'Document not found'}, status=404)

    if request.method == "DELETE":
        doc_name = doc.file_name
        doc.delete()  # Cascade deletes chunks
        return JsonResponse({'status': 'deleted', 'message': f"Document '{doc_name}' and its vector index were removed."})

    return JsonResponse({
        'id': doc.id,
        'title': doc.title,
        'file_name': doc.file_name,
        'status': doc.status,
        'page_count': doc.page_count,
        'chunk_count': doc.chunks.count()
    })


# ─────────────────────────────────────────────────────────────
# Settings and Configuration (SRS FR-7.1)
# ─────────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(["GET", "POST"])
def app_settings_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            if 'api_key' in data:
                AppSetting.set_val('gemini_api_key', data['api_key'].strip())
            if 'model_name' in data:
                AppSetting.set_val('model_name', data['model_name'].strip())
            if 'temperature' in data:
                AppSetting.set_val('temperature', data['temperature'])
            if 'top_k' in data:
                AppSetting.set_val('top_k', data['top_k'])
            return JsonResponse({'status': 'saved', 'message': 'Configuration updated successfully.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    # GET settings
    key = AppSetting.get_val('gemini_api_key', '') or os.environ.get('GEMINI_API_KEY', '') or getattr(settings, 'GEMINI_API_KEY', '')
    masked_key = (key[:4] + '...' + key[-4:]) if len(key) > 8 else ('' if not key else '******')
    
    return JsonResponse({
        'has_api_key': bool(key),
        'masked_key': masked_key,
        'model_name': AppSetting.get_val('model_name', 'gemini-1.5-flash'),
        'available_models': ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.5-flash'],
        'temperature': float(AppSetting.get_val('temperature', '0.2')),
        'top_k': int(AppSetting.get_val('top_k', '8')),
        'chunk_size': int(AppSetting.get_val('chunk_size', '850')),
        'max_file_size_mb': 20,
        'max_pages': 300
    })


# ─────────────────────────────────────────────────────────────
# Health & Monitoring (SRS 6.3 - /api/health)
# ─────────────────────────────────────────────────────────────

@require_http_methods(["GET"])
def health_view(request):
    ensure_policy_indexed()
    doc_count = Document.objects.count()
    chunk_count = DocumentChunk.objects.count()
    return JsonResponse({
        'status': 'healthy',
        'service': 'Meridian Crest College AI Assistant (Gemini API RAG)',
        'documents_indexed': doc_count,
        'chunks_indexed': chunk_count,
        'environment': 'production-ready',
        'version': '1.0'
    })


# ─────────────────────────────────────────────────────────────
# Campus Information & Quick Tools Data
# ─────────────────────────────────────────────────────────────

@require_http_methods(["GET"])
def quick_tool_data(request, tool_name):
    tools = {
        'calendar': {
            'title': 'Academic Calendar 2026–2027',
            'events': [
                {'date': 'Last week of August', 'name': 'Fall Classes Begin', 'type': 'Academic'},
                {'date': 'End of Week 1', 'name': 'Add Period Ends', 'type': 'Deadline'},
                {'date': 'End of Week 2', 'name': 'Drop (No Record) Deadline', 'type': 'Deadline'},
                {'date': 'October 1', 'name': 'Annual Security Report Published', 'type': 'Safety'},
                {'date': 'End of Week 10', 'name': 'Course Withdrawal (W Grade) & Pass/No Pass Deadline', 'type': 'Academic'},
                {'date': 'November 15', 'name': 'Early Action Application Deadline', 'type': 'Admissions'},
                {'date': 'Week 16', 'name': 'Final Examinations Week', 'type': 'Exams'},
                {'date': 'February 1', 'name': 'Regular Admission Deadline', 'type': 'Admissions'},
                {'date': 'March 1', 'name': 'Financial Aid Priority Date', 'type': 'Financial Aid'},
                {'date': 'May 1', 'name': 'Enrollment Deposit Deadline', 'type': 'Admissions'},
                {'date': 'May (Annual)', 'name': 'Commencement Ceremony', 'type': 'Graduation'}
            ]
        },
        'map': {
            'title': 'Meridian Crest Campus Map & Facilities',
            'locations': [
                {'name': 'Provost & Administration Hall', 'zone': 'Central Campus', 'hours': '7:00 AM – 11:00 PM', 'contact': 'Room 101'},
                {'name': 'Learning Commons & Main Library', 'zone': 'North Quad', 'hours': '24 Hours during Finals', 'contact': 'Library Desk'},
                {'name': 'Student Center & Residence Life Office', 'zone': 'South Campus', 'hours': '8:00 AM – 8:00 PM', 'contact': '555-0111'},
                {'name': 'Wellness & Counseling Center', 'zone': 'West Pavilion', 'hours': '8:30 AM – 5:00 PM', 'contact': '555-0106'},
                {'name': 'Campus Safety Department (24/7)', 'zone': 'Gate 1 Headquarters', 'hours': '24/7 Every Day', 'contact': '555-0100 (Emergency: 555-0911)'},
                {'name': 'Academic Integrity Office', 'zone': 'Provost Wing B', 'hours': '9:00 AM – 5:00 PM', 'contact': '555-0108'},
                {'name': 'Bursar & Financial Aid Center', 'zone': 'Admissions Building', 'hours': '9:00 AM – 4:30 PM', 'contact': '555-0103'}
            ]
        },
        'directory': {
            'title': 'Faculty & Department Directory',
            'contacts': [
                {'office': 'Office of Admissions', 'email': 'admissions@mcc.example.edu', 'phone': '555-0101', 'scope': 'Applications, deferrals, transfer evaluations'},
                {'office': 'Registrar', 'email': 'registrar@mcc.example.edu', 'phone': '555-0102', 'scope': 'Registration, transcripts, FERPA, graduation'},
                {'office': 'Bursar & Financial Aid', 'email': 'finance@mcc.example.edu', 'phone': '555-0103', 'scope': 'Billing, refunds, aid, SAP appeals'},
                {'office': 'Office of Student Conduct', 'email': 'conduct@mcc.example.edu', 'phone': '555-0104', 'scope': 'Code of conduct, hearings, amnesty'},
                {'office': 'Title IX Coordinator', 'email': 'titleix@mcc.example.edu', 'phone': '555-0105', 'scope': 'Sex discrimination, safety & misconduct'},
                {'office': 'Accessibility Services', 'email': 'access@mcc.example.edu', 'phone': '555-0107', 'scope': 'Accommodations, testing & assistive support'},
                {'office': 'Campus Safety (24/7)', 'email': 'safety@mcc.example.edu', 'phone': '555-0100', 'scope': 'Emergencies, escorts, safety reports'}
            ]
        },
        'links': {
            'title': 'Important Links & Portals',
            'links': [
                {'name': 'Student Registration Portal', 'desc': 'Course enrollment, add/drop and schedule builder', 'category': 'Academics'},
                {'name': 'Degree Audit Tool', 'desc': 'Track graduation requirements and transfer credits', 'category': 'Academics'},
                {'name': 'Wellness & Counseling Appointments', 'desc': 'Confidential counseling & health visits', 'category': 'Health'},
                {'name': 'Anonymous Ethics & Safety Line', 'desc': 'ethics.mcc.example.edu (555-0112)', 'category': 'Safety'},
                {'name': 'Housing & Roommate Portal', 'desc': 'Dormitory applications, agreements & maintenance', 'category': 'Residence'}
            ]
        }
    }

    data = tools.get(tool_name)
    if not data:
        return JsonResponse({'error': 'Tool not found'}, status=404)
    return JsonResponse(data)
