// ###############################################################################
// Web Technology at VU University Amsterdam
// Assignment 3

const sqlite = require('sqlite3').verbose();
let db = my_database('./gallery.db');


const express = require("express");
const app = express();
const router = express.Router();


const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/");


app.use(express.json());


// ###############################################################################
// Routes

<<<<<<< HEAD

// Basic homepage for site
app.get("/", function(req, res) {
	const html = `<div style="text-align:center"><h1 style="margin:10%">Hello!</h1><p><a href="/api">Visit the API</a></p></div>`;

   	res.send(html);
})


// Get list of all authors in the database
router.get("/", function(req, res) {
	db.all(`SELECT * FROM gallery`, function(err, authors) {
      if (err) {
         res.status(400).send(err);
      } 
      else {
         res.json(authors);
      }
   });
});


// Get author by id
router.get('/:id', function (req, res) {
	// First read existing users.
	db.all("SELECT * FROM gallery WHERE id=?", [req.params.id], function (err, data) {

		if (err) {
			res.status(400).send(err);
		} 
		else {
			res.json(data);
		}
	});
 })


// Add a new author by posting json data
router.post("/", function(req, res) {
	let item = req.body;
    db.run(`INSERT INTO gallery (author, alt, tags, image, description)
        VALUES (?, ?, ?, ?, ?)`,
        [item['author'], item['alt'], item['tags'], item['image'],  item['description']], function(err, data) {
			if (err) {
				res.status(400).send(err.message);
			} 
			else {
				res.status(201).json(data);
			}
		})
});


// Delete author at given id
router.delete("/:id", function(req, res) {
    db.run("DELETE FROM gallery WHERE id=" + req.params.id, function(err, result) {
       if (err) {
          res.status(400).send(err);
       } 
       else {
          res.sendStatus(204);
       }
    });
});


// Update author at given id by putting json data
router.put("/:id", function(req, res) {
	let item = req.body;
    db.run(`UPDATE gallery
		SET author=?, alt=?, tags=?, image=?,
		description=? WHERE id=?`,
		[item['author'], item['alt'], item['tags'], item['image'], item['description'], req.params.id], 
		function(err, result) {
			if (err) {
				res.status(400).send(err);
			} 
			
			else {
				res.send(item)
				//res.sendStatus(204);
			}
		});
 });


// All requests to API begin with /api
app.use("/api", router);
=======
// This example route responds to http://localhost:3000/hello with an example JSON object.
// Please test if this works on your own device before you make any changes.npm

app.get("", function(req, res) {
	db.all(`SELECT * FROM gallery`, function(err, rows) {
	
		
    	// TODO: add code that checks for errors so you know what went wrong if anything went wrong
    	// TODO: set the appropriate HTTP response headers and HTTP response codes here.
		if (err) {
			res.status(400).send(err);
		 } 
    	// # Return db response as JSON
    	return res.json(rows)
    });
});

app.get("/:id", function(req, res) {
	db.all(`SELECT * FROM gallery Where id=?`, req.params.id, function(err, rows) {
	
		
    	// TODO: add code that checks for errors so you know what went wrong if anything went wrong
    	// TODO: set the appropriate HTTP response headers and HTTP response codes here.
		if (err) {
			res.status(400).send(err);
		 } 
    	// # Return db response as JSON
    	return res.json(rows)
    });
});

// This route responds to http://localhost:3000/db-example by selecting some data from the
// database and return it as JSON object.
// Please test if this works on your own device before you make any changes.
app.get('/db-example', function(req, res) {
    // Example SQL statement to select the name of all products from a specific brand
	db.all(`SELECT * FROM gallery WHERE author=?`, ['Grace Hopper'], function(err, rows) {
	
		
    	// TODO: add code that checks for errors so you know what went wrong if anything went wrong
    	// TODO: set the appropriate HTTP response headers and HTTP response codes here.
		if (err) {
			res.status(400).send(err);
		 } 
    	// # Return db response as JSON
    	return res.json(rows)
    });
});

