import React, { useEffect, useMemo, useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { deleteApp, initializeApp } from 'firebase/app';
import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { Building2, DatabaseZap, Plus, Shield, UserPlus } from 'lucide-react';
import { db, firebaseConfig } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../lib/constants';
import { migrateLegacyData } from '../lib/migration';

export default function AdminPage() {
  const { profile, isSuperAdmin } = useAuth();
  const [tab,setTab]=useState('users');
  const [users,setUsers]=useState([]);
  const [divisions,setDivisions]=useState([]);
  const [userForm,setUserForm]=useState({name:'',email:'',password:'',role:'member',divisionIds:[]});
  const [divisionName,setDivisionName]=useState('');
  const [notice,setNotice]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [migration,setMigration]=useState(null);

  useEffect(()=>onSnapshot(collection(db,'users'),s=>setUsers(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
  useEffect(()=>onSnapshot(collection(db,'divisions'),s=>setDivisions(s.docs.map(d=>({id:d.id,...d.data()})))),[]);

  if(!isSuperAdmin) return <div className="error">Halaman ini hanya untuk super admin.</div>;

  const createDivision=async(e)=>{
    e.preventDefault(); if(!divisionName.trim())return; setBusy(true);setError('');
    try{
      await addDoc(collection(db,'divisions'),{
        name:divisionName.trim(),code:divisionName.trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10),active:true,createdAt:serverTimestamp(),createdBy:profile.uid,
        attendance:{arrival:{enabled:true,time:'08:00',days:[1,2,3,4,5],message:'Jangan lupa absen masuk dulu ya.'},departure:{enabled:true,time:'17:00',days:[1,2,3,4,5],message:'Sebelum pulang, jangan lupa absen dulu ya.'}},
      });
      setDivisionName('');setNotice('Divisi berhasil dibuat.');
    }catch(e){setError(e.message);}finally{setBusy(false);}
  };

  const createUser=async(e)=>{
    e.preventDefault(); setBusy(true);setError('');setNotice('');
    let secondary;
    try{
      secondary=initializeApp(firebaseConfig,`userCreator-${Date.now()}`);
      const secondaryAuth=getAuth(secondary);
      const cred=await createUserWithEmailAndPassword(secondaryAuth,userForm.email.trim(),userForm.password);
      await setDoc(doc(db,'users',cred.user.uid),{
        name:userForm.name.trim(),email:userForm.email.trim().toLowerCase(),role:userForm.role,divisionIds:userForm.divisionIds,active:true,createdAt:serverTimestamp(),createdBy:profile.uid,
      });
      await signOut(secondaryAuth);
      setUserForm({name:'',email:'',password:'',role:'member',divisionIds:[]});
      setNotice('Akun berhasil dibuat. Berikan email + password sementara ke pengguna.');
    }catch(e){setError(e.code||e.message);}finally{if(secondary)await deleteApp(secondary).catch(()=>{});setBusy(false);}
  };

  const toggleDivision=(id)=>setUserForm(f=>({...f,divisionIds:f.divisionIds.includes(id)?f.divisionIds.filter(x=>x!==id):[...f.divisionIds,id]}));
  const toggleUserActive=(u)=>updateDoc(doc(db,'users',u.id),{active:u.active===false?true:false,updatedAt:serverTimestamp()});

  const runMigration=async()=>{
    if(!confirm('Mulai migrasi data lama? Proses bersifat idempotent dan tidak menghapus collection lama.'))return;
    setBusy(true);setError('');setNotice('');setMigration({divisions:0,tasks:0,stickies:0,current:'Mulai...'});
    try{const result=await migrateLegacyData(profile.uid,setMigration);setMigration({...result,current:'Selesai'});setNotice('Migrasi selesai. Data lama tetap dipertahankan sebagai backup.');}
    catch(e){setError(e.message);}finally{setBusy(false);}
  };

  return <div className="stack">
    <div><h1 style={{marginBottom:4}}>Admin Control Center</h1><div className="muted">User, divisi, dan migrasi Follow Up lama.</div></div>
    <div className="tabs"><button className={tab==='users'?'active':''} onClick={()=>setTab('users')}><UserPlus size={14}/> Users</button><button className={tab==='divisions'?'active':''} onClick={()=>setTab('divisions')}><Building2 size={14}/> Divisions</button><button className={tab==='migration'?'active':''} onClick={()=>setTab('migration')}><DatabaseZap size={14}/> Migration</button></div>
    {notice&&<div className="success">{notice}</div>}{error&&<div className="error">{error}</div>}

    {tab==='users'&&<div className="grid grid-3" style={{gridTemplateColumns:'1fr 1.6fr'}}>
      <form className="card card-pad stack" onSubmit={createUser}><h3 style={{marginTop:0}}>Tambah User</h3><div><label className="label">Nama</label><input className="input" value={userForm.name} onChange={e=>setUserForm({...userForm,name:e.target.value})} required/></div><div><label className="label">Email</label><input className="input" type="email" value={userForm.email} onChange={e=>setUserForm({...userForm,email:e.target.value})} required/></div><div><label className="label">Password sementara</label><input className="input" type="password" minLength="6" value={userForm.password} onChange={e=>setUserForm({...userForm,password:e.target.value})} required/></div><div><label className="label">Role</label><select className="select" value={userForm.role} onChange={e=>setUserForm({...userForm,role:e.target.value})}><option value="member">Member</option><option value="division_admin">Division Admin</option><option value="super_admin">Super Admin</option></select></div><div><label className="label">Divisi</label><div className="stack">{divisions.map(d=><label className="division-pill" key={d.id}><input type="checkbox" checked={userForm.divisionIds.includes(d.id)} onChange={()=>toggleDivision(d.id)}/>{d.name}</label>)}</div></div><button className="btn btn-primary" disabled={busy}>Buat Akun</button></form>
      <div className="card card-pad"><h3 style={{marginTop:0}}>Daftar User</h3><table className="table"><thead><tr><th>User</th><th>Role</th><th>Divisi</th><th>Status</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td><b>{u.name||'-'}</b><div className="small muted">{u.email}</div></td><td>{u.role}</td><td className="small">{(u.divisionIds||[]).map(id=>divisions.find(d=>d.id===id)?.name||id).join(', ')||'-'}</td><td><button className={`btn ${u.active===false?'btn-danger':'btn-ghost'}`} onClick={()=>toggleUserActive(u)}>{u.active===false?'Nonaktif':'Aktif'}</button></td></tr>)}</tbody></table></div>
    </div>}

    {tab==='divisions'&&<div className="grid grid-3" style={{gridTemplateColumns:'1fr 1.6fr'}}><form className="card card-pad stack" onSubmit={createDivision}><h3 style={{marginTop:0}}>Divisi Baru</h3><input className="input" value={divisionName} onChange={e=>setDivisionName(e.target.value)} placeholder="Contoh: Design"/><button className="btn btn-primary" disabled={busy}><Plus size={16}/> Tambah Divisi</button></form><div className="card card-pad"><h3 style={{marginTop:0}}>Divisi</h3>{divisions.map(d=><div className="task" key={d.id}><b>{d.name}</b><div className="small muted">Masuk {d.attendance?.arrival?.time||'08:00'} • Pulang {d.attendance?.departure?.time||'17:00'}</div></div>)}</div></div>}

    {tab==='migration'&&<div className="card card-pad stack"><div className="row"><DatabaseZap/><div><h3 style={{margin:0}}>Migrasi Legacy → V2</h3><div className="muted small">Membaca folders/workspace_data lama. Tidak menghapus data lama.</div></div></div><div className="notice">Jalankan setelah Firestore Rules V2 dipublish dan akun super admin sudah aktif. ID divisi legacy dipertahankan agar hubungan data tetap konsisten.</div>{migration&&<div className="grid grid-4"><div className="stat card"><div className="muted">Divisi</div><div className="num">{migration.divisions||0}</div></div><div className="stat card"><div className="muted">Task</div><div className="num">{migration.tasks||0}</div></div><div className="stat card"><div className="muted">Sticky</div><div className="num">{migration.stickies||0}</div></div><div className="stat card"><div className="muted">Status</div><div style={{marginTop:10,fontWeight:900}}>{migration.current}</div></div></div>}<button className="btn btn-primary" disabled={busy} onClick={runMigration}>{busy?'Migrasi berjalan...':'Mulai Migrasi Aman'}</button></div>}
  </div>;
}
