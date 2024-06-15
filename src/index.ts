import express from 'express'
import process from 'node:process'

const app = express()
const port = process.env.PORT ?? 3000

app.use(express.json())

app.get('/books')

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
