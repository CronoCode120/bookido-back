import {
  setDoc,
  doc,
  Firestore,
  getFirestore,
  getDocs,
  collection,
  deleteDoc,
  getDoc,
  updateDoc
} from 'firebase/firestore'
import { app } from '../firebase.js'
import UserRepository from './UserRepository.js'
import { Rating, Genre } from '../../types.js'

class UserRepositoryFirebase implements UserRepository {
  db: Firestore
  collection = 'users'

  constructor() {
    this.db = getFirestore(app)
  }

  create = async (userId: string, email: string, username: string) => {
    const docRef = doc(this.db, this.collection, userId)
    await setDoc(docRef, { userId, email, username })
    return userId
  }

  addBookToTable = async (userId: string, isbn: string) => {
    const booksInShelve = await this.getBooksInShelf(userId)
    if (booksInShelve.includes(isbn)) {
      throw new Error(`The book with ISBN ${isbn} is in the shelve.`)
    } else {
      if ((await this.getBooksInTable(userId)).length == 20) {
        return 'err'
      } else {
        const docRef = doc(this.db, this.collection, userId, 'table', isbn)
        await setDoc(docRef, { isbn })
        const docRef2 = doc(this.db, this.collection, userId, 'viewed', isbn)
        await setDoc(docRef2, { isbn })

        const booksUpdated = await this.getBooksInTable(userId)
        return booksUpdated
      }
    }
  }

  getBooksInTable = async (userId: string) => {
    const docRef = doc(this.db, this.collection, userId)
    const tableCollectionRef = collection(docRef, 'table')

    const querySnapshot = await getDocs(tableCollectionRef)
    const isbns: string[] = []

    querySnapshot.forEach(doc => {
      const data = doc.data()
      if (data.isbn) {
        isbns.push(data.isbn)
      }
    })
    return isbns
  }

  removeBookInTable = async (userId: string, isbn: string) => {
    const docRef = doc(this.db, this.collection, userId, 'table', isbn)
    await deleteDoc(docRef)

    const booksUpdated = await this.getBooksInTable(userId)
    return booksUpdated
  }

  shelve = async (userId: string, isbn: string) => {
    const booksInTable = await this.getBooksInTable(userId)
    if (booksInTable.includes(isbn)) {
      if ((await this.getBooksInShelf(userId)).length == 100) {
        return 'err'
      } else {
        const docRef = doc(this.db, this.collection, userId, 'shelve', isbn)
        await setDoc(docRef, { isbn })
        await this.removeBookInTable(userId, isbn)

        const booksUpdated = await this.getBooksInShelf(userId)
        return booksUpdated
      }
    } else {
      throw new Error(`The book with ISBN ${isbn} is not in the table.`)
    }
  }

  getBooksInShelf = async (userId: string) => {
    const docRef = doc(this.db, this.collection, userId)
    const shelveCollectionRef = collection(docRef, 'shelve')

    const querySnapshot = await getDocs(shelveCollectionRef)
    const isbns: string[] = []

    querySnapshot.forEach(doc => {
      isbns.push(doc.id)
    })

    return isbns
  }

  unshelve = async (userId: string, isbn: string) => {
    const docRef = doc(this.db, this.collection, userId, 'shelve', isbn)
    await deleteDoc(docRef)

    const booksUpdated = await this.getBooksInShelf(userId)
    return booksUpdated
  }

  discardBook = async (userId: string, isbn: string) => {
    const docRef = doc(this.db, this.collection, userId, 'viewed', isbn)
    await setDoc(docRef, { isbn })

    return 'Book discarded'
  }

  getViewedBooks = async (userId: string) => {
    const docRef = doc(this.db, this.collection, userId)
    const viewedColRef = collection(docRef, 'viewed')

    const querySnapshot = await getDocs(viewedColRef)
    const isbns: string[] = []

    querySnapshot.forEach(doc => {
      const data = doc.data()
      if (data.isbn) {
        isbns.push(data.isbn)
      }
    })
    return isbns
  }

  addReview = async (
    userId: string,
    isbn: string,
    value: Rating,
    review: string | undefined
  ) => {
    const newReview = review ? { value, review } : { value }
    const collectionRef = collection(this.db, this.collection, userId, 'shelve')
    const docRef = doc(collectionRef, isbn)
    await setDoc(docRef, newReview)
  }

  getReviewFromUser = async (userId: string, isbn: string) => {
    const reviewDocRef = doc(this.db, this.collection, userId, 'shelve', isbn)
    const docSnapshot = await getDoc(reviewDocRef)

    if (docSnapshot.exists()) {
      const data = docSnapshot.data()
      return data
    } else {
      return null
    }
  }

  getValueReviewFromUser = async (userId: string, isbn: string) => {
    const reviewDocRef = doc(this.db, this.collection, userId, 'shelve', isbn)
    const docSnapshot = await getDoc(reviewDocRef)

    if (docSnapshot.exists()) {
      const data = docSnapshot.data()
      return data.value
    } else {
      return null
    }
  }

  assignGenres = async (userId: string, genres: Genre[]) => {
    const docRef = doc(this.db, this.collection, userId)
    await setDoc(docRef, { genres }, { merge: true })
  }

  updateUserEmailInFirestore = async (userId: string, newEmail: string) => {
    const userDocRef = doc(this.db, 'users', userId)
    try {
      await updateDoc(userDocRef, {
        email: newEmail
      })
    } catch (error) {
      return error
    }
  }

  updateUsername = async (userId: string, newUsername: string) => {
    const userDocRef = doc(this.db, 'users', userId)
    try {
      await updateDoc(userDocRef, {
        username: newUsername
      })
    } catch (error) {
      return error
    }
  }

  getGenres = async (userId: string) => {
    const docRef = doc(this.db, this.collection, userId)
    try {
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        return data.genres || []
      }
    } catch (error) {
      return 'err'
    }
  }
}

export default UserRepositoryFirebase
