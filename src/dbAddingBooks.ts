import { limit } from 'firebase/firestore'
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

import path, { dirname } from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'url'

async function initializeDB() {
  const db = await open({
    filename: '../db.sqlite',
    driver: sqlite3.Database
  })
  await db.exec(`CREATE TABLE IF NOT EXISTS books (
        isbn TEXT PRIMARY KEY)`)

  return db
}

const apiUrl = 'https://openlibrary.org/search.json'
const resFields = ['editions', 'key', 'editions.isbn']

async function addingBooks() {
  const db = await initializeDB()

  const LIMIT = 20
  const publishers = await readBookFile()

  publishers.forEach(async publisher => {
    let page = 1
    let lastPage = false

    while (!lastPage) {
      const url = new URL(apiUrl)
      url.searchParams.set('publisher', publisher)
      url.searchParams.set('fields', resFields.join(','))
      url.searchParams.set('limit', LIMIT.toString())
      url.searchParams.set('page', page.toString())
      const res = await fetch(url)
      const data = await res.json()

      console.log('items de ' + publisher, data)
      const isbns = filterIsbn(data.docs)

      for (const isbn of isbns) {
        const existingBook = await db.get(
          'SELECT isbn FROM books WHERE isbn = ?',
          isbn
        )
        console.log('existingBook ', existingBook)

        if (!existingBook) {
          await db.run('INSERT INTO books (isbn) VALUES (?)', isbn)
        } else {
          console.log(`Book ${isbn} found`)
        }
      }

      data.docs.length < LIMIT ? (lastPage = true) : ++page
      console.log(`We're on page ${page} of ${data.docs.length} ;)`)
    }
  })

  const books = await db.all('SELECT * FROM books')
  console.log(books.length)
}

async function deleteTable() {
  const db = await initializeDB()
  await db.run('DROP table books')
}

async function readBookFile() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const data = fs.readFileSync(path.resolve(__dirname, '../books.csv'), 'utf8')
  const lines = data.split('\n')

  const result = lines.flatMap(line => {
    const values = line.split(',')
    return values.map(value => formatPublisher(value))
  })

  return result
}

async function books() {
  const db = await initializeDB()
  console.log(await db.all('SELECT * FROM books'))
}

function filterIsbn(books: any[]) {
  const regex = /^97884/
  const isbns: string[] = []
  books.length &&
    books.forEach(({ editions }) => {
      editions.docs.forEach(({ isbn }) => {
        if (!isbn) return
        const isbn13 = isbn[0]
        isbn13.match(regex) && isbns.push(isbn13)
      })
    })
  return isbns
}

function formatPublisher(publisher: string) {
  const lowerCasePublisher = publisher.toLowerCase()
  const regex = /Editorial|Ediciones/gi
  return lowerCasePublisher
    .replace(regex, '')
    .trim()
    .replaceAll(' ', '+')
    .replace('\r', '')
}

export { initializeDB, addingBooks, deleteTable, readBookFile, books }
