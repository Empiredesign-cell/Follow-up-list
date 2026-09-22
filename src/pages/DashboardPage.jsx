import React, { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { fmtDateTime } from '../lib/helpers';

export default function DashboardPage({ divisionId }) {
  const [tasks,setTasks] = useState([]);
  const [activity,setActivity] = useState([]);

  useEffect(()=>{
    if(!divisionId){setTasks([]);return;}
    const u = onSnapshot(collection(db,'tasks'),snap=>{
      setTasks(snap.docs.map(d=>({id:d.id,...d.data()})).filter(t=>t.divisionId===divisionId && !t.deletedAt));
    });
    return u;
  },[divisionId]);

  useEffect(()=>{
    if(!divisionId){setActivity([]);return;}
    return onSnapshot(collection(db,'activityLogs'),snap=>{
      const rows=snap.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.divisionId===divisionId);
      rows.sort((a,b)=>((b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)));
      setActivity(rows.slice(0,8));
    });
  },[divisionId]);

  const stats=useMemo(()=>({
    todo:tasks.filter(t=>t.status==='todo').length,
    progress:tasks.filter(t=>t.status==='in_progress').length,
    done:tasks.filter(t=>t.status==='done').length,
    overdue:tasks.filter(t=>t.status!=='done' && t.dueAt && new Date(t.dueAt)<new Date()).length,
  }),[tasks]);

  return <div className="stack">
    <div><h1 style={{marginBottom:4}}>Dashboard</h1><div className="muted">Ringkasan operasional divisi hari ini.</div></div>
    <div className="grid grid-4">
      <div className="card stat"><div className="muted">To Do</div><div className="num">{stats.todo}</div></div>
      <div className="card stat"><div className="muted">In Progress</div><div className="num">{stats.progress}</div></div>
      <div className="card stat"><div className="muted">Done</div><div className="num">{stats.done}</div></div>
      <div className="card stat"><div className="muted">Overdue</div><div className="num" style={{color:'#f87171'}}>{stats.overdue}</div></div>
    </div>
    <div className="grid grid-3" style={{gridTemplateColumns:'2fr 1fr'}}>
      <div className="card card-pad">
        <div className="row-between"><h3 style={{margin:0}}>Deadline Terdekat</h3></div>
        <div className="stack" style={{marginTop:12}}>{tasks.filter(t=>t.status!=='done'&&t.dueAt).sort((a,b)=>new Date(a.dueAt)-new Date(b.dueAt)).slice(0,8).map(t=><div className="task" key={t.id}><b>{t.title}</b><div className="muted small">{fmtDateTime(t.dueAt)} • {t.priority||'normal'}</div></div>)}{!tasks.some(t=>t.status!=='done'&&t.dueAt)&&<div className="empty">Belum ada deadline aktif.</div>}</div>
      </div>
      <div className="card card-pad">
        <h3 style={{marginTop:0}}>Aktivitas</h3>
        <div className="stack">{activity.map(a=><div key={a.id}><b>{a.actorName||'User'}</b><div className="small muted">{a.action} • {fmtDateTime(a.createdAt)}</div></div>)}{!activity.length&&<div className="empty">Belum ada activity log.</div>}</div>
      </div>
    </div>
  </div>;
}
