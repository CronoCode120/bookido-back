import BookRepository from './BookRepository.ts'

class OpenLibraryBookRepository extends BookRepository {
  apiUrl = 'https://openlibrary.org/search.json'
  resFields = [
    'editions',
    'key',
    'title',
    'author_name',
    'publisher',
    'subject',
    'language',
    'publish_date'
  ]

  getBooksByPublisher = async (publisher: string) => {
    const url = new URL(this.apiUrl)
    url.searchParams.set('publisher', publisher)
    url.searchParams.set('fields', this.resFields.join(','))
    const res = await fetch(url)
    const data = await res.json()

    return data
  }
}

export default OpenLibraryBookRepository
