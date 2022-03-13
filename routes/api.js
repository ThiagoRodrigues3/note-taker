// Bringing in express
const express = require('express')
// sets up the Router object for Express
const router = express.Router()
// Imports and brings in Unique IDs for the notes
const { v4: uuidv4 } = require('uuid');
// pulls in functions from Utils
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');

// This route is set up to retrieve the notes from the DB in JSON format
router.get('/notes', (req, res) => {
	readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// Post is designed to take information given and write it to the DB if in the proper format.
router.post('/notes', (req, res) => {
	// gets data from the body
	const { title, text } = req.body;

    // logic that chooses if Data is formatted correctly
	if (title && text) {
        // creates them into an item
		const newNote = {
			title,
			text,
			id: uuidv4(),
		};

        // adds not to the DB
		readAndAppend(newNote, './db/db.json');

		// success message
		const message = {
			status: 'success',
			body: newNote,
		};
		res.json(message);
	} else {
		
		res.json('Error in adding note');
	}
});

// Uses ID given to search the DB and remove note
router.delete("/notes/:id", (req, res) => {
    // Retrieves info from DB
    readFromFile("./db/db.json").then((rawData) => {
        // makes the data readable 
        const data = JSON.parse(rawData);

        // Finds the note that matches the request and filters it out
        const newNote = data.filter((element) => {
            return element.id !== req.params.id;
        });

        // Checks note to see if it matches or not and decides to write new note
        if(newNote !== data){
            writeToFile("./db/db.json", newNote);
            console.log("note DELETE successful.")
            res.json(`Note successfully deleted.`);
        }
        else{
            // Lets user know if Data wasn't found
            res.json(`Error in deleting note. Could not be found.`);
        }
    });
});

// exports the Router
module.exports = router;

