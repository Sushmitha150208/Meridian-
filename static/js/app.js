const { useState, useEffect, useRef } = React;

// Inline SVG Icons to guarantee zero external font/network dependencies
const Icons = {
  Chat: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  History: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  Bookmark: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  ),
  Help: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  Mic: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  ),
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  ),
  Paperclip: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  MapPin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Link: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  ),
  AcademicCap: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
    </svg>
  ),
  Building: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18"></path>
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
      <path d="M9 9h1"></path>
      <path d="M9 13h1"></path>
      <path d="M9 17h1"></path>
      <path d="M14 9h1"></path>
      <path d="M14 13h1"></path>
      <path d="M14 17h1"></path>
    </svg>
  ),
  Info: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  ),
  Trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  CollegeCrest: () => (
    <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 15 L78 35 L78 65 L50 85 L22 65 L22 35 Z" fill="#7B2034" stroke="#C28E3A" strokeWidth="4"/>
      <path d="M50 30 L66 42 L66 62 L50 72 L34 62 L34 42 Z" fill="#5A1222" stroke="#FFFFFF" strokeWidth="1.5"/>
      <path d="M50 42 L50 64" stroke="#C28E3A" strokeWidth="2.5"/>
      <path d="M40 48 Q50 56 60 48" stroke="#C28E3A" strokeWidth="2" fill="none"/>
      <circle cx="50" cy="38" r="4" fill="#C28E3A"/>
    </svg>
  )
};

