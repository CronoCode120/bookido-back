import {
  setDoc,
  doc,
  Firestore,
  getFirestore,
  getDocs,
  collection,
  DocumentData,
  getDoc
} from 'firebase/firestore'
import { app } from '../firebase.js'
import { Rating } from '../../types.js'

class ReviewRepositoryFirebase {
  db: Firestore
  collection = 'reviews'
  collectionUsers = 'users'

  constructor() {
    this.db = getFirestore(app)
  }

  addReview = async (
    userId: string,
    isbn: string,
    value: Rating,
    review: string | undefined
  ) => {
    const newReview = review ? { value, review } : { value }

    const collectionRef = collection(this.db, this.collection, isbn, 'data')
    const docRef = doc(collectionRef, userId)
    await setDoc(docRef, newReview)
    const collectionRef2 = collection(
      this.db,
      this.collectionUsers,
      userId,
      'shelve'
    )
    const docRef2 = doc(collectionRef2, isbn)
    await setDoc(docRef2, newReview)

    const reviewsUpdated = await this.getReviews(isbn)
    return reviewsUpdated
  }

  getReviews = async (isbn: string) => {
    const reviewCollectionRef = collection(
      this.db,
      this.collection,
      isbn,
      'data'
    )
    const querySnapshot = await getDocs(reviewCollectionRef)
    const reviews: DocumentData[] = []

    querySnapshot.forEach(doc => {
      const data = doc.data()
      if (data) {
        reviews.push({ userId: doc.id, ...data })
      }
    })

    return reviews
  }

  getValuesFromBook = async (isbn: string) => {
    const reviewCollectionRef = collection(
      this.db,
      this.collection,
      isbn,
      'data'
    )
    const querySnapshot = await getDocs(reviewCollectionRef)
    const reviews: DocumentData[] = []

    querySnapshot.forEach(doc => {
      const data = doc.data()
      if (data) {
        reviews.push({ userId: doc.id, value: data.value, isbn })
      }
    })

    return reviews
  }

  getReviewFromBook = async (isbn: string, userId: string) => {
    const reviewDocRef = doc(this.db, this.collection, isbn, 'data', userId)
    const docSnapshot = await getDoc(reviewDocRef)

    if (docSnapshot.exists()) {
      const data = docSnapshot.data()
      return data
    } else {
      return null
    }
  }

  getValueReviewFromBook = async (isbn: string, userId: string) => {
    const reviewDocRef = doc(this.db, this.collection, isbn, 'data', userId)
    const docSnapshot = await getDoc(reviewDocRef)

    if (docSnapshot.exists()) {
      const data = docSnapshot.data()
      return data.value
    } else {
      return null
    }
  }

  /*removeBookInTable = async (userId: string, isbn: string) => {
    const docRef = doc(this.db, this.collection, userId, 'table', isbn)
    await deleteDoc(docRef)

    const booksUpdated = await this.getBooksInShelf(userId)
    return booksUpdated
  }*/
}

export default ReviewRepositoryFirebase
