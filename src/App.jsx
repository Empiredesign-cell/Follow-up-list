import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import StickyPage from './pages/StickyPage';
import InboxPage from './pages/InboxPage';
import TrashPage from './pages/TrashPage';
import ArchivePage from './pages/ArchivePage';
import ActivityPage from './pages/ActivityPage';
import AdminPage from './pages/AdminPage';

function Loading({ text='Memuat akun...' }) {
  return <div className="login-page"><div style={{textAlign:'center'}}><LoaderCircle size={44} className="spin"/><h3>{text}</h3></div></div>;
}

export default function App() {
  const { authReady, profileReady, isAuthenticated, profile, isActive, logout } = useAuth();
  const [activeDivisionId,setActiveDivisionId] = useState(()=>localStorage.getItem('flv2ActiveDivision')||'');

  useEffect(()=>{ if(activeDivisionId)localStorage.setItem('flv2ActiveDivision',activeDivisionId); },[activeDivisionId]);

  if(!authReady || (isAuthenticated && !profileReady)) return <Loading/>;
  if(!isAuthenticated) return <LoginPage/>;
  if(!profile) return <div className="login-page"><div className="card login-card"><h2>Akun Auth sudah ada, tetapi profil belum dibuat.</h2><p className="muted">Minta super admin membuat dokumen <b>users/{'{uid}'}</b> untuk akun ini.</p><button className="btn btn-ghost" onClick={logout}>Keluar</button></div></div>;
  if(!isActive) return <div className="login-page"><div className="card login-card"><h2>Akun dinonaktifkan</h2><p className="muted">Hubungi administrator.</p><button className="btn btn-ghost" onClick={logout}>Keluar</button></div></div>;

  const page=(component)=><Layout activeDivisionId={activeDivisionId} setActiveDivisionId={setActiveDivisionId}>{component}</Layout>;
  return <Routes>
    <Route path="/" element={page(<DashboardPage divisionId={activeDivisionId}/>)} />
    <Route path="/tasks" element={page(<TasksPage divisionId={activeDivisionId}/>)} />
    <Route path="/sticky" element={page(<StickyPage divisionId={activeDivisionId}/>)} />
    <Route path="/inbox" element={page(<InboxPage divisionId={activeDivisionId}/>)} />
    <Route path="/archive" element={page(<ArchivePage divisionId={activeDivisionId}/>)} />
    <Route path="/trash" element={page(<TrashPage divisionId={activeDivisionId}/>)} />
    <Route path="/activity" element={page(<ActivityPage divisionId={activeDivisionId}/>)} />
    <Route path="/admin" element={page(<AdminPage/>)} />
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}
