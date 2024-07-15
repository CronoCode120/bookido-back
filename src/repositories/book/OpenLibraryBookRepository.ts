import BookRepository from './BookRepository.js'
import getEditionData from '../../utils/getEditionData.js'

class OpenLibraryBookRepository extends BookRepository {
  apiUrl = 'https://openlibrary.org/search.json'
  resFields = [
    'editions',
    'key',
    'title',
    'author_name',
    'publisher',
    'subject',
    // 'language',
    'publish_date',
    'isbn'
  ]

  getBooksByPublisher = async (publisher: string) => {
    const url = new URL(this.apiUrl)
    url.searchParams.set('publisher', publisher)
    url.searchParams.set('fields', this.resFields.join(','))

    const res = await fetch(url)
    const data = await res.json()

    return getEditionData(data.docs)
  }

  // getCoverURIByISBN = (isbn: string, size: CoverSize = 'M') => {
  //   const coverUrl = 'https://covers.openlibrary.org/b/isbn/'
  //   const imgStr = `${isbn}-${size}.jpg`
  //   return coverUrl + imgStr
  // }
}

export default OpenLibraryBookRepository
