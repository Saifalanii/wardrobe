import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Outfit } from '@/types'

function outfitsCol(uid: string) {
  return collection(db, 'users', uid, 'outfits')
}

export async function fetchOutfits(uid: string): Promise<Outfit[]> {
  const snap = await getDocs(outfitsCol(uid))
  return snap.docs.map((d) => d.data() as Outfit)
}

export async function saveOutfit(uid: string, outfit: Outfit): Promise<void> {
  await setDoc(doc(outfitsCol(uid), outfit.id), { ...outfit, updatedAt: Date.now() }, { merge: true })
}

export async function deleteOutfit(uid: string, outfitId: string): Promise<void> {
  await deleteDoc(doc(outfitsCol(uid), outfitId))
}

export async function toggleFavoriteOutfit(uid: string, outfitId: string, favorite: boolean): Promise<void> {
  await updateDoc(doc(outfitsCol(uid), outfitId), { favorite, updatedAt: Date.now() })
}
