// brings in Express to handle all HTTP calls
const express = require('express')
// used to help handle file paths
const path = require('path')
// creating shortcut to organize API calls
const api = require('routes/api.js')

// This is used to process the PORT for either Heroku or Local machine
const PORT = process.env.PORT || 3001

// creates Express as an object
const app = express()

// Used to help express read and understand JSON and URLs
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Makes public folders as the Static files
app.use(express.static('public'))

// Sets the API path
app.use('/api', api)

// Shows note page when called
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '.public.notes.html'))
})

// for any other call takes you home instead of erroring.
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, './public/index.html'));
});

// Set app to listen to PORT chosen above
app.listen(PORT, () =>
	console.log(`Listening at http://localhost:${PORT}`)
);