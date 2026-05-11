import { User } from '../types';
import './OrgChart.css';

interface Props {
  users: User[];
  currentUser: User;
}

function stringToColor(str: string): string {
  const palette = ['#6366f1','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#ef4444','#0ea5e9'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

const STATUS_LABEL: Record<User['status'], string> = {
  online: '온라인',
  away: '자리 비움',
  offline: '오프라인',
};

export default function OrgChart({ users, currentUser }: Props) {
  const departments = [...new Set(users.map(u => u.department).filter(Boolean))] as string[];

  return (
    <div className="org-chart">
      <div className="org-header">
        <h2>조직도</h2>
        <p>구성원 현황</p>
      </div>

      <div className="org-body">
        {departments.map(dept => (
          <section key={dept} className="dept-section">
            <div className="dept-heading">
              <span className="dept-name">{dept}</span>
              <span className="dept-count">{users.filter(u => u.department === dept).length}명</span>
            </div>
            <div className="member-grid">
              {users.filter(u => u.department === dept).map(user => (
                <div
                  key={user.id}
                  className={`member-card${user.id === currentUser.id ? ' me' : ''}`}
                >
                  <div className="mc-avatar-wrap">
                    <div className="mc-avatar" style={{ background: stringToColor(user.id) }}>
                      {user.avatar}
                    </div>
                    <span className={`status-dot status-${user.status}`} />
                  </div>
                  <div className="mc-info">
                    <div className="mc-name">
                      {user.name}
                      {user.id === currentUser.id && <span className="mc-me-tag">나</span>}
                    </div>
                    <div className="mc-position">{user.position}</div>
                    <div className={`mc-status status-text-${user.status}`}>
                      {STATUS_LABEL[user.status]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
