import { Request, Response } from 'express'
import BookRepository from '../repositories/book/OpenLibraryBookRepository.js'
import UserRepository from '../repositories/user/UserRepositoryFirebase.js'
import InvalidParamsError from '../errors/InvalidParams.js'

class BookController {
  readonly repository
  readonly userRepository

  constructor(bookRepository: BookRepository, userRepository: UserRepository) {
    this.repository = bookRepository
    this.userRepository = userRepository
  }

  getBooks = async (req: Request, res: Response) => {
    const { page, userId } = req.query
    if (page && typeof page !== 'string')
      throw new InvalidParamsError('"page" query must be a string')

    if (typeof userId !== 'string') throw new InvalidParamsError('"userId" query must be a string')

    const isbns = await this.userRepository.getViewedBooks(userId)

    const books = await this.repository.getBooksByPublisher(page, 'alpha decay', isbns)
    res.status(200).json({ books })
  }

  getBookByISBN = async (req: Request, res: Response) => {   
    const { isbn } = req.params
    const { fields } = req.query

    if (!isbn) throw new InvalidParamsError('ISBN is not provided')

    const book = await this.repository.getBookByISBN(isbn, fields as string)
    res.status(200).json({ book })
  }

  getDescriptionByISBN = async (req: Request, res: Response) => {
    const { isbn } = req.query
    if (typeof isbn !== 'string' && typeof isbn !== 'undefined')
      throw new InvalidParamsError('"isbn" query must be a string')

    const desc = await this.repository.getDescriptionByISBN(isbn)
    res.status(200).json({ description: desc })
  }

  addToTable = async (req: Request, res: Response) => {
    const { isbn, userId } = req.body
    
    if (!isbn || typeof isbn !== 'string') {
      throw new InvalidParamsError('"isbn" query must be a string and cannot be undefined');
    }

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError('"userId" query must be a string and cannot be undefined');
    }

    const bookAdded = await this.userRepository.addBookToTable(userId, isbn)
    if (bookAdded != 'err') {
      res.status(200).json({ table: bookAdded })
    } else {
      res.status(400).json({ error: 'You have more than 20 books on the table!' })
    }
  }

  getBooksInTable = async (req: Request, res: Response) => {
    const { userId } = req.query
    

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError('"userId" query must be a string and cannot be undefined');
    }

    const books = await this.userRepository.getBooksInTable(userId)
    res.status(200).json({ table: books })
  }

  removeBookInTable = async (req: Request, res: Response) => {
    const { isbn, userId } = req.body
    
    if (!isbn || typeof isbn !== 'string') {
      throw new InvalidParamsError('"isbn" query must be a string and cannot be undefined');
    }

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError('"userId" query must be a string and cannot be undefined');
    }

    const bookRemoved = await this.userRepository.removeBookInTable(userId, isbn)
    res.status(200).json({ table: bookRemoved })
  }

  shelve = async (req: Request, res: Response) => {
    const { isbn, userId } = req.body
    
    if (!isbn || typeof isbn !== 'string') {
      throw new InvalidParamsError('"isbn" query must be a string and cannot be undefined');
    }

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError('"userId" query must be a string and cannot be undefined');
    }

    const bookAdded = await this.userRepository.shelve(userId, isbn)
    if (bookAdded != 'err') {
      res.status(200).json({ shelve: bookAdded })
    } else {
      res.status(400).json({ error: 'You have more than 100 books on the shelf!' })
    }
  }

  getBooksInShelf = async (req: Request, res: Response) => {
    const { userId } = req.query

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError('"userId" query must be a string and cannot be undefined');
    }

    const books = await this.userRepository.getBooksInShelf(userId)
    res.status(200).json({ shelve: books })
  }

  unshelve = async (req: Request, res: Response) => {
    const { isbn, userId } = req.body
    
    if (!isbn || typeof isbn !== 'string') {
      throw new InvalidParamsError('"isbn" query must be a string and cannot be undefined');
    }

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError('"userId" query must be a string and cannot be undefined');
    }

    const bookRemoved = await this.userRepository.unshelve(userId, isbn)
    res.status(200).json({ shelve: bookRemoved })
  }

  discardBook = async (req: Request, res: Response) => {
    const { isbn, userId } = req.body
    
    if (!isbn || typeof isbn !== 'string') {
      throw new InvalidParamsError('"isbn" query must be a string and cannot be undefined');
    }

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError('"userId" query must be a string and cannot be undefined');
    }

    const bookDiscarded = await this.userRepository.discardBook(userId, isbn)
    res.status(200).json({ book: bookDiscarded })
  }

  getViewedBooks = async (req: Request, res: Response) => {
    const { userId } = req.query

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError('"userId" query must be a string and cannot be undefined');
    }

    const books = await this.userRepository.getViewedBooks(userId)
    res.status(200).json({ viewed: books })
  }
}

export default BookController
