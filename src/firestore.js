import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, onSnapshot,
} from 'firebase/firestore'
import { auth, db } from './firebase'

export function subscribeToCollection(collectionName, callback) {
  const q = query(collection(db, collectionName), orderBy('id', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ _firestoreId: d.id, ...d.data() }))
    callback(data)
  }, (error) => {
    console.error(`Erreur Firestore (${collectionName}):`, error)
  })
}

/**
 * Conversations de l'utilisateur connecté, et seulement les siennes.
 *
 * Les règles Firestore refusent toute lecture globale de la collection.
 * L'index composite `participants (array-contains) + id (desc)` est déclaré
 * dans `firestore.indexes.json`.
 */
export function subscribeToMessages(uid, callback) {
  if (!uid) return () => {}
  const q = query(
    collection(db, 'messages'),
    where('participants', 'array-contains', uid),
    orderBy('id', 'desc'),
  )
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ _firestoreId: d.id, ...d.data() }))
    callback(data)
  }, (error) => {
    console.error('Erreur Firestore (messages):', error)
    callback([])
  })
}

/**
 * Ajoute un document en estampillant l'auteur.
 *
 * L'identité vient du compte connecté, jamais des données fournies par
 * l'appelant : un écran ne peut donc pas écrire au nom d'un autre.
 */
export async function addDocument(collectionName, data) {
  if (!data || typeof data !== 'object') throw new Error('Données invalides')
  try {
    const uid = auth.currentUser?.uid
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      ...(uid ? { createdBy: uid } : {}),
      id: data.id ?? Date.now(),
      createdAt: data.createdAt ?? Date.now(),
    })
    return docRef.id
  } catch (error) {
    console.error(`Erreur ajout (${collectionName}):`, error)
    throw error
  }
}

export async function updateDocument(collectionName, firestoreId, data) {
  if (!firestoreId || !data) throw new Error('ID ou données manquants')
  try {
    await updateDoc(doc(db, collectionName, firestoreId), data)
  } catch (error) {
    console.error(`Erreur mise à jour (${collectionName}):`, error)
    throw error
  }
}

export async function deleteDocument(collectionName, firestoreId) {
  if (!firestoreId) throw new Error('ID manquant')
  try {
    await deleteDoc(doc(db, collectionName, firestoreId))
  } catch (error) {
    console.error(`Erreur suppression (${collectionName}):`, error)
    throw error
  }
}

export async function seedCollection(collectionName, dataArray) {
  try {
    const snapshot = await getDocs(collection(db, collectionName))
    if (!snapshot.empty) return
    // On passe par `addDocument` pour que les documents amorcés portent eux
    // aussi `createdBy` et `createdAt` : sans cela, les règles les refuseraient.
    const batch = dataArray.map((item) => addDocument(collectionName, { ...item, seeded: true }))
    await Promise.all(batch)
  } catch (error) {
    console.error(`Erreur seed (${collectionName}):`, error)
  }
}
