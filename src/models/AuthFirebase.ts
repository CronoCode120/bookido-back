import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../repositories/firebase.js'

class AuthFirebase {
  auth = auth

  create = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    )

    return userCredential.user
  }
}

export default AuthFirebase
