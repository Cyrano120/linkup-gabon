import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot,
} from 'firebase/firestore'
import { db } from './firebase'

export function subscribeToCollection(collectionName, callback) {
  const q = query(collection(db, collectionName), orderBy('id', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ _firestoreId: d.id, ...d.data() }))
    callback(data)
  }, (error) => {
    console.error(`Erreur Firestore (${collectionName}):`, error)
  })
}

export async function addDocument(collectionName, data) {
  if (!data || typeof data !== 'object') throw new Error('Données invalides')
  try {
    const docRef = await addDoc(collection(db, collectionName), { ...data, id: Date.now() })
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
    const batch = dataArray.map((item) => addDoc(collection(db, collectionName), item))
    await Promise.all(batch)
  } catch (error) {
    console.error(`Erreur seed (${collectionName}):`, error)
  }
}
