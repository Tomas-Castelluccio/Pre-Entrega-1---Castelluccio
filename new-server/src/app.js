const express = require('express')
const app = express()
const port = 3000

app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/json', (req, res) => {
    res.json({ message: 'Hello World!' })
})

// * Data por query params y por body
app.get('/query', (req, res) => {
    const { name } = req.query
    res.send(`Hello ${name}!`)
})

app.post('/body', (req, res) => {
    const { name } = req.body
    res.send(`Hello ${name}!`)
})

app.get('/param/:id', (req, res) => {
    const { id } = req.params
    res.send(`Hello ${id}!`).status(200)
})

app.get('/html', (req, res) => {
    const {name} = req.query
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hello World</title>
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f0f0f0;
                font-family: Arial, sans-serif;
            }
            h1 {
                color: #333;
            }
        </style>
    </head>
    <body>
        <h1>Wauuauu super! Hello ${name || 'World'}!</h1>
    </body>
    </html>`)
})


module.exports = { app, port }
