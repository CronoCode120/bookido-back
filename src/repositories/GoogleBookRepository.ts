class GoogleBookRepository {
  getBooksByPublisher = async () => {
    const url = 'https://www.googleapis.com/books/v1/volumes?q=search+terms'
    const res = await fetch(url)
    const data = await res.json()

    return data
  }
}

export default GoogleBookRepository
