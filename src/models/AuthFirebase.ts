import AuthUser from './Auth.js'
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth'
import { app } from '../repositories/firebase.js'

class AuthFirebase implements AuthUser {
  auth: Auth
  user: any

  constructor() {
    this.auth = getAuth(app)
    this.user = this.auth.currentUser
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
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      )
      return userCredential.user.uid
    } catch (error) {
      return 'err'
    }
  }

  updateEmail = async (newEmail: string) => {
    if (this.user) {
      try {
        await updateEmail(this.user, newEmail)
      } catch (error) {
        return error
      }
    } else {
      return 'not logged in'
    }
  }

  reauthenticateUser = async (currentPassword: string) => {
    if (this.user && this.user.email) {
      const credential = EmailAuthProvider.credential(
        this.user.email,
        currentPassword
      )
      try {
        await reauthenticateWithCredential(this.user, credential)
        return true
      } catch (error) {
        return false
      }
    } else {
      return false
    }
  }

  changeUserPassword = async (newPassword: string) => {
    if (this.user) {
      try {
        await updatePassword(this.user, newPassword)
      } catch (error) {
        return error
      }
    } else {
      return 'not logged in'
    }
  }
}

export default AuthFirebase
