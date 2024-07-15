import { setDoc, doc, Firestore, getFirestore } from 'firebase/firestore'
import { app } from './firebase.js'

class UserRepositoryFirebase {
  db: Firestore
  collection = 'users'

  constructor() {
    this.db = getFirestore(app)
  }

  create = async (id: string, email: string) => {
    const docRef = doc(this.db, this.collection, id)
    await setDoc(docRef, { id, email })
    return id
  }
}

export default UserRepositoryFirebase
