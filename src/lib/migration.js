import { collection, doc, getDocs, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { safeJson } from './helpers';

const safeId = (value='') => String(value).replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,120);

export async function migrateLegacyData(actorUid, onProgress=()=>{}) {
  const folderSnap = await getDocs(collection(db,'folders'));
  const workspaceSnap = await getDocs(collection(db,'workspace_data'));
  const workspaceMap = new Map(workspaceSnap.docs.map(d=>[d.id,d.data()]));

  let batch = writeBatch(db);
  let writes = 0;
  let divisions = 0, tasks = 0, stickies = 0;

  const commitIfNeeded = async(force=false) => {
    if (writes >= 380 || (force && writes > 0)) {
      await batch.commit();
      batch = writeBatch(db);
      writes = 0;
    }
  };

  for (const folderDoc of folderSnap.docs) {
    const f = folderDoc.data();
    const divisionId = folderDoc.id;
    batch.set(doc(db,'divisions',divisionId), {
      name: f.name || `Divisi ${divisionId.slice(0,5)}`,
      code: f.name ? String(f.name).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10) : divisionId.slice(0,8).toUpperCase(),
      active: true,
      legacyFolderId: divisionId,
      appearance: { avatarId: f.avatarId || 'boy', gradient: f.gradient || '' },
      attendance: {
        arrival: { enabled:true,time:'08:00',days:[1,2,3,4,5],message:'Jangan lupa absen masuk dulu ya.' },
        departure: { enabled:true,time:'17:00',days:[1,2,3,4,5],message:'Sebelum pulang, jangan lupa absen dulu ya.' },
      },
      migratedAt: serverTimestamp(),
      migratedBy: actorUid,
    }, {merge:true});
    writes++; divisions++;

    const ws = workspaceMap.get(divisionId) || {};
    const history = safeJson(ws.tasksHistory, {});
    for (const [dateKey, arr] of Object.entries(history || {})) {
      if (!Array.isArray(arr)) continue;
      arr.forEach((t,idx)=>{
        const id = safeId(`legacy_${divisionId}_${dateKey}_${t.id || idx}`);
        const rawStatus = t.status || 'todo';
        const status = rawStatus === 'inProgress' ? 'in_progress' : rawStatus === 'done' ? 'done' : 'todo';
        batch.set(doc(db,'tasks',id), {
          divisionId,
          title: t.content || t.title || 'Legacy task',
          description: t.description || '',
          status,
          priority: t.priority || 'normal',
          assignedTo: '',
          dueAt: t.dueDate || '',
          legacyDateKey: dateKey,
          legacyTaskId: String(t.id || ''),
          createdBy: actorUid,
          createdByName: 'Legacy Migration',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          completedAt: status === 'done' ? serverTimestamp() : null,
          deletedAt: null,
        }, {merge:true});
        writes++; tasks++;
      });
    }

    const activeStickies = safeJson(ws.stickies, []);
    if (Array.isArray(activeStickies)) activeStickies.forEach((s,idx)=>{
      const id=safeId(`legacy_${divisionId}_sticky_${s.id || idx}`);
      batch.set(doc(db,'stickyNotes',id), {
        divisionId,title:s.title||'',content:s.content||'',color:s.color?.startsWith('#')?s.color:'#fde68a',
        legacyStickyId:String(s.id||''),createdBy:actorUid,createdAt:serverTimestamp(),updatedAt:serverTimestamp(),archivedAt:null,deletedAt:null,
      },{merge:true}); writes++; stickies++;
    });

    const archived = safeJson(ws.archivedStickies, []);
    if (Array.isArray(archived)) archived.forEach((s,idx)=>{
      const id=safeId(`legacy_${divisionId}_archived_${s.archiveId || s.id || idx}`);
      batch.set(doc(db,'stickyNotes',id), {
        divisionId,title:s.title||'',content:s.content||'',color:s.color?.startsWith('#')?s.color:'#fde68a',
        legacyStickyId:String(s.id||s.archiveId||''),createdBy:actorUid,createdAt:serverTimestamp(),updatedAt:serverTimestamp(),archivedAt:serverTimestamp(),deletedAt:null,
      },{merge:true}); writes++; stickies++;
    });

    await commitIfNeeded();
    onProgress({divisions,tasks,stickies,current:f.name||divisionId});
  }

  await commitIfNeeded(true);
  await setDoc(doc(db,'system','migration_v2'), {
    completedAt: serverTimestamp(), completedBy: actorUid, divisions, tasks, stickies,
  }, {merge:true});
  return {divisions,tasks,stickies};
}
