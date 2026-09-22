import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, Clock3, Volume2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const defaultSchedule = {
  arrival: { enabled: true, time: '08:00', days: [1,2,3,4,5], message: 'Jangan lupa absen masuk dulu ya.' },
  departure: { enabled: true, time: '17:00', days: [1,2,3,4,5], message: 'Sebelum pulang, jangan lupa absen dulu ya.' },
};

const TYPES = {
  arrival: { label: 'Absen Masuk', emoji: '👋', sound: '/absen-masuk.m4a' },
  departure: { label: 'Absen Pulang', emoji: '🏠', sound: '/alarm-pulang.mp3' },
};

export default function AttendanceReminder({ open, onClose, division }) {
  const { profile } = useAuth();
  const storageKey = `flv2Attendance:${profile?.uid || 'anon'}:${division?.id || 'none'}`;
  const divisionSchedule = division?.attendance || defaultSchedule;

  const [settings, setSettings] = useState(defaultSchedule);
  const settingsRef = useRef(settings);
  const [alarmType, setAlarmType] = useState(null);
  const [tab, setTab] = useState('arrival');
  const [audioStatus, setAudioStatus] = useState('Belum diuji');
  const audios = useRef({ arrival: null, departure: null });
  const triggerGuard = useRef({ arrival: '', departure: '' });

  useEffect(() => {
    const base = {
      arrival: { ...defaultSchedule.arrival, ...(divisionSchedule?.arrival || {}) },
      departure: { ...defaultSchedule.departure, ...(divisionSchedule?.departure || {}) },
    };
    try {
      const local = JSON.parse(localStorage.getItem(storageKey) || 'null');
      setSettings(local ? {
        arrival: { ...base.arrival, ...(local.arrival || {}) },
        departure: { ...base.departure, ...(local.departure || {}) },
      } : base);
    } catch { setSettings(base); }
  }, [storageKey, division?.id]);

  useEffect(() => {
    settingsRef.current = settings;
    try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch {}
  }, [settings, storageKey]);

  const getAudio = (type) => {
    if (!audios.current[type]) {
      const a = new Audio(TYPES[type].sound);
      a.loop = true;
      a.preload = 'auto';
      audios.current[type] = a;
    }
    return audios.current[type];
  };

  const stopAll = () => {
    Object.values(audios.current).forEach((a) => {
      if (!a) return;
      try { a.pause(); a.currentTime = 0; } catch {}
    });
  };

  const playOne = async (type) => {
    stopAll();
    try {
      const a = getAudio(type);
      a.currentTime = 0;
      a.volume = 1;
      await a.play();
      setAudioStatus(`${TYPES[type].label} siap`);
      return;
    } catch {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        const ctx = new Ctx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = type === 'arrival' ? 920 : 680;
        osc.connect(gain); gain.connect(ctx.destination);
        gain.gain.setValueAtTime(.16, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .65);
        osc.start(); osc.stop(ctx.currentTime + .7);
        setAudioStatus('Fallback audio aktif');
      } catch { setAudioStatus('Audio diblokir browser'); }
    }
  };

  const notification = async (type, cfg) => {
    if (!('Notification' in window)) return;
    let p = Notification.permission;
    if (p !== 'granted') p = await Notification.requestPermission();
    if (p !== 'granted') return;
    try {
      new Notification(TYPES[type].label, {
        body: cfg.message,
        icon: '/absen-icon.png',
        tag: `flv2-${type}`,
        silent: true,
        requireInteraction: true,
      });
    } catch {}
  };

  const trigger = async (type, forced = false) => {
    const cfg = settingsRef.current[type];
    const now = new Date();
    const key = `${type}-${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${cfg.time}`;
    if (!forced && triggerGuard.current[type] === key) return;
    triggerGuard.current[type] = key;
    setAlarmType(type);
    await notification(type, cfg);
    await playOne(type);
  };

  useEffect(() => {
    const check = () => {
      const now = new Date();
      ['arrival','departure'].forEach((type) => {
        const cfg = settingsRef.current[type];
        if (!cfg?.enabled || !cfg.days?.includes(now.getDay())) return;
        const [hh,mm] = String(cfg.time || '').split(':').map(Number);
        if (!Number.isFinite(hh) || !Number.isFinite(mm)) return;
        const target = new Date(now); target.setHours(hh,mm,0,0);
        const diff = now - target;
        if (diff >= 0 && diff <= 5 * 60 * 1000) trigger(type, false);
      });
    };
    check();
    const t = setInterval(check, 15000);
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearInterval(t);
      window.removeEventListener('focus', check);
      document.removeEventListener('visibilitychange', check);
      stopAll();
    };
  }, [storageKey]);

  const patch = (type, patch) => setSettings((s) => ({ ...s, [type]: { ...s[type], ...patch } }));
  const current = settings[tab];
  const days = [{id:1,l:'Sen'},{id:2,l:'Sel'},{id:3,l:'Rab'},{id:4,l:'Kam'},{id:5,l:'Jum'},{id:6,l:'Sab'},{id:0,l:'Min'}];

  return (
    <>
      {open && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal">
          <div className="row-between">
            <div><h2 style={{margin:0}}>Pengingat Absensi</h2><div className="muted small">Setting tersimpan per akun & perangkat</div></div>
            <button className="btn btn-ghost" onClick={onClose}><X size={18}/></button>
          </div>
          <div className="tabs" style={{marginTop:18}}>
            {['arrival','departure'].map((type) => <button key={type} className={tab===type?'active':''} onClick={() => setTab(type)}>{TYPES[type].label}</button>)}
          </div>
          <div className="stack" style={{marginTop:18}}>
            <label className="row-between card card-pad" style={{padding:14}}><span><b>Aktif</b><div className="muted small">{current.enabled ? 'Reminder menyala' : 'Reminder mati'}</div></span><input type="checkbox" checked={!!current.enabled} onChange={(e)=>patch(tab,{enabled:e.target.checked})}/></label>
            <div><label className="label">Jam</label><input className="input" type="time" value={current.time} onChange={(e)=>patch(tab,{time:e.target.value})}/></div>
            <div><label className="label">Hari aktif</label><div className="row" style={{flexWrap:'wrap'}}>{days.map((d)=><button key={d.id} className={`btn ${current.days?.includes(d.id)?'btn-primary':'btn-ghost'}`} onClick={()=>patch(tab,{days:current.days?.includes(d.id)?current.days.filter(x=>x!==d.id):[...(current.days||[]),d.id]})}>{d.l}</button>)}</div></div>
            <div><label className="label">Pesan</label><input className="input" value={current.message} onChange={(e)=>patch(tab,{message:e.target.value})}/></div>
            <div className="row-between"><span className="muted small"><Volume2 size={14} style={{verticalAlign:'middle'}}/> {audioStatus}</span><button className="btn btn-cyan" onClick={()=>trigger(tab,true)}>Test Alarm</button></div>
          </div>
        </div>
      </div>}
      {alarmType && <div className="modal-backdrop">
        <div className="modal alarm-modal">
          <div className="alarm-hero">{TYPES[alarmType].emoji}</div>
          <h1>{TYPES[alarmType].label}</h1>
          <p className="muted">{settings[alarmType].message}</p>
          <div className="row" style={{justifyContent:'center',marginTop:18}}>
            <button className="btn btn-primary" onClick={()=>{stopAll();setAlarmType(null);}}>✓ Sudah Absen</button>
          </div>
        </div>
      </div>}
    </>
  );
}
