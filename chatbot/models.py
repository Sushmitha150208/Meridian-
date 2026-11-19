import json
from django.db import models

class Document(models.Model):
    title = models.CharField(max_length=255)
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50, default='pdf')
    file_size = models.IntegerField(default=0)
    page_count = models.IntegerField(default=1)
    status = models.CharField(max_length=50, default='ready')  # processing, ready, error
    session_id = models.CharField(max_length=100, default='default')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.file_name})"

class DocumentChunk(models.Model):
    document = models.ForeignKey(Document, related_name='chunks', on_delete=models.CASCADE)
    chunk_index = models.IntegerField()
    page_number = models.IntegerField(default=1)
    section_title = models.CharField(max_length=255, blank=True)
    text = models.TextField()
    token_count = models.IntegerField(default=0)

    class Meta:
        ordering = ['document', 'chunk_index']

    def __str__(self):
        return f"{self.document.file_name} - Page {self.page_number} ({self.section_title})"

class ChatSession(models.Model):
    session_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=255, default='New Conversation')
    created_at = models.DateTimeField(auto_now_add=True)
    last_active = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Session {self.session_id} - {self.title}"

class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, related_name='messages', on_delete=models.CASCADE)
    role = models.CharField(max_length=20)  # 'user' or 'assistant'
    content = models.TextField()
    citations_json = models.TextField(default='[]')
    created_at = models.DateTimeField(auto_now_add=True)

    def get_citations(self):
        try:
            return json.loads(self.citations_json)
        except Exception:
            return []

    def set_citations(self, citations):
        self.citations_json = json.dumps(citations)

class AppSetting(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField(blank=True)

    @classmethod
    def get_val(cls, key, default=''):
        try:
            item = cls.objects.filter(key=key).first()
            return item.value if item and item.value else default
        except Exception:
            return default

    @classmethod
    def set_val(cls, key, value):
        obj, _ = cls.objects.get_or_create(key=key)
        obj.value = str(value)
        obj.save()
