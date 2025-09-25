import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserManagement.module.scss';

const mockUsers = [
  { 
    id: 1, 
    name: 'Aarav Sharma', 
    email: 'aarav.sharma@university.edu', 
    status: 'active',
    joinDate: '2024-01-15',
    lastActive: '2024-12-15',
    totalSessions: 24,
    role: 'student'
  },
  { 
    id: 2, 
    name: 'Dia Patel', 
    email: 'dia.patel@university.edu', 
    status: 'active',
    joinDate: '2024-02-20',
    lastActive: '2024-12-14',
    totalSessions: 18,
    role: 'student'
  },
  { 
    id: 3, 
    name: 'Kabir Singh', 
    email: 'kabir.singh@university.edu', 
    status: 'suspended',
    joinDate: '2024-01-10',
    lastActive: '2024-12-10',
    totalSessions: 12,
    role: 'student'
  },
  { 
    id: 4, 
    name: 'Priya Kumar', 
    email: 'priya.kumar@university.edu', 
    status: 'active',
    joinDate: '2024-03-05',
    lastActive: '2024-12-15',
    totalSessions: 31,
    role: 'student'
  },
  { 
    id: 5, 
    name: 'Rohan Gupta', 
    email: 'rohan.gupta@university.edu', 
    status: 'inactive',
    joinDate: '2024-01-25',
    lastActive: '2024-11-28',
    totalSessions: 8,
    role: 'student'
  }
];

export function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUserAction = (userId, action) => {
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === userId) {
          switch (action) {
            case 'suspend':
              return { ...user, status: 'suspended' };
            case 'activate':
              return { ...user, status: 'active' };
            case 'delete':
              return { ...user, status: 'deleted' };
            default:
              return user;
          }
        }
        return user;
      })
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'suspended': return '#f59e0b';
      case 'inactive': return '#6b7280';
      case 'deleted': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '🟢';
      case 'suspended': return '🟡';
      case 'inactive': return '⚪';
      case 'deleted': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className={styles.userManagementPage}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={() => navigate('/admin/dashboard')} className={styles.backBtn}>
            ← Back to Dashboard
          </button>
          <div className={styles.headerInfo}>
            <h1>User Management</h1>
            <p>Manage and monitor user accounts</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.userCount}>
            <span className={styles.countNumber}>{filteredUsers.length}</span>
            <span className={styles.countLabel}>Users</span>
          </div>
        </div>
      </header>

      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <div className={styles.searchIcon}>🔍</div>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className={styles.usersTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderCell}>User</div>
          <div className={styles.tableHeaderCell}>Status</div>
          <div className={styles.tableHeaderCell}>Join Date</div>
          <div className={styles.tableHeaderCell}>Last Active</div>
          <div className={styles.tableHeaderCell}>Sessions</div>
          <div className={styles.tableHeaderCell}>Actions</div>
        </div>

        <div className={styles.tableBody}>
          {filteredUsers.map(user => (
            <div key={user.id} className={styles.tableRow}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.userDetails}>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userEmail}>{user.email}</div>
                </div>
              </div>

              <div className={styles.statusCell}>
                <div 
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(user.status) }}
                >
                  <span className={styles.statusIcon}>{getStatusIcon(user.status)}</span>
                  <span className={styles.statusText}>{user.status}</span>
                </div>
              </div>

              <div className={styles.dateCell}>
                <div className={styles.dateValue}>
                  {new Date(user.joinDate).toLocaleDateString()}
                </div>
              </div>

              <div className={styles.dateCell}>
                <div className={styles.dateValue}>
                  {new Date(user.lastActive).toLocaleDateString()}
                </div>
              </div>

              <div className={styles.sessionsCell}>
                <div className={styles.sessionsValue}>{user.totalSessions}</div>
              </div>

              <div className={styles.actionsCell}>
                <button
                  onClick={() => setSelectedUser(user)}
                  className={styles.actionBtn}
                >
                  View Details
                </button>
                {user.status === 'active' ? (
                  <button
                    onClick={() => handleUserAction(user.id, 'suspend')}
                    className={`${styles.actionBtn} ${styles.warningBtn}`}
                  >
                    Suspend
                  </button>
                ) : (
                  <button
                    onClick={() => handleUserAction(user.id, 'activate')}
                    className={`${styles.actionBtn} ${styles.successBtn}`}
                  >
                    Activate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setSelectedUser(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>User Details</h3>
              <button onClick={() => setSelectedUser(null)} className={styles.closeBtn}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.userProfile}>
                <div className={styles.profileAvatar}>
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.profileInfo}>
                  <h4>{selectedUser.name}</h4>
                  <p>{selectedUser.email}</p>
                  <div 
                    className={styles.profileStatus}
                    style={{ backgroundColor: getStatusColor(selectedUser.status) }}
                  >
                    {getStatusIcon(selectedUser.status)} {selectedUser.status}
                  </div>
                </div>
              </div>
              
              <div className={styles.userStats}>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Total Sessions</div>
                  <div className={styles.statValue}>{selectedUser.totalSessions}</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Join Date</div>
                  <div className={styles.statValue}>
                    {new Date(selectedUser.joinDate).toLocaleDateString()}
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Last Active</div>
                  <div className={styles.statValue}>
                    {new Date(selectedUser.lastActive).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}