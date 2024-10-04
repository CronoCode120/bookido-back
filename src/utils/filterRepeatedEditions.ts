const filterRepeatedEditions = (editions: any[]): any[] => {
  const seenEditions: any[] = []

  return editions.filter(edition => {
    const found = seenEditions.find(
      seen =>
        seen.title === edition.title &&
        seen.publisher.toLowerCase() === edition.publisher.toLowerCase()
    )

    if (!found) {
      seenEditions.push(edition)
      return true
    }
    return false
  })
}

export default filterRepeatedEditions
