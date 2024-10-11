import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

async function openDb() {
  return open({
    filename: './db.sqlite',
    driver: sqlite3.Database
  })
}

class SqliteBookRepository {
  getBooks = async (page: number, pageSize: number) => {
    const db = await openDb()

    const offset = (page - 1) * pageSize

    try {
      const books = await db.all(
        'SELECT * FROM books LIMIT ? OFFSET ?',
        pageSize,
        offset
      )
      return books
    } catch (error) {
      console.error('Error fetching books:', error)
      return []
    } finally {
      await db.close()
    }
  }
}

export default SqliteBookRepository
