import express from 'express'

const app = express()

app.get('/api/home', (req, res) => {
  res.json({message:'message from home'})
})

app.get('/api/about', (req, res) => {
  res.json({message:'message from about'})
})

app.listen(5000, () => {
  console.log(123)
})