function App() {
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('mcc_session_id') || 'session_' + Math.random().toString(36).substring(2, 9));
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'calendar', 'map', 'directory', 'links', 'settings', 'documents', 'source', 'announcements', 'privacy'
  const [sourceData, setSourceData] = useState(null);
  const [toolData, setToolData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('mcc_favorites') || '[]'));
  const [settingsData, setSettingsData] = useState({
    has_api_key: false,
    model_name: 'gemini-1.5-flash',
    temperature: 0.2,
    top_k: 8
  });
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Load initial settings, documents, and messages
  useEffect(() => {
    localStorage.setItem('mcc_session_id', sessionId);
    fetchSettings();
    fetchDocuments();
    fetchMessages();
    fetchRecentSessions();
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettingsData(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/documents`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRecentSessions = async () => {
    try {
      const res = await fetch('/api/sessions');
      if (res.ok) {
        const data = await res.json();
        setRecentChats(data.sessions || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    if (text.length > 2000) {
      alert("Question exceeds 2,000 characters limit. (FR-1.8)");
      return;
    }

    const tempUserMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch(`/api/sessions/${sessionId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Server error occurred');
      }

      const data = await res.json();
      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.answer,
        citations: data.citations || [],
        sources: data.sources || [],
        model_used: data.model_used,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMsg]);
      fetchRecentSessions();
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `**Error:** ${err.message}. Please try asking again or check your settings.`,
        citations: [],
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Recognition (Web Speech API)
  const toggleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsRecording(false);
      // Auto submit voice input
      handleSendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleStartNewChat = async () => {
    if (messages.length > 0 && !confirm("Start a new chat session? This will clear your current screen.")) {
      return;
    }
    const newId = 'session_' + Math.random().toString(36).substring(2, 9);
    setSessionId(newId);
    setMessages([]);
  };

  const handleOpenTool = async (toolName) => {
    try {
      const res = await fetch(`/api/tools/${toolName}`);
      if (res.ok) {
        const data = await res.json();
        setToolData(data);
        setActiveModal(toolName);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCitationClick = (citationText) => {
    // Open source panel showing citation and page details
    setSourceData({
      citation: citationText,
      document: "Meridian Crest College Policy Handbook (2026–2027)",
      text: "Passage referenced from official College handbook. Review this section for exact policy terms, academic rules, and standards."
    });
    setActiveModal('source');
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBookmark = (msg) => {
    const exists = favorites.some(f => f.id === msg.id);
    let updated;
    if (exists) {
      updated = favorites.filter(f => f.id !== msg.id);
    } else {
      updated = [...favorites, msg];
    }
    setFavorites(updated);
    localStorage.setItem('mcc_favorites', JSON.stringify(updated));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('Uploading & indexing document into RAG store...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/sessions/${sessionId}/documents`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setUploadStatus(`Ready: ${data.file_name} indexed (${data.chunk_count} chunks)`);
      fetchDocuments();
    } catch (err) {
      setUploadStatus(`Error: ${err.message}`);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!confirm("Remove this document and delete its index?")) return;
    try {
      await fetch(`/api/sessions/${sessionId}/documents/${docId}`, { method: 'DELETE' });
      fetchDocuments();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const body = {
        model_name: settingsData.model_name,
        temperature: settingsData.temperature,
        top_k: settingsData.top_k
      };
      if (apiKeyInput.trim()) {
        body.api_key = apiKeyInput.trim();
      }
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        alert("Settings saved successfully.");
        fetchSettings();
        setActiveModal(null);
        setApiKeyInput('');
      }
    } catch (err) {
      alert("Failed to save settings: " + err.message);
    }
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="top-header">
        <div className="brand-section">
          <div className="college-logo-icon">
            <Icons.CollegeCrest />
          </div>
          <div>
            <div className="college-logo-title">Meridian Crest College</div>
            <div className="college-logo-sub">AI Campus Assistant</div>
          </div>
          <div className="header-divider"></div>
          <nav className="nav-links">
            <a href="#" className="nav-item">Home</a>
            <a href="#" className="nav-item active">AI Assistant</a>
            <a href="#" className="nav-item" onClick={() => handleSendMessage("What academic programs, majors, and degrees are offered?")}>Academics</a>
            <a href="#" className="nav-item" onClick={() => handleSendMessage("What student services, counseling, and wellness resources are available?")}>Student Services</a>
            <a href="#" className="nav-item" onClick={() => handleOpenTool('links')}>Resources</a>
            <a href="#" className="nav-item" onClick={() => handleOpenTool('directory')}>Contact</a>
          </nav>
        </div>

        <div className="header-right">
          <button className="icon-btn-badge" title="Campus Announcements" onClick={() => setActiveModal('announcements')}>
            <Icons.Bell />
            <div className="badge-dot"></div>
          </button>
          <div className="user-avatar-circle" title="Student Profile & Privacy (FERPA)" onClick={() => setActiveModal('privacy')}>
            MC
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="main-layout">
        {/* Left Sidebar */}
        <aside className="left-sidebar">
          <div className="sidebar-menu">
            <button className="sidebar-btn active" onClick={handleStartNewChat}>
              <Icons.Chat />
              <span>AI Assistant</span>
            </button>
            <button className="sidebar-btn" onClick={() => setActiveModal('history')}>
              <Icons.History />
              <span>Chat History</span>
            </button>
            <button className="sidebar-btn" onClick={() => setActiveModal('favorites')}>
              <Icons.Bookmark />
              <span>My Favorites</span>
              {favorites.length > 0 && <span style={{ marginLeft: 'auto', fontSize: 11, background: '#E2D7CF', padding: '2px 6px', borderRadius: 10 }}>{favorites.length}</span>}
            </button>
            <button className="sidebar-btn" onClick={() => setActiveModal('announcements')}>
              <Icons.Bell />
              <span>Announcements</span>
              <span className="sidebar-badge"></span>
            </button>
            <button className="sidebar-btn" onClick={() => handleOpenTool('directory')}>
              <Icons.Help />
              <span>Help & Support</span>
            </button>
            <button className="sidebar-btn" onClick={() => setActiveModal('settings')}>
              <Icons.Settings />
              <span>Settings</span>
            </button>
          </div>

          <div className="sidebar-illustration">
            <Icons.CollegeCrest />
            <div className="sidebar-illustration-text">Meridian Crest • Est. 1962</div>
            <div style={{ fontSize: 11, color: '#8C7E77', marginTop: 2 }}>Charter Institutional Handbook</div>
          </div>
        </aside>

        {/* Center Main Panel */}
        <main className="center-panel">
          {/* Hero Banner */}
          <section className="hero-banner">
            <div className="hero-text-content">
              <h1 className="hero-title">Meridian Crest College</h1>
              <div className="hero-subtitle">
                AI Campus Assistant
              </div>
              <div className="hero-accent-line"></div>
            </div>
          </section>

          {/* Welcome Card & Categories (shown when chat is short) */}
          {messages.length === 0 && (
            <>
              <div className="welcome-card">
                <div className="bot-avatar-frame">
                  <img src="/static/img/robot_avatar.png" alt="Meridian Crest AI" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                <div className="welcome-content">
                  <div className="welcome-heading">Hello! 👋</div>
                  <div className="welcome-title-sub">I'm your Meridian Crest AI Assistant.</div>
                  <div className="welcome-desc">
                    Ask me about academics, admissions, exams, events, facilities, or any college-related information grounded strictly in official institutional policy.
                  </div>
                </div>
              </div>

              {/* 5 Quick Action Pill Cards */}
              <div className="quick-categories-row">
                <div className="quick-category-card" onClick={() => handleSendMessage("What are the academic grading system, GPA calculations, and Dean's List requirements?")}>
                  <div className="quick-category-icon"><Icons.AcademicCap /></div>
                  <div className="quick-category-title">Academics</div>
                  <div className="quick-category-sub">Syllabus, courses, exams</div>
                </div>

                <div className="quick-category-card" onClick={() => handleSendMessage("What are the exam schedules, final exam policies, and academic calendar dates?")}>
                  <div className="quick-category-icon"><Icons.Calendar /></div>
                  <div className="quick-category-title">Exam & Timetable</div>
                  <div className="quick-category-sub">Schedules, updates</div>
                </div>

                <div className="quick-category-card" onClick={() => handleSendMessage("What are the hostel residence requirements, quiet hours, and room policies?")}>
                  <div className="quick-category-icon"><Icons.Building /></div>
                  <div className="quick-category-title">Hostel & Transport</div>
                  <div className="quick-category-sub">Rooms, routes, timing</div>
                </div>

                <div className="quick-category-card" onClick={() => handleSendMessage("What are the policies for student organizations, clubs, fests, and campus athletics?")}>
                  <div className="quick-category-icon"><Icons.Users /></div>
                  <div className="quick-category-title">Events & Activities</div>
                  <div className="quick-category-sub">Workshops, fests, clubs</div>
                </div>

                <div className="quick-category-card" onClick={() => handleSendMessage("What are the general admission deadlines, tuition fees, and contact offices?")}>
                  <div className="quick-category-icon"><Icons.Info /></div>
                  <div className="quick-category-title">General Enquiry</div>
                  <div className="quick-category-sub">Facilities, contacts, etc.</div>
                </div>
              </div>
            </>
          )}

          {/* Messages Stream */}
          {messages.length > 0 && (
            <div className="messages-container">
              {messages.map((m) => {
                const isAssistant = m.role === 'assistant';
                const isFav = favorites.some(f => f.id === m.id);
                return (
                  <div key={m.id} className={`message-bubble ${m.role}`}>
                    <div className="message-avatar">
                      {isAssistant ? '🤖' : '👤'}
                    </div>
                    <div className="message-content-wrapper">
                      <div className="message-body">
                        {isAssistant ? (
                          <div dangerouslySetInnerHTML={{ __html: window.marked ? window.marked.parse(m.content) : m.content }} />
                        ) : (
                          <div>{m.content}</div>
                        )}

                        {/* Citations (FR-5.1, FR-5.2) */}
                        {isAssistant && m.citations && m.citations.length > 0 && (
                          <div className="citations-list">
                            <span style={{ fontSize: 11, color: '#7B2034', fontWeight: 600 }}>Sources:</span>
                            {m.citations.map((c, i) => (
                              <button key={i} className="citation-chip" onClick={() => handleCitationClick(c)}>
                                📄 {c}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {isAssistant && (
                        <div className="message-actions">
                          <button className="copy-btn" onClick={() => handleCopy(m.id, m.content)}>
                            <Icons.Copy />
                            <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button className="copy-btn" onClick={() => handleBookmark(m)}>
                            <Icons.Bookmark />
                            <span>{isFav ? 'Saved' : 'Save'}</span>
                          </button>
                          {m.model_used && (
                            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#8F827B' }}>
                              Engine: {m.model_used}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="message-bubble assistant">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content-wrapper">
                    <div className="message-body" style={{ fontStyle: 'italic', color: '#7B2034' }}>
                      Retrieving policy passages and generating grounded answer...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Bottom Chat Input Bar */}
          <div className="input-bar-container">
            <button
              className="input-icon-btn"
              title="Upload & Manage Documents (PDF, DOCX, TXT)"
              onClick={() => setActiveModal('documents')}
            >
              <Icons.Paperclip />
            </button>

            <input
              type="text"
              className="chat-input-field"
              placeholder="Type your question here..."
              value={inputText}
              maxLength={2000}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              disabled={isLoading}
            />

            <div className="char-counter">
              {inputText.length}/2000
            </div>

            <button
              className={`mic-btn-circle ${isRecording ? 'recording' : ''}`}
              title={isRecording ? "Listening... click to stop" : "Voice input (Speech to Text)"}
              onClick={toggleVoiceRecording}
            >
              <Icons.Mic />
            </button>

            <button
              className="send-btn-circle"
              title="Send message"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
            >
              <Icons.Send />
            </button>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          {/* Voice Assistant Card */}
          <div className="voice-assistant-card">
            <div className="voice-card-header">
              <div className="voice-mic-badge">
                <Icons.Mic />
              </div>
              <div>
                <div className="voice-card-title">Voice Assistant</div>
                <div className="voice-card-sub">Speak your question and get instant answers.</div>
              </div>
            </div>

            <div className="voice-card-action-row">
              <div className="soundwave-visualizer">
                {[4, 12, 22, 16, 28, 14, 26, 18, 10, 20, 6, 15, 25, 8].map((h, i) => (
                  <div
                    key={i}
                    className="wave-bar"
                    style={{
                      height: isRecording ? `${Math.max(6, (h * (i % 2 === 0 ? 1.4 : 0.8)) % 32)}px` : `${h}px`,
                      opacity: isRecording ? 1 : 0.6
                    }}
                  />
                ))}
              </div>
              <button
                className={`voice-action-mic-btn ${isRecording ? 'active' : ''}`}
                title={isRecording ? "Listening..." : "Click to speak"}
                onClick={toggleVoiceRecording}
              >
                <Icons.Mic />
              </button>
            </div>
          </div>

          {/* Quick Tools Card */}
          <div className="quick-tools-card">
            <div className="section-card-title">
              <Icons.Calendar />
              <span>Quick Tools</span>
            </div>
            <div className="tools-grid">
              <button className="tool-grid-btn" onClick={() => handleOpenTool('calendar')}>
                <Icons.Calendar />
                <span>College Calendar</span>
              </button>
              <button className="tool-grid-btn" onClick={() => handleOpenTool('map')}>
                <Icons.MapPin />
                <span>Campus Map</span>
              </button>
              <button className="tool-grid-btn" onClick={() => handleOpenTool('directory')}>
                <Icons.Users />
                <span>Faculty Directory</span>
              </button>
              <button className="tool-grid-btn" onClick={() => handleOpenTool('links')}>
                <Icons.Link />
                <span>Important Links</span>
              </button>
            </div>
          </div>

          {/* Recent Chats Card */}
          <div className="recent-chats-card">
            <div className="recent-chats-header">
              <div className="section-card-title" style={{ marginBottom: 0 }}>
                <Icons.History />
                <span>Recent Chats</span>
              </div>
              <span className="view-all-link" onClick={() => setActiveModal('history')}>View All</span>
            </div>

            <div className="recent-chats-list">
              <div className="recent-chat-item" onClick={() => handleSendMessage("Explain the undergraduate admission process and eligibility")}>
                <div className="recent-chat-title-group">
                  <Icons.Chat />
                  <span>Admission process</span>
                </div>
                <Icons.ChevronRight />
              </div>

              <div className="recent-chat-item" onClick={() => handleSendMessage("What is the next semester timetable and instructional weeks schedule?")}>
                <div className="recent-chat-title-group">
                  <Icons.Chat />
                  <span>Next semester timetable</span>
                </div>
                <Icons.ChevronRight />
              </div>

              <div className="recent-chat-item" onClick={() => handleSendMessage("How does hostel room allocation and residence life work?")}>
                <div className="recent-chat-title-group">
                  <Icons.Chat />
                  <span>Hostel allocation</span>
                </div>
                <Icons.ChevronRight />
              </div>

              {recentChats.slice(0, 3).map((rc) => (
                <div key={rc.session_id} className="recent-chat-item" onClick={() => { setSessionId(rc.session_id); }}>
                  <div className="recent-chat-title-group">
                    <Icons.Chat />
                    <span>{rc.title}</span>
                  </div>
                  <Icons.ChevronRight />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ────────────────── MODALS ────────────────── */}

      {/* Quick Tool Data Modal (Calendar, Map, Directory, Links) */}
      {toolData && (activeModal === 'calendar' || activeModal === 'map' || activeModal === 'directory' || activeModal === 'links') && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{toolData.title}</div>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <div className="modal-body">
              {toolData.events && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {toolData.events.map((ev, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8EFE9', borderRadius: 10, border: '1px solid #EADCD3' }}>
                      <div>
                        <strong>{ev.name}</strong>
                        <div style={{ fontSize: 11, color: '#7B2034' }}>{ev.type}</div>
                      </div>
                      <div style={{ fontWeight: 600, color: '#2C2426' }}>{ev.date}</div>
                    </div>
                  ))}
                </div>
              )}

              {toolData.locations && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {toolData.locations.map((loc, i) => (
                    <div key={i} style={{ padding: '10px 14px', background: '#F8EFE9', borderRadius: 10, border: '1px solid #EADCD3' }}>
                      <div style={{ fontWeight: 700, color: '#7B2034' }}>{loc.name}</div>
                      <div style={{ fontSize: 12, color: '#443A38' }}>Zone: {loc.zone} • Hours: {loc.hours}</div>
                      <div style={{ fontSize: 12, color: '#6A5C56' }}>Contact: {loc.contact}</div>
                    </div>
                  ))}
                </div>
              )}

              {toolData.contacts && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {toolData.contacts.map((cnt, i) => (
                    <div key={i} style={{ padding: '10px 14px', background: '#F8EFE9', borderRadius: 10, border: '1px solid #EADCD3' }}>
                      <div style={{ fontWeight: 700, color: '#7B2034' }}>{cnt.office}</div>
                      <div style={{ fontSize: 12 }}>Scope: {cnt.scope}</div>
                      <div style={{ fontSize: 12, color: '#6A5C56', marginTop: 4 }}>
                        ✉ {cnt.email} • 📞 {cnt.phone}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {toolData.links && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {toolData.links.map((lnk, i) => (
                    <div key={i} style={{ padding: '10px 14px', background: '#F8EFE9', borderRadius: 10, border: '1px solid #EADCD3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#7B2034' }}>{lnk.name}</div>
                        <div style={{ fontSize: 12, color: '#6A5C56' }}>{lnk.desc}</div>
                      </div>
                      <span style={{ fontSize: 11, background: '#7B2034', color: '#fff', padding: '3px 8px', borderRadius: 6 }}>{lnk.category}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Document Ingestion & RAG Manager Modal (SRS FR-1.2 to FR-1.7) */}
      {activeModal === 'documents' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Document Knowledge Base & Ingestion (RAG)</div>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ fontSize: 13, color: '#6A5C56', lineHeight: 1.4 }}>
                Under <strong>SRS FR-1</strong>, you can chat with the official Meridian Crest Institutional Policy Handbook or upload up to 5 additional documents (PDF, DOCX, TXT, MD up to 20 MB).
              </div>

              {/* Upload Dropzone */}
              <label className="upload-dropzone">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <Icons.Paperclip />
                <div style={{ fontWeight: 600, marginTop: 8 }}>Click to Browse or Drag & Drop Document</div>
                <div style={{ fontSize: 12, color: '#7E6F68' }}>Supported: PDF, DOCX, TXT, MD (Max 20 MB, 300 pages)</div>
              </label>

              {uploadStatus && (
                <div style={{ fontSize: 12, padding: '8px 12px', background: '#F8EFE9', borderRadius: 8, color: '#7B2034', fontWeight: 500 }}>
                  {uploadStatus}
                </div>
              )}

              {/* Documents List */}
              <div style={{ fontWeight: 600, fontSize: 14, color: '#2C2426', marginTop: 8 }}>Active Grounded Documents ({documents.length}):</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {documents.map((d) => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#FFFFFF', border: '1px solid #E2D7CF', borderRadius: 10 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#7B2034' }}>
                        {d.title}
                        {d.is_global && <span style={{ marginLeft: 6, fontSize: 10, background: '#7B2034', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>Institutional</span>}
                      </div>
                      <div style={{ fontSize: 11, color: '#776963' }}>
                        {d.file_name} • {d.page_count} pages • {d.chunk_count} indexed chunks • Status: <strong>{d.status}</strong>
                      </div>
                    </div>
                    {!d.is_global && (
                      <button className="copy-btn" title="Remove Document" onClick={() => handleDeleteDocument(d.id)}>
                        <Icons.Trash />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Source Citation Panel Modal (FR-5.2) */}
      {activeModal === 'source' && sourceData && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Grounded Source Verification (FR-5.2)</div>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="source-panel-card">
                <div className="source-header-meta">
                  <span>Citation: {sourceData.citation}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#7B2034' }}>
                  Document: {sourceData.document}
                </div>
                <div className="source-body-text">
                  {sourceData.text}
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#7E6F68' }}>
                Per SRS Section 5, all model answers are restricted strictly to these extracted document passages with zero reliance on outside hallucination.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal (SRS FR-7.1) */}
      {activeModal === 'settings' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Assistant Configuration & Gemini API (FR-7.1)</div>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <form className="modal-body" onSubmit={handleSaveSettings}>
              <div className="form-group">
                <label className="form-label">Google Gemini API Key</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder={settingsData.has_api_key ? `Configured (${settingsData.masked_key})` : "Enter your Google Gemini API Key"}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                />
                <span style={{ fontSize: 11, color: settingsData.has_api_key ? '#2E7D32' : '#C28E3A', fontWeight: 500 }}>
                  {settingsData.has_api_key ? "✓ Gemini API Key configured and active." : "Optional: Enter a key to stream Gemini generation. A local grounded engine is active as backup."}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Gemini Model Choice (C-1, FR-7.1)</label>
                <select
                  className="form-select"
                  value={settingsData.model_name}
                  onChange={(e) => setSettingsData({ ...settingsData, model_name: e.target.value })}
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended: Fast & Accurate)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen)</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Temperature: {settingsData.temperature}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settingsData.temperature}
                    onChange={(e) => setSettingsData({ ...settingsData, temperature: parseFloat(e.target.value) })}
                  />
                  <span style={{ fontSize: 11, color: '#7E6F68' }}>SRS 5.4 mandates temperature ≤ 0.2 for accuracy</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Top K Retrieved Chunks: {settingsData.top_k}</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    className="form-input"
                    value={settingsData.top_k}
                    onChange={(e) => setSettingsData({ ...settingsData, top_k: parseInt(e.target.value) || 8 })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcements Modal */}
      {activeModal === 'announcements' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Meridian Crest Announcements & Notices</div>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ padding: '12px 16px', background: '#F8EFE9', borderRadius: 10, border: '1px solid #EADCD3' }}>
                <div style={{ fontWeight: 700, color: '#7B2034' }}>📌 2026–2027 Academic Handbook Published</div>
                <div style={{ fontSize: 12, color: '#6A5C56', marginTop: 4 }}>
                  The Office of the Provost has issued Edition 1.0 of the Institutional Policy Handbook. All policies on grading, FERPA, code of conduct, and graduation are now live in the AI Campus Assistant.
                </div>
              </div>
              <div style={{ padding: '12px 16px', background: '#F8EFE9', borderRadius: 10, border: '1px solid #EADCD3' }}>
                <div style={{ fontWeight: 700, color: '#7B2034' }}>📅 Add/Drop and Course Withdrawal Reminders</div>
                <div style={{ fontSize: 12, color: '#6A5C56', marginTop: 4 }}>
                  Add period closes at the end of Week 1. Courses dropped before Week 2 will not appear on your transcript. See Policy 4.3 for details.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FERPA & Student Privacy Modal */}
      {activeModal === 'privacy' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Student Privacy & FERPA Compliance (Policy 8)</div>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <div className="modal-body" style={{ fontSize: 13, lineHeight: 1.5 }}>
              <p><strong>Meridian Crest College Privacy Guarantee:</strong></p>
              <ul style={{ marginLeft: 20 }}>
                <li><strong>FERPA Rights:</strong> Under Policy 8.1, student education records are strictly confidential and protected from unauthorized disclosure.</li>
                <li><strong>No Model Training:</strong> Uploaded documents and questions are never used to train external LLM models (SRS NFR-9).</li>
                <li><strong>Ephemeral Retention:</strong> Chat session vectors and uploaded materials expire automatically after 24 hours of inactivity (SRS FR-6.3).</li>
                <li><strong>Prompt Injection Defense:</strong> System instructions treat all incoming user files and text purely as passive data (SRS SP-7).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {activeModal === 'history' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Previous Conversations</div>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <div className="modal-body">
              {recentChats.length === 0 ? (
                <div style={{ color: '#7E6F68', textAlign: 'center', padding: 20 }}>No saved chats found.</div>
              ) : (
                recentChats.map((rc) => (
                  <div
                    key={rc.session_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#F8EFE9',
                      border: '1px solid #EADCD3',
                      borderRadius: 10,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSessionId(rc.session_id);
                      setActiveModal(null);
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#7B2034' }}>{rc.title}</div>
                      <div style={{ fontSize: 11, color: '#7A6B65' }}>ID: {rc.session_id} • {rc.message_count} messages</div>
                    </div>
                    <Icons.ChevronRight />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {activeModal === 'favorites' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Bookmarked Answers ({favorites.length})</div>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <div className="modal-body">
              {favorites.length === 0 ? (
                <div style={{ color: '#7E6F68', textAlign: 'center', padding: 20 }}>No saved answers yet. Click the bookmark icon on any answer to save it here.</div>
              ) : (
                favorites.map((fav) => (
                  <div key={fav.id} style={{ padding: '12px 14px', background: '#F8EFE9', border: '1px solid #EADCD3', borderRadius: 10, fontSize: 13 }}>
                    <div dangerouslySetInnerHTML={{ __html: window.marked ? window.marked.parse(fav.content) : fav.content }} />
                    <button className="copy-btn" style={{ marginTop: 8 }} onClick={() => handleBookmark(fav)}>
                      Remove bookmark
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mount React Root
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
