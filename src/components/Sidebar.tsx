import { SidebarView, User } from '../types';
import './Sidebar.css';

interface Props {
  view: SidebarView;
  onViewChange: (v: SidebarView) => void;
  currentUser: User;
}

function OrgIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="5" rx="1.5"/>
      <rect x="2" y="17" width="7" height="5" rx="1.5"/>
      <rect x="15" y="17" width="7" height="5" rx="1.5"/>
      <path d="M12 7v4M5.5 17v-3a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v3"/>
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

export default function Sidebar({ view, onViewChange, currentUser }: Props) {
  return (
    <aside className="icon-sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">A</div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-btn${view === 'chat' ? ' active' : ''}`}
          onClick={() => onViewChange('chat')}
          title="채팅"
        >
          <ChatIcon />
          <span className="nav-label">채팅</span>
        </button>
        <button
          className={`nav-btn${view === 'org' ? ' active' : ''}`}
          onClick={() => onViewChange('org')}
          title="조직도"
        >
          <OrgIcon />
          <span className="nav-label">조직도</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className={`user-chip status-ring-${currentUser.status}`} title={currentUser.name}>
          {currentUser.avatar}
        </div>
      </div>
    </aside>
  );
}
