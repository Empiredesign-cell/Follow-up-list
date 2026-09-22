import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Activity, Archive, Bell, Building2, ClipboardList, Inbox, LayoutDashboard, LogOut, StickyNote, Trash2, UserCog } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import AttendanceReminder from './AttendanceReminder';

const navBase = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Task', icon: ClipboardList },
  { to: '/sticky', label: 'Sticky', icon: StickyNote },
  { to: '/inbox', label: 'Inbox', icon: Inbox },
  { to: '/archive', label: 'Archive', icon: Archive },
  { to: '/trash', label: 'Trash', icon: Trash2 },
  { to: '/activity', label: 'Activity', icon: Activity },
];

export default function Layout({ children, activeDivisionId, setActiveDivisionId }) {
  const { profile, isSuperAdmin, logout } = useAuth();
  const [divisions, setDivisions] = useState([]);
  const [alarmOpen, setAlarmOpen] = useState(false);
  const location = useLocation();

  useEffect(() => onSnapshot(collection(db, 'divisions'), (snap) => {
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((d) => d.active !== false);
    all.sort((a,b) => (a.name || '').localeCompare(b.name || ''));
    setDivisions(all);
  }), []);

  const allowedDivisions = useMemo(() => {
    if (isSuperAdmin) return divisions;
    const ids = profile?.divisionIds || [];
    return divisions.filter((d) => ids.includes(d.id));
  }, [divisions, profile, isSuperAdmin]);

  useEffect(() => {
    if (!allowedDivisions.length) return;
    const currentStillAllowed = allowedDivisions.some((d) => d.id === activeDivisionId);
    if (!currentStillAllowed) setActiveDivisionId(allowedDivisions[0].id);
  }, [allowedDivisions, activeDivisionId, setActiveDivisionId]);

  const activeDivision = allowedDivisions.find((d) => d.id === activeDivisionId) || null;
  const nav = isSuperAdmin ? [...navBase, { to: '/admin', label: 'Admin', icon: UserCog }] : navBase;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-badge">FL</div><span>Workspace V2</span></div>
        <nav className="nav">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
              <Icon size={20}/><span>{label}</span>
            </NavLink>
          ))}
          <button onClick={() => setAlarmOpen(true)}><Bell size={20}/><span>Reminder</span></button>
          <button onClick={logout}><LogOut size={20}/><span>Keluar</span></button>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div style={{fontWeight:900,fontSize:18}}>{activeDivision?.name || 'Belum ada divisi'}</div>
            <div className="muted small title-sub">{profile?.name || profile?.email} • {profile?.role?.replace('_',' ')}</div>
          </div>
          <div className="row">
            <Building2 size={18} className="muted"/>
            <select className="select" style={{width:220}} value={activeDivisionId || ''} onChange={(e) => setActiveDivisionId(e.target.value)}>
              {!allowedDivisions.length && <option value="">Tidak ada divisi</option>}
              {allowedDivisions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
      <AttendanceReminder open={alarmOpen} onClose={() => setAlarmOpen(false)} division={activeDivision} />
    </div>
  );
}
