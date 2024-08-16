import { setDoc, doc, Firestore, getFirestore, getDocs, collection, deleteDoc } from 'firebase/firestore'
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

  addBookToTable = async (id: string, isbn: string) => {
    const booksInShelve = await this.getBooksInShelve(id)
    if (booksInShelve.includes(isbn)) {
      throw new Error(`The book with ISBN ${isbn} is in the shelve.`)
    } else {
      const docRef = doc(this.db, this.collection, id, 'table', isbn)
      await setDoc(docRef, { isbn })
  
      const booksUpdated = await this.getBooksInTable(id)
      return booksUpdated
    }
  }

  getBooksInTable = async (id: string) => {
    const docRef = doc(this.db, this.collection, id)
    const tableCollectionRef = collection(docRef, 'table')
    
    const querySnapshot = await getDocs(tableCollectionRef)
    const isbns: string[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      if (data.isbn) {
          isbns.push(data.isbn)
      }
  })

    return isbns
  }

  removeBookInTable = async (id: string, isbn: string) => {
    const docRef = doc(this.db, this.collection, id, 'table', isbn)
    await deleteDoc(docRef)

    const booksUpdated = await this.getBooksInShelve(id)
    return booksUpdated
  }

  addBookToShelve = async (id: string, isbn: string) => {
    const booksInTable = await this.getBooksInTable(id)
    if (booksInTable.includes(isbn)) {
      const docRef = doc(this.db, this.collection, id, 'shelve', isbn)
      await setDoc(docRef, { isbn })
      await this.removeBookInTable(id, isbn)

      const booksUpdated = await this.getBooksInShelve(id)
      return booksUpdated
    } else {
        throw new Error(`The book with ISBN ${isbn} is not in the table.`)
    }
  }

  getBooksInShelve = async (id: string) => {
    const docRef = doc(this.db, this.collection, id)
    const shelveCollectionRef = collection(docRef, 'shelve')
    
    const querySnapshot = await getDocs(shelveCollectionRef)
    const isbns: string[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      if (data.isbn) {
          isbns.push(data.isbn)
      }
  })

    return isbns
  }

  removeBookInShelve = async (id: string, isbn: string) => {
    const docRef = doc(this.db, this.collection, id, 'shelve', isbn)
    await deleteDoc(docRef)

    const booksUpdated = await this.getBooksInShelve(id)
    return booksUpdated
  }
}

export default UserRepositoryFirebase
