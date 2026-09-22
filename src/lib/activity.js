import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export async function logActivity({ actor, action, entityType, entityId, divisionId = '', metadata = {} }) {
  if (!actor?.uid) return;
  try {
    await addDoc(collection(db, 'activityLogs'), {
      actorUid: actor.uid,
      actorName: actor.name || actor.email || 'User',
      action,
      entityType,
      entityId: entityId || '',
      divisionId: divisionId || '',
      metadata,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Activity log gagal:', error);
  }
}
