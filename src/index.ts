import 'dotenv/config'
import express from 'express'
import BookController from './controllers/BookController.js'
import UserController from './controllers/UserController.js'
import OpenLibraryBookRepository from './repositories/book/OpenLibraryBookRepository.js'
import AuthFirebase from './models/AuthFirebase.js'
import UserRepositoryFirebase from './repositories/user/UserRepositoryFirebase.js'
//import firebase from 'firebase/compat/app'

const app = express()
const PORT = process.env.PORT ?? 3000

const bookController = new BookController(new OpenLibraryBookRepository())
const userController = new UserController(
  new AuthFirebase(),
  new UserRepositoryFirebase()
)

app.use(express.json())

app.get('/books', bookController.getBooks)

app.post('/users/register', userController.register)
app.post('/users/login', userController.login)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