app.post('/', async function(req, res) {
	const author = {
		author: req.body.author,
		alt: req.body.alt,
		tags: req.body.tags,
		image: req.body.image,
		description: req.body.description
	}  
	try {
		const newAuthor = await author.save()
		res.status(201).json(newAuthor)
	} catch (err) {
		res.status(400).json({ message: err.message })	
	}
 })

const router = express.Router();
// router.get("", function(req, res) {

// 	const author = {
// 	   author: "Tim Berners-Lee",
// 	   alt: "Image of Berners-Lee",
// 	   tags: "html,http,url,cern,mit",
// 	   image: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Sir_Tim_Berners-Lee.jpg",
// 	   description: "The internet and the Web aren't the same thing."
// 	};
 
// 	res.json(author);
//  });

//  router.get("/:id", (req, res) => {
// 	res.send(req.params.id)
//  })

 router.post('/', async (req,res) => {
	const author = {
		author: req.body.author,
		alt: req.body.alt,
		tags: req.body.tags,
		image: req.body.image,
		description: req.body.description
	}
	try {
		const newAuthor = await author.save()
		res.status(201).json(newAuthor)
	} catch (err) {
		res.status(400).json({ message: err.message })	
	}
 })

 router.delete('/id', async (req, res) => {
	
 })

// var options = {
//   'method': 'POST',
//   'url': 'http://localhost:3000/:id',
//   'headers': {
//   },
//   formData: {

//   }
// };
// request(options, function (error, response) {
//   if (error) throw new Error(error);
//   console.log(response.body);
// });


// app.post('/post-example', function(req, res) {
// 	// This is just to check if there is any data posted in the body of the HTTP request:
// 	console.log(req.body);
// 	return res.json(req.body);
// });
>>>>>>> 9695d2d (start doc)


// ###############################################################################
// This should start the server, after the routes have been defined, at a random port:

let port = Math.floor(Math.random() * 9000) + 1000;
app.listen(port);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:" + port);

<<<<<<< HEAD
=======
app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000");
>>>>>>> 9695d2d (start doc)

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
	// Conncect to db by opening filename, create filename if it does not exist:
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database.');
	});
	// Create our phones table if it does not exist already:
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS gallery
        	 (
                    id INTEGER PRIMARY KEY,
                    author CHAR(100) NOT NULL,
                    alt CHAR(100) NOT NULL,
                    tags CHAR(256) NOT NULL,
                    image char(2048) NOT NULL,
                    description CHAR(1024) NOT NULL
		 )
		`);

		db.all(`select count(*) as count from gallery`, function(err, result) {
			if (result[0].count == 0) {
				db.run(`INSERT INTO gallery (author, alt, tags, image, description) VALUES (?, ?, ?, ?, ?)`, [
        			"Tim Berners-Lee",
        			"Image of Berners-Lee",
        			"html,http,url,cern,mit",
        			"https://upload.wikimedia.org/wikipedia/commons/9/9d/Sir_Tim_Berners-Lee.jpg",
        			"The internet and the Web aren't the same thing."
    			]);

				db.run(`INSERT INTO gallery (author, alt, tags, image, description) VALUES (?, ?, ?, ?, ?)`, [
        			"Grace Hopper",
        			"Image of Grace Hopper at the UNIVAC I console",
        			"programming,linking,navy",
        			"https://upload.wikimedia.org/wikipedia/commons/3/37/Grace_Hopper_and_UNIVAC.jpg",
					"Grace was very curious as a child; this was a lifelong trait. At the age of seven, she decided to determine how an alarm clock worked and dismantled seven alarm clocks before her mother realized what she was doing (she was then limited to one clock)."
    			]);

				console.log('Inserted dummy photo entry into empty database');
			} 
			
			else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
			}
		});
	});
	return db;
}