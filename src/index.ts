import express from 'express'
import BookController from './controllers/BookController.ts'
import BookRepository from './repositories/OpenLibraryBookRepository.ts'

const app = express()
const port = process.env.PORT ?? 3000

const bookController = new BookController(new BookRepository())

app.use(express.json())

app.get('/books', bookController.getBooks)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
