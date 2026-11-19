# Meridian Crest College — AI Campus Assistant (DocuChat)

A full-stack document-grounded chatbot web application developed with **Django** and **React**, adhering to the Software Requirements Specification (SRS) and the **Meridian Crest College Institutional Policy Handbook (2026–2027)**.

---

## 🌟 Key Features

- **Document-Grounded RAG Pipeline**:
  - Pre-indexed with all 28 pages of the **Meridian Crest College Institutional Policy Handbook**.
  - Document chunking, section metadata tracking, and page-by-page citation mapping.
  - Multi-document upload support (PDF, DOCX, TXT, MD up to 20 MB / 300 pages) per SRS FR-1.
- **Google Gemini API Integration**:
  - Powered by Google Gemini (`gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-2.0-flash`).
  - Strict grounding via SRS System Prompts (SP-1 through SP-8).
  - Standard refusal behavior (SP-6) for out-of-scope queries:
    > *"I couldn't find that in the document you uploaded, so I can't answer it. You can ask me about what the document says, or upload a different document."*
  - Built-in prompt injection defense (SP-7, FR-4.5, FR-4.6).
- **Clean Academic User Interface**:
  - Strict **flat styling**: NO shadow effects, NO glassy effects.
  - **Header**: Official crest, navigation, notification alerts, and student profile.
  - **Left Sidebar**: Quick navigation, chat history, bookmarks, and settings.
  - **Center Panel**:
    - Neoclassical campus hero banner.
    - AI Assistant greeting card.
    - 5 Quick Action Pill Cards (*Academics*, *Exam & Timetable*, *Hostel & Transport*, *Events & Activities*, *General Enquiry*).
    - Chat message stream with markdown formatting.
    - Interactive **Citation Chips** linking to the **Source Verification Panel** (SRS FR-5.2).
    - Character counter (0/2000), voice recognition (Speech-to-Text), and file upload controls.
  - **Right Sidebar**:
    - Voice Assistant with live waveform audio feedback.
    - Quick Tools (*College Calendar*, *Campus Map*, *Faculty Directory*, *Important Links*).
    - Recent Chats history.
- **Privacy & FERPA Compliance (Policy 8)**:
  - Ephemeral session retention (24-hour inactivity expiry per FR-6.3).
  - Zero model training on student queries or uploaded documents (NFR-9, NFR-10).

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Django 5+ or 6+
- `google-generativeai`, `pypdf`, `django-cors-headers`, `djangorestframework`

### Installation
```bash
git clone https://github.com/Sushmitha150208/Meridian-.git
cd Meridian-
pip install -r requirements.txt
```

### Database Setup & Policy Ingestion
```bash
python manage.py migrate
python -c "import os, django; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'meridian_backend.settings'); django.setup(); from chatbot.rag_engine import ensure_policy_indexed; ensure_policy_indexed()"
```

### Run Server
```bash
python manage.py runserver 0.0.0.0:8000
```
Open **http://127.0.0.1:8000/** in your web browser.

---

## 🏛️ Grounding Policy Document
The application is preloaded with:
- **Meridian Crest College Institutional Policy Handbook 2026–2027** (Edition 1.0, Issued November 19, 2026).
- Covers all 21 policy areas including Admissions, Grading & Academic Standing, Academic Integrity, Title IX, Tuition & Refund Schedule, Housing & Residence Life, Campus Safety, and Technology Acceptable Use.
