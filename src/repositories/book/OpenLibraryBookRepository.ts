import BookRepository from './BookRepository.js'
import getEditionData from '../../utils/getEditionData.js'
import filterByIsbn from '../../utils/filterByIsbn.js'
import filterRepeatedEditions from '../../utils/filterRepeatedEditions.js'

class OpenLibraryBookRepository extends BookRepository {
  apiUrl = 'https://openlibrary.org/search.json'
  googleApiUrl = 'https://www.googleapis.com/books/v1/volumes'
  resFields = [
    'editions',
    'key',
    'editions.title',
    'author_name',
    'editions.publisher',
    'editions.publish_date',
    'editions.isbn'
  ]

  getBooksByPublisher = async (
    page: string = '1',
    publisher: string,
    isbns: string[] = []
  ) => {
    const url = new URL(this.apiUrl)
    url.searchParams.set('publisher', publisher)
    url.searchParams.set('fields', this.resFields.join(','))
    url.searchParams.set('limit', '20')
    url.searchParams.set('page', page)

    const res = await fetch(url)
    const data = await res.json()

    return filterByIsbn(getEditionData(data.docs), isbns)
  }

  getBooksByTitle = async (title: string) => {
    const url = new URL(this.apiUrl)
    url.searchParams.set('q', title)
    url.searchParams.set(
      'fields',
      'editions,key,editions.title,editions.publisher,editions.isbn'
    )
    url.searchParams.set('sort', 'new')

    const res = await fetch(url)
    const data = await res.json()

    const books = getEditionData(data.docs)
    const booksWithISBN = books.filter(
      (book: { [key: string]: any }) =>
        book.hasOwnProperty('isbn') && book.isbn.length > 0
    )
    return filterRepeatedEditions(booksWithISBN)
  }

  getBookByISBN = async (isbn: string, fields: string | undefined) => {
    const defFields = ['editions', 'key']

    const fieldsArr = fields ? fields.split(',') : []
    if (fieldsArr.length) {
      fieldsArr.forEach(field => {
        if (field === 'author') defFields.push('author_name')
        else defFields.push('editions.' + field)
      })
    }

    const url = new URL(this.apiUrl)
    url.searchParams.set('q', `isbn:${isbn}`)
    url.searchParams.set('fields', defFields.join(','))

    const res = await fetch(url)
    const data = await res.json()

    return getEditionData(data.docs)[0]
  }

  getDescriptionByISBN = async (isbn: string | undefined) => {
    const noDescMsg = 'No hay sinopsis disponible para este título.'

    if (!isbn) return noDescMsg

    const url = new URL(this.googleApiUrl)
    url.searchParams.set('q', `isbn:${isbn}`)
    url.searchParams.set('fields', 'items/volumeInfo(description)')

    const res = await fetch(url)
    const data = await res.json()

    if (data.items) return data.items[0].volumeInfo?.description ?? noDescMsg

    return noDescMsg
  }
}

export default OpenLibraryBookRepository
