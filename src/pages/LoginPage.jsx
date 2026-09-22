import React, { useState } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function LoginPage() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const [info,setInfo] = useState('');
  const [loading,setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(''); setInfo(''); setLoading(true);
    try { await signInWithEmailAndPassword(auth,email.trim(),password); }
    catch (err) { setError(err.code || err.message); }
    finally { setLoading(false); }
  };
  const reset = async () => {
    setError(''); setInfo('');
    if (!email.trim()) return setError('Isi email dulu.');
    try { await sendPasswordResetEmail(auth,email.trim()); setInfo('Link reset password sudah dikirim ke email.'); }
    catch (err) { setError(err.code || err.message); }
  };

  return <div className="login-page">
    <form className="card login-card" onSubmit={submit}>
      <div className="login-logo">FL</div>
      <h1 style={{margin:'0 0 6px'}}>FL Workspace</h1>
      <p className="muted" style={{marginTop:0}}>Masuk dengan akun divisi kamu.</p>
      <div className="stack" style={{marginTop:22}}>
        <div><label className="label">Email</label><input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/></div>
        <div><label className="label">Password</label><input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/></div>
        {error && <div className="error">{error}</div>}
        {info && <div className="success">{info}</div>}
        <button className="btn btn-primary" disabled={loading}>{loading?'Masuk...':'Masuk'}</button>
        <button type="button" className="btn btn-ghost" onClick={reset}>Lupa Password</button>
      </div>
    </form>
  </div>;
}
