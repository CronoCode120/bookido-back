import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../repositories/firebase.js'

class AuthFirebase {
  static createUser = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    return userCredential.user
  }
}

export default AuthFirebase
