class BookRepository {
  getFilteredBooks = async () => {
    const url = 'https://openlibrary.org/search.json?publisher=alpha+decay'
    const res = await fetch(url)
    const data = await res.json()

    return data
  }
}

export default BookRepository
