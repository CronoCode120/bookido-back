import { Auth, createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { app } from '../repositories/firebase.js'

class AuthFirebase {
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

    return userCredential.user
  }
}

export default AuthFirebase
