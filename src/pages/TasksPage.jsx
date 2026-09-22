import React, { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { ArrowRight, Plus, Send, Trash2, X } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { PRIORITIES, TASK_STATUSES } from '../lib/constants';
import { fmtDateTime } from '../lib/helpers';
import { logActivity } from '../lib/activity';

const emptyForm = { title:'', description:'', priority:'normal', dueAt:'', assignedTo:'' };

export default function TasksPage({ divisionId }) {
  const { profile } = useAuth();
  const [tasks,setTasks] = useState([]);
  const [users,setUsers] = useState([]);
  const [divisions,setDivisions] = useState([]);
  const [form,setForm] = useState(emptyForm);
  const [modal,setModal] = useState(false);
  const [transferTask,setTransferTask] = useState(null);
  const [targetDivision,setTargetDivision] = useState('');
  const [busy,setBusy] = useState(false);

  useEffect(()=>{
    if(!divisionId){setTasks([]);return;}
    const q=query(collection(db,'tasks'),where('divisionId','==',divisionId));
    return onSnapshot(q,snap=>{
      const rows=snap.docs.map(d=>({id:d.id,...d.data()})).filter(t=>!t.deletedAt);
      rows.sort((a,b)=>(b.updatedAt?.seconds||0)-(a.updatedAt?.seconds||0));
      setTasks(rows);
    });
  },[divisionId]);

  useEffect(()=>onSnapshot(collection(db,'users'),snap=>setUsers(snap.docs.map(d=>({id:d.id,...d.data()})).filter(u=>u.active!==false))),[]);
  useEffect(()=>onSnapshot(collection(db,'divisions'),snap=>setDivisions(snap.docs.map(d=>({id:d.id,...d.data()})).filter(d=>d.active!==false))),[]);

  const createTask=async(e)=>{
    e.preventDefault(); if(!form.title.trim()||!divisionId)return;
    setBusy(true);
    try{
      const ref=await addDoc(collection(db,'tasks'),{
        divisionId,title:form.title.trim(),description:form.description.trim(),status:'todo',priority:form.priority,
        assignedTo:form.assignedTo||'',createdBy:profile.uid,createdByName:profile.name||profile.email,
        dueAt:form.dueAt||'',createdAt:serverTimestamp(),updatedAt:serverTimestamp(),completedAt:null,deletedAt:null,
      });
      await logActivity({actor:profile,action:'membuat task',entityType:'task',entityId:ref.id,divisionId,metadata:{title:form.title}});
      setForm(emptyForm); setModal(false);
    }finally{setBusy(false);}
  };

  const move=async(task,status)=>{
    await updateDoc(doc(db,'tasks',task.id),{status,updatedAt:serverTimestamp(),completedAt:status==='done'?serverTimestamp():null});
    await logActivity({actor:profile,action:`memindahkan task ke ${status}`,entityType:'task',entityId:task.id,divisionId,metadata:{title:task.title}});
  };

  const softDelete=async(task)=>{
    if(!confirm(`Pindahkan "${task.title}" ke Trash?`))return;
    await updateDoc(doc(db,'tasks',task.id),{deletedAt:serverTimestamp(),deletedBy:profile.uid,updatedAt:serverTimestamp()});
    await logActivity({actor:profile,action:'menghapus task ke Trash',entityType:'task',entityId:task.id,divisionId,metadata:{title:task.title}});
  };

  const sendTransfer=async()=>{
    if(!transferTask||!targetDivision)return;
    setBusy(true);
    try{
      await addDoc(collection(db,'taskTransfers'),{
        fromDivisionId:divisionId,toDivisionId:targetDivision,taskId:transferTask.id,
        taskSnapshot:{title:transferTask.title,description:transferTask.description||'',priority:transferTask.priority||'normal',dueAt:transferTask.dueAt||'',assignedTo:''},
        status:'pending',createdBy:profile.uid,createdByName:profile.name||profile.email,createdAt:serverTimestamp(),updatedAt:serverTimestamp(),
      });
      await updateDoc(doc(db,'tasks',transferTask.id),{transferPending:true,updatedAt:serverTimestamp()});
      await logActivity({actor:profile,action:'mengirim task lintas divisi',entityType:'task',entityId:transferTask.id,divisionId,metadata:{title:transferTask.title,toDivisionId:targetDivision}});
      setTransferTask(null);setTargetDivision('');
    }finally{setBusy(false);}
  };

  const byStatus=useMemo(()=>Object.fromEntries(TASK_STATUSES.map(s=>[s.id,tasks.filter(t=>t.status===s.id)])),[tasks]);
  const memberOptions=users.filter(u=>(u.divisionIds||[]).includes(divisionId));

  return <div className="stack">
    <div className="row-between"><div><h1 style={{marginBottom:4}}>Task Board</h1><div className="muted">Task sekarang tersimpan per dokumen, aman untuk multi-user.</div></div><button className="btn btn-primary" disabled={!divisionId} onClick={()=>setModal(true)}><Plus size={17}/> Task Baru</button></div>
    {!divisionId?<div className="notice">Pilih divisi terlebih dahulu.</div>:<div className="kanban">
      {TASK_STATUSES.map(col=><div className="card column" key={col.id}>
        <div className="column-header row-between"><span>{col.label}</span><span className="badge">{byStatus[col.id]?.length||0}</span></div>
        {(byStatus[col.id]||[]).map(task=><div className="task" key={task.id}>
          <div className="row-between" style={{alignItems:'flex-start'}}><div><b>{task.title}</b><div className="small muted" style={{marginTop:4}}>{task.description||'Tanpa deskripsi'}</div></div><span className={`badge ${task.priority==='urgent'?'badge-red':task.priority==='high'?'badge-amber':'badge-blue'}`}>{task.priority||'normal'}</span></div>
          <div className="small muted" style={{marginTop:10}}>Deadline: {fmtDateTime(task.dueAt)}{task.transferPending?' • sedang dikirim':''}</div>
          <div className="row" style={{marginTop:12,flexWrap:'wrap'}}>
            {TASK_STATUSES.filter(s=>s.id!==task.status).map(s=><button key={s.id} className="btn btn-ghost" style={{padding:'7px 9px'}} onClick={()=>move(task,s.id)}><ArrowRight size={13}/>{s.label}</button>)}
            <button className="btn btn-ghost" style={{padding:'7px 9px'}} onClick={()=>setTransferTask(task)}><Send size={13}/> Kirim</button>
            <button className="btn btn-ghost" style={{padding:'7px 9px',color:'#fca5a5'}} onClick={()=>softDelete(task)}><Trash2 size={13}/></button>
          </div>
        </div>)}
        {!byStatus[col.id]?.length&&<div className="empty" style={{margin:12}}>Kosong</div>}
      </div>)}
    </div>}

    {modal&&<div className="modal-backdrop"><form className="modal stack" onSubmit={createTask}>
      <div className="row-between"><h2 style={{margin:0}}>Task Baru</h2><button type="button" className="btn btn-ghost" onClick={()=>setModal(false)}><X size={18}/></button></div>
      <div><label className="label">Judul</label><input className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} autoFocus required/></div>
      <div><label className="label">Deskripsi</label><textarea className="textarea" rows="4" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
      <div className="grid grid-3">
        <div><label className="label">Priority</label><select className="select" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{PRIORITIES.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></div>
        <div><label className="label">Deadline</label><input className="input" type="datetime-local" value={form.dueAt} onChange={e=>setForm({...form,dueAt:e.target.value})}/></div>
        <div><label className="label">Assign</label><select className="select" value={form.assignedTo} onChange={e=>setForm({...form,assignedTo:e.target.value})}><option value="">Belum ditentukan</option>{memberOptions.map(u=><option key={u.id} value={u.id}>{u.name||u.email}</option>)}</select></div>
      </div>
      <button className="btn btn-primary" disabled={busy}>{busy?'Menyimpan...':'Simpan Task'}</button>
    </form></div>}

    {transferTask&&<div className="modal-backdrop"><div className="modal stack">
      <div className="row-between"><h2 style={{margin:0}}>Kirim Task</h2><button className="btn btn-ghost" onClick={()=>setTransferTask(null)}><X size={18}/></button></div>
      <div className="notice">Task <b>{transferTask.title}</b> akan masuk Inbox divisi tujuan. Mereka harus menerima sebelum task dibuat di sana.</div>
      <div><label className="label">Divisi tujuan</label><select className="select" value={targetDivision} onChange={e=>setTargetDivision(e.target.value)}><option value="">Pilih divisi</option>{divisions.filter(d=>d.id!==divisionId).map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
      <button className="btn btn-primary" disabled={!targetDivision||busy} onClick={sendTransfer}>Kirim ke Inbox</button>
    </div></div>}
  </div>;
}
