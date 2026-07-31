import { openDB, type IDBPDatabase } from 'idb'

export type QueuedOpKind = 'item-upsert' | 'item-delete' | 'outfit-upsert' | 'outfit-delete'

export interface QueuedOp {
  id: string
  kind: QueuedOpKind
  uid: string
  payload: unknown
  createdAt: number
}

const DB_NAME = 'wardrobe-sync'
const STORE = 'queue'

let dbPromise: Promise<IDBPDatabase> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

export async function enqueueOp(op: QueuedOp): Promise<void> {
  const db = await getDb()
  await db.put(STORE, op)
}

export async function getQueuedOps(): Promise<QueuedOp[]> {
  const db = await getDb()
  return db.getAll(STORE)
}

export async function removeQueuedOp(id: string): Promise<void> {
  const db = await getDb()
  await db.delete(STORE, id)
}

export async function clearQueue(): Promise<void> {
  const db = await getDb()
  await db.clear(STORE)
}
