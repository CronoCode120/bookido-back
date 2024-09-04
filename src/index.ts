import 'dotenv/config'
import express from 'express'
import BookController from './controllers/BookController.js'
import UserController from './controllers/UserController.js'
import OpenLibraryBookRepository from './repositories/book/OpenLibraryBookRepository.js'
import AuthFirebase from './models/AuthFirebase.js'
import UserRepositoryFirebase from './repositories/user/UserRepositoryFirebase.js'

const app = express()
const PORT = process.env.PORT ?? 3000

const bookController = new BookController(new OpenLibraryBookRepository(), new UserRepositoryFirebase())
const userController = new UserController(
  new AuthFirebase(),
  new UserRepositoryFirebase()
)

app.use(express.json())

app.get('/books', bookController.getBooks)
app.get('/books/description', bookController.getDescriptionByISBN)

app.post('/books/addToTable', bookController.addToTable)
app.get('/books/table', bookController.getBooksInTable)
app.delete('/books/removeFromTable', bookController.removeBookInTable)

app.post('/books/addToShelve', bookController.addToShelve)
app.get('/books/shelve', bookController.getBooksInShelve)
app.delete('/books/removeFromShelve', bookController.removeBookInShelve)

app.post('/books/discard', bookController.discardBook)
app.get('/books/viewed', bookController.getViewedBooks)
app.get('/books/:isbn', bookController.getBookByISBN)

app.post('/users', userController.register)
app.post('/users/login', userController.login)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
