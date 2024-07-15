import express from 'express'
import BookController from './controllers/BookController.js'
import OpenLibraryBookRepository from './repositories/book/OpenLibraryBookRepository.js'

const app = express()
const PORT = process.env.PORT ?? 3000

const bookController = new BookController(new OpenLibraryBookRepository())

app.use(express.json())

app.get('/books', bookController.getBooks)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
