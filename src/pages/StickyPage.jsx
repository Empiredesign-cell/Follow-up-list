import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { Archive, Plus, Trash2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { STICKY_COLORS } from '../lib/constants';
import { logActivity } from '../lib/activity';

export default function StickyPage({ divisionId }) {
  const { profile } = useAuth();
  const [notes,setNotes] = useState([]);

  useEffect(()=>{
    if(!divisionId){setNotes([]);return;}
    const q=query(collection(db,'stickyNotes'),where('divisionId','==',divisionId));
    return onSnapshot(q,snap=>{
      const rows=snap.docs.map(d=>({id:d.id,...d.data()})).filter(n=>!n.deletedAt && !n.archivedAt);
      rows.sort((a,b)=>(b.updatedAt?.seconds||0)-(a.updatedAt?.seconds||0));
      setNotes(rows);
    });
  },[divisionId]);

  const add=async()=>{
    if(!divisionId)return;
    const ref=await addDoc(collection(db,'stickyNotes'),{
      divisionId,title:'',content:'',color:STICKY_COLORS[Math.floor(Math.random()*STICKY_COLORS.length)],
      createdBy:profile.uid,createdAt:serverTimestamp(),updatedAt:serverTimestamp(),archivedAt:null,deletedAt:null,
    });
    await logActivity({actor:profile,action:'membuat sticky note',entityType:'sticky',entityId:ref.id,divisionId});
  };

  const patch=(id,patch)=>updateDoc(doc(db,'stickyNotes',id),{...patch,updatedAt:serverTimestamp(),updatedBy:profile.uid});
  const archive=async(note)=>{await patch(note.id,{archivedAt:serverTimestamp()});await logActivity({actor:profile,action:'mengarsip sticky',entityType:'sticky',entityId:note.id,divisionId,metadata:{title:note.title}})};
  const remove=async(note)=>{if(!confirm('Pindahkan sticky ini ke Trash?'))return;await patch(note.id,{deletedAt:serverTimestamp(),deletedBy:profile.uid});await logActivity({actor:profile,action:'menghapus sticky ke Trash',entityType:'sticky',entityId:note.id,divisionId,metadata:{title:note.title}})};

  return <div className="stack">
    <div className="row-between"><div><h1 style={{marginBottom:4}}>Sticky Notes</h1><div className="muted">Tombol X tidak lagi menghapus permanen. Semua masuk Trash.</div></div><button className="btn btn-primary" disabled={!divisionId} onClick={add}><Plus size={17}/> Sticky Baru</button></div>
    {!divisionId?<div className="notice">Pilih divisi terlebih dahulu.</div>:<div className="sticky-grid">
      {notes.map(note=><div className="sticky" key={note.id} style={{background:note.color||'#fde68a'}}>
        <div className="row" style={{position:'absolute',right:10,top:10}}>
          <button className="btn" style={{padding:6,background:'rgba(255,255,255,.45)',color:'#111827'}} title="Arsip" onClick={()=>archive(note)}><Archive size={14}/></button>
          <button className="btn" style={{padding:6,background:'rgba(239,68,68,.8)'}} title="Trash" onClick={()=>remove(note)}><Trash2 size={14}/></button>
        </div>
        <input value={note.title||''} placeholder="Judul..." onChange={e=>patch(note.id,{title:e.target.value})}/>
        <textarea value={note.content||''} placeholder={'Ketik catatan...\n- item ceklis'} onChange={e=>patch(note.id,{content:e.target.value})}/>
      </div>)}
      {!notes.length&&<div className="empty">Belum ada sticky aktif.</div>}
    </div>}
  </div>;
}
