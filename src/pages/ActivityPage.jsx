import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { fmtDateTime } from '../lib/helpers';

export default function ActivityPage({ divisionId }) {
  const [rows,setRows]=useState([]);
  useEffect(()=>{
    if(!divisionId){setRows([]);return;}
    const q=query(collection(db,'activityLogs'),where('divisionId','==',divisionId));
    return onSnapshot(q,s=>{
      const all=s.docs.map(d=>({id:d.id,...d.data()}));
      all.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
      setRows(all.slice(0,150));
    });
  },[divisionId]);
  return <div className="stack"><div><h1 style={{marginBottom:4}}>Activity Log</h1><div className="muted">Jejak siapa melakukan apa di divisi ini.</div></div><div className="card card-pad"><table className="table"><thead><tr><th>Waktu</th><th>User</th><th>Aktivitas</th><th>Detail</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{fmtDateTime(r.createdAt)}</td><td>{r.actorName||r.actorUid}</td><td>{r.action}</td><td className="small muted">{r.metadata?.title||r.entityId}</td></tr>)}</tbody></table>{!rows.length&&<div className="empty">Belum ada activity log.</div>}</div></div>;
}
