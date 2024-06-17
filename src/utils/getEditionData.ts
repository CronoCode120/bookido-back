const getEditionData = (books: any[]) => {
  const editions = books.flatMap((book: any) => {
    const bookData = {
      subjects: book.subject
    }
    const newData = book.editions.docs.map((edition: any) => ({
      ...edition,
      ...bookData
    }))

    return newData
  })

  return editions
}

export default getEditionData
