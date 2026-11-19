from django.urls import path
from . import views

urlpatterns = [
    # Sessions
    path('sessions', views.sessions_view, name='sessions'),
    path('sessions/', views.sessions_view, name='sessions_slash'),
    path('sessions/<str:session_id>', views.sessions_view, name='session_detail'),
    
    # Chat & Messages
    path('sessions/<str:session_id>/chat', views.session_chat, name='session_chat'),
    path('sessions/<str:session_id>/messages', views.session_messages, name='session_messages'),
    
    # Document Upload & Ingestion
    path('sessions/<str:session_id>/documents', views.session_documents, name='session_documents'),
    path('sessions/<str:session_id>/documents/<int:doc_id>', views.single_document, name='single_document'),

    # Configuration & Settings
    path('settings', views.app_settings_view, name='app_settings'),
    path('settings/', views.app_settings_view, name='app_settings_slash'),

    # Health & Diagnostics
    path('health', views.health_view, name='health'),
    path('health/', views.health_view, name='health_slash'),

    # Quick Tools
    path('tools/<str:tool_name>', views.quick_tool_data, name='quick_tool'),
]

