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
    const { page } = req.query
    if (page && typeof page !== 'string')
      throw new InvalidParamsError('"page" query must be a string')

    const books = await this.repository.getBooksByPublisher(page, 'alpha decay')
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
    const { isbn, id } = req.query
    
    if (!isbn || typeof isbn !== 'string') {
      throw new InvalidParamsError('"isbn" query must be a string and cannot be undefined');
    }

    if (!id || typeof id !== 'string') {
      throw new InvalidParamsError('"id" query must be a string and cannot be undefined');
    }

    const bookAdded = await this.userRepository.addBookToTable(id, isbn)
    res.status(200).json({ table: bookAdded })
  }

  getBooksInTable = async (req: Request, res: Response) => {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      throw new InvalidParamsError('"id" query must be a string and cannot be undefined');
    }

    const books = await this.userRepository.getBooksInTable(id)
    res.status(200).json({ table: books })
  }

  removeBookInTable = async (req: Request, res: Response) => {
    const { isbn, id } = req.query
    
    if (!isbn || typeof isbn !== 'string') {
      throw new InvalidParamsError('"isbn" query must be a string and cannot be undefined');
    }

    if (!id || typeof id !== 'string') {
      throw new InvalidParamsError('"id" query must be a string and cannot be undefined');
    }

    const bookRemoved = await this.userRepository.removeBookInTable(id, isbn)
    res.status(200).json({ table: bookRemoved })
  }

  addToShelve = async (req: Request, res: Response) => {
    const { isbn, id } = req.query
    
    if (!isbn || typeof isbn !== 'string') {
      throw new InvalidParamsError('"isbn" query must be a string and cannot be undefined');
    }

    if (!id || typeof id !== 'string') {
      throw new InvalidParamsError('"id" query must be a string and cannot be undefined');
    }

    const bookAdded = await this.userRepository.addBookToShelve(id, isbn)
    res.status(200).json({ shelve: bookAdded })
  }

  getBooksInShelve = async (req: Request, res: Response) => {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      throw new InvalidParamsError('"id" query must be a string and cannot be undefined');
    }

    const books = await this.userRepository.getBooksInShelve(id)
    res.status(200).json({ shelve: books })
  }

  removeBookInShelve = async (req: Request, res: Response) => {
    const { isbn, id } = req.query
    
    if (!isbn || typeof isbn !== 'string') {
      throw new InvalidParamsError('"isbn" query must be a string and cannot be undefined');
    }

    if (!id || typeof id !== 'string') {
      throw new InvalidParamsError('"id" query must be a string and cannot be undefined');
    }

    const bookRemoved = await this.userRepository.removeBookInShelve(id, isbn)
    res.status(200).json({ shelve: bookRemoved })
  }
}

export default BookController
