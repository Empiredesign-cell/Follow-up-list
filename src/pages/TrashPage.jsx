import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { RotateCcw, Trash2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { fmtDateTime } from '../lib/helpers';
import { logActivity } from '../lib/activity';

export default function TrashPage({ divisionId }) {
  const { profile } = useAuth();
  const [tasks,setTasks]=useState([]);
  const [stickies,setStickies]=useState([]);

  useEffect(()=>{
    if(!divisionId){setTasks([]);return;}
    const q=query(collection(db,'tasks'),where('divisionId','==',divisionId));
    return onSnapshot(q,s=>setTasks(s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>!!x.deletedAt)));
  },[divisionId]);
  useEffect(()=>{
    if(!divisionId){setStickies([]);return;}
    const q=query(collection(db,'stickyNotes'),where('divisionId','==',divisionId));
    return onSnapshot(q,s=>setStickies(s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>!!x.deletedAt)));
  },[divisionId]);

  const restoreTask=async(x)=>{await updateDoc(doc(db,'tasks',x.id),{deletedAt:null,deletedBy:'',updatedAt:serverTimestamp()});await logActivity({actor:profile,action:'memulihkan task dari Trash',entityType:'task',entityId:x.id,divisionId,metadata:{title:x.title}})};
  const restoreSticky=async(x)=>{await updateDoc(doc(db,'stickyNotes',x.id),{deletedAt:null,deletedBy:'',updatedAt:serverTimestamp()});await logActivity({actor:profile,action:'memulihkan sticky dari Trash',entityType:'sticky',entityId:x.id,divisionId,metadata:{title:x.title}})};
  const purge=async(type,x)=>{if(!confirm('Hapus permanen? Tindakan ini tidak dapat dibatalkan.'))return;await deleteDoc(doc(db,type==='task'?'tasks':'stickyNotes',x.id));};

  return <div className="stack">
    <div><h1 style={{marginBottom:4}}>Trash</h1><div className="muted">Item yang dihapus dengan tombol X sekarang bisa dipulihkan.</div></div>
    <div className="card card-pad"><h3>Task Terhapus</h3><table className="table"><thead><tr><th>Task</th><th>Dihapus</th><th>Aksi</th></tr></thead><tbody>{tasks.map(x=><tr key={x.id}><td><b>{x.title}</b></td><td>{fmtDateTime(x.deletedAt)}</td><td><div className="row"><button className="btn btn-ghost" onClick={()=>restoreTask(x)}><RotateCcw size={14}/> Pulihkan</button><button className="btn btn-danger" onClick={()=>purge('task',x)}><Trash2 size={14}/></button></div></td></tr>)}</tbody></table>{!tasks.length&&<div className="empty">Trash task kosong.</div>}</div>
    <div className="card card-pad"><h3>Sticky Terhapus</h3><table className="table"><thead><tr><th>Sticky</th><th>Dihapus</th><th>Aksi</th></tr></thead><tbody>{stickies.map(x=><tr key={x.id}><td><b>{x.title||'(tanpa judul)'}</b><div className="small muted">{x.content?.slice(0,80)}</div></td><td>{fmtDateTime(x.deletedAt)}</td><td><div className="row"><button className="btn btn-ghost" onClick={()=>restoreSticky(x)}><RotateCcw size={14}/> Pulihkan</button><button className="btn btn-danger" onClick={()=>purge('sticky',x)}><Trash2 size={14}/></button></div></td></tr>)}</tbody></table>{!stickies.length&&<div className="empty">Trash sticky kosong.</div>}</div>
  </div>;
}
