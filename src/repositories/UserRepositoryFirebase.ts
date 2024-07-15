import { setDoc, doc, Firestore, getFirestore } from 'firebase/firestore'
import { app } from './firebase.js'

class UserRepositoryFirebase {
  db: Firestore
  collection = 'users'

  constructor() {
    this.db = getFirestore(app)
  }

  create = async (email: string, password: string) => {}
}

export default UserRepositoryFirebase
