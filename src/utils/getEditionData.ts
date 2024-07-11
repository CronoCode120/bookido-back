const getEditionData = (books: any[]) => {
  const editions = books.flatMap((book: any) => {
    const bookData = {
      subjects: book.subject,
      author: book.author_name
    }

    const newData = book.editions.docs.map((edition: any) => {
      const { author_name, ...editionData } = edition
      return {
        ...editionData,
        ...bookData
      }
    })

    return newData
  })

  return editions
}

export default getEditionData
