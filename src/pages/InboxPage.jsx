import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { Check, X } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { fmtDateTime, uniqueBy } from '../lib/helpers';
import { logActivity } from '../lib/activity';

export default function InboxPage({ divisionId }) {
  const { profile } = useAuth();
  const [incoming,setIncoming]=useState([]);
  const [outgoing,setOutgoing]=useState([]);

  useEffect(()=>{
    if(!divisionId){setIncoming([]);setOutgoing([]);return;}
    const qi=query(collection(db,'taskTransfers'),where('toDivisionId','==',divisionId));
    const qo=query(collection(db,'taskTransfers'),where('fromDivisionId','==',divisionId));
    const ui=onSnapshot(qi,s=>setIncoming(s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.status==='pending')));
    const uo=onSnapshot(qo,s=>setOutgoing(s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.status==='pending')));
    return ()=>{ui();uo();};
  },[divisionId]);

  const accept=async(t)=>{
    const snap=t.taskSnapshot||{};
    const ref=await addDoc(collection(db,'tasks'),{
      divisionId,title:snap.title||'Task transfer',description:snap.description||'',status:'todo',priority:snap.priority||'normal',dueAt:snap.dueAt||'',assignedTo:'',
      createdBy:profile.uid,createdByName:profile.name||profile.email,sourceTransferId:t.id,createdAt:serverTimestamp(),updatedAt:serverTimestamp(),completedAt:null,deletedAt:null,
    });
    await updateDoc(doc(db,'taskTransfers',t.id),{status:'accepted',acceptedBy:profile.uid,acceptedAt:serverTimestamp(),updatedAt:serverTimestamp()});
    if(t.taskId){try{await updateDoc(doc(db,'tasks',t.taskId),{transferPending:false,transferredTo:divisionId,updatedAt:serverTimestamp()});}catch{}}
    await logActivity({actor:profile,action:'menerima task lintas divisi',entityType:'task',entityId:ref.id,divisionId,metadata:{title:snap.title,fromDivisionId:t.fromDivisionId}});
  };
  const reject=async(t)=>updateDoc(doc(db,'taskTransfers',t.id),{status:'rejected',rejectedBy:profile.uid,rejectedAt:serverTimestamp(),updatedAt:serverTimestamp()});

  return <div className="stack">
    <div><h1 style={{marginBottom:4}}>Inbox Lintas Divisi</h1><div className="muted">Task masuk harus diterima dulu agar masuk board divisi tujuan.</div></div>
    <div className="grid grid-3" style={{gridTemplateColumns:'1fr 1fr'}}>
      <div className="card card-pad"><h3 style={{marginTop:0}}>Masuk</h3><div className="stack">{incoming.map(t=><div className="task" key={t.id}><b>{t.taskSnapshot?.title}</b><div className="muted small">Dari {t.createdByName||'divisi lain'} • {fmtDateTime(t.createdAt)}</div><div className="row" style={{marginTop:10}}><button className="btn btn-primary" onClick={()=>accept(t)}><Check size={14}/> Terima</button><button className="btn btn-ghost" onClick={()=>reject(t)}><X size={14}/> Tolak</button></div></div>)}{!incoming.length&&<div className="empty">Tidak ada task masuk.</div>}</div></div>
      <div className="card card-pad"><h3 style={{marginTop:0}}>Terkirim</h3><div className="stack">{outgoing.map(t=><div className="task" key={t.id}><b>{t.taskSnapshot?.title}</b><div className="muted small">Menunggu divisi tujuan • {fmtDateTime(t.createdAt)}</div></div>)}{!outgoing.length&&<div className="empty">Tidak ada transfer pending.</div>}</div></div>
    </div>
  </div>;
}
