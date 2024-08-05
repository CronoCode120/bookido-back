import AuthUser from './Auth.js'
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
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

  login = async (email: string, password: string): Promise<string> => {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password)
      return userCredential.user.uid
    } catch (error) {
      return 'err'
    }
  }
}

export default AuthFirebase
