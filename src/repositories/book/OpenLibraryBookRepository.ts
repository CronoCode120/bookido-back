import BookRepository from './BookRepository.js'
import getEditionData from '../../utils/getEditionData.js'

class OpenLibraryBookRepository extends BookRepository {
  apiUrl = 'https://openlibrary.org/search.json'
  googleApiUrl = 'https://www.googleapis.com/books/v1/volumes'
  resFields = [
    'editions',
    'key',
    'editions.title',
    'author_name',
    'editions.publisher',
    'subject',
    'editions.publish_date',
    'editions.isbn'
  ]

  getBooksByPublisher = async (page: string = '1', publisher: string) => {
    const url = new URL(this.apiUrl)
    url.searchParams.set('publisher', publisher)
    url.searchParams.set('fields', this.resFields.join(','))
    url.searchParams.set('limit', '20')
    url.searchParams.set('page', page)

    const res = await fetch(url)
    const data = await res.json()

    return getEditionData(data.docs)
  }

  getDescriptionByISBN = async (isbn: string) => {
    const url = new URL(this.googleApiUrl)
    url.searchParams.set('q', `isbn:${isbn}`)
    url.searchParams.set('fields', 'items/volumeInfo(description)')

    const res = await fetch(url)
    const data = await res.json()

    const noDescMsg = 'No hay sinopsis disponible para este título.'

    if (data.items) return data.items[0].volumeInfo?.description ?? noDescMsg

    return noDescMsg
  }
}

export default OpenLibraryBookRepository
