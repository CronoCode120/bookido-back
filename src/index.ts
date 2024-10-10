import 'dotenv/config'
import express from 'express'
import BookController from './controllers/BookController.js'
import UserController from './controllers/UserController.js'
import ReviewController from './controllers/ReviewController.js'
import OpenLibraryBookRepository from './repositories/book/OpenLibraryBookRepository.js'
import AuthFirebase from './models/AuthFirebase.js'
import UserRepositoryFirebase from './repositories/user/UserRepositoryFirebase.js'
import ReviewRepositoryFirebase from './repositories/review/ReviewRepositoryFirebase.js'
import GoogleBookRepository from './repositories/book/GoogleBookRepository.js'

const app = express()
const PORT = process.env.PORT ?? 3000

const bookController = new BookController(
  new GoogleBookRepository(),
  new UserRepositoryFirebase(),
  new ReviewRepositoryFirebase()
)
const userController = new UserController(
  new AuthFirebase(),
  new UserRepositoryFirebase()
)
const reviewController = new ReviewController(
  new ReviewRepositoryFirebase(),
  new UserRepositoryFirebase()
)

app.use(express.json())

app.get('/books', bookController.getBooks)
app.get('/books/description', bookController.getDescriptionByISBN)
app.get('/books/title', bookController.getBooksByTitle)

app.post('/books/table', bookController.addToTable)
app.get('/books/table', bookController.getBooksInTable)
app.delete('/books/table', bookController.removeBookInTable)

app.post('/books/shelf', bookController.shelve)
app.get('/books/shelf', bookController.getBooksInShelf)
app.delete('/books/shelf', bookController.unshelve)

app.post('/books/discard', bookController.discardBook)
app.get('/books/viewed', bookController.getViewedBooks)
app.get('/books/:isbn', bookController.getBookByISBN)

app.post('/users', userController.register)
app.post('/users/login', userController.login)

app.get('/reviews', reviewController.getReviews)
app.post('/review', reviewController.addReview)
app.get('/reviewFromBook', reviewController.getReviewFromBook)
app.get('/reviewFromUser', bookController.getReviewFromUser)

app.get('/algorythm', bookController.algorythm)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
