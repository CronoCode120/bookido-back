import { setDoc, doc, Firestore, getFirestore } from 'firebase/firestore'
import { app } from '../firebase.js'
import UserRepository from './UserRepository.js'

class UserRepositoryFirebase implements UserRepository {
  db: Firestore
  collection = 'users'

  constructor() {
    this.db = getFirestore(app)
  }

  create = async (id: string, email: string, username: string) => {
    const docRef = doc(this.db, this.collection, id)
    await setDoc(docRef, { id, email, username })
    return id
  }
}

export default UserRepositoryFirebase
