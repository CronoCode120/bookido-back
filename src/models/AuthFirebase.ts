import AuthUser from './Auth.js'
import { Auth, createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { app } from '../repositories/firebase.js'

class AuthFirebase implements AuthUser {
  auth: Auth

  constructor() {
    this.auth = getAuth(app)
  }

  createUser = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    )

    return userCredential.user.uid
  }
}

export default AuthFirebase
