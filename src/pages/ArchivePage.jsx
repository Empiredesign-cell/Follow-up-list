import React, { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { RotateCcw, Trash2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { fmtDateTime } from '../lib/helpers';

export default function ArchivePage({ divisionId }) {
  const [notes,setNotes]=useState([]);
  useEffect(()=>{
    if(!divisionId){setNotes([]);return;}
    const q=query(collection(db,'stickyNotes'),where('divisionId','==',divisionId));
    return onSnapshot(q,s=>setNotes(s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>!!x.archivedAt&&!x.deletedAt)));
  },[divisionId]);
  const restore=x=>updateDoc(doc(db,'stickyNotes',x.id),{archivedAt:null,updatedAt:serverTimestamp()});
  const trash=x=>updateDoc(doc(db,'stickyNotes',x.id),{deletedAt:serverTimestamp(),updatedAt:serverTimestamp()});
  return <div className="stack"><div><h1 style={{marginBottom:4}}>Archive</h1><div className="muted">Sticky yang sengaja disimpan, terpisah dari Trash.</div></div><div className="card card-pad"><table className="table"><thead><tr><th>Sticky</th><th>Diarsip</th><th>Aksi</th></tr></thead><tbody>{notes.map(x=><tr key={x.id}><td><b>{x.title||'(tanpa judul)'}</b><div className="small muted">{x.content?.slice(0,120)}</div></td><td>{fmtDateTime(x.archivedAt)}</td><td><div className="row"><button className="btn btn-ghost" onClick={()=>restore(x)}><RotateCcw size={14}/> Pulihkan</button><button className="btn btn-ghost" onClick={()=>trash(x)}><Trash2 size={14}/> Trash</button></div></td></tr>)}</tbody></table>{!notes.length&&<div className="empty">Arsip kosong.</div>}</div></div>;
}
