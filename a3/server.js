// ###############################################################################
// Web Technology at VU University Amsterdam
// Assignment 3

const sqlite = require('sqlite3').verbose();
let db = my_database('./gallery.db');


// First, create an express application `app`:
const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const validate = require('mongoose-validator')
mongoose.connect("mongodb://127.0.0.1/");
mongoose.set('strictQuery', true);


// create validator to parse URL form entries
var urlValidator = [
validate({ 
	validator: value => validator.isURL(value, { protocols: ['http','https','ftp'], require_tld: true, require_protocol: true }),
	message: 'Must be a Valid URL' 
  })
]


// We need some middleware to parse JSON data in the body of our HTTP requests:
app.use(express.json());
//app.use(express.urlencoded({extended: false}));


// ###############################################################################
// Routes


app.get("", function(req, res) {
	db.all(`SELECT * FROM gallery`, function(err, rows) {
		if (err) {
            res.status(400).send(err);
        } 
        else {
            res.json(rows);
        }
	})
})


app.get("/test", function(req, res) {
	const html = `<h1>Hello, ${req.body.name}!</h1>
      <p>You are ${req.age} years old.</p>`;

   	res.send(html);
})


// Create a model from the schema
const Author = mongoose.model("Author", {
   author:		{ type: String, required: true },
   image:   	{ type: String, required: true, validate: urlValidator },
   alt:			{ type: String, required: true },
   tags: 		{ type: String, required: true },
   description: { type: String, required: true }
});


// Get list of all authors in the database
router.get("/", function(req, res) {
   Author.find(function(err, songs) {
      if (err) {
         res.status(400).send(err);
      } 
      else {
         res.json(songs);
      }
   });
});


// Add a new author to the database
router.post("/", function(req, res) {
   const author = new Author(req.body);
   author.save(function(err, song) {
      if (err) {
         res.status(400).send(err);
      } 
      else {
         res.status(201).json(song);
      }
   });
});


router.delete("/:id", function(req, res) {
    Author.deleteOne({ _id: req.params.id }, function(err, result) {
       if (err) {
          res.status(400).send(err);
       } 
       else if (result.matchedCount === 0) {
          res.sendStatus(404);
       } 
       else {
          res.sendStatus(204);
       }
    });
});


router.put("/:id", function(req, res) {
    // Author to update sent in body of request
    const author = req.body;
 
    // Replace existing author fields with updated author
    Author.updateOne({ _id: req.params.id }, author, function(err, result) {
       if (err) {
          res.status(400).send(err);
       } 
       else if (result.matchedCount === 0) {
          res.sendStatus(404);
       } 
       else {
          res.sendStatus(204);
       }
    });
 });


router.get("/", function(req, res) {
	let query = {};
	 
	// Check if tag was supplied in query string
	if (req.query.tags) {
	   query = { tags: req.query.tags };
	}
	
	for (let item in query.split(",")) {
		Author.find(item, function(err, authors) {
			if (err) {
			   res.status(400).send(err);
			} 
			else {
			   res.json(authors);
			}
		 });
	}
	
});


router.get("/:id", function(req, res) {
// Use the ID in the URL path to find the song
    Author.findById(req.params.id, function(err, author) {
        if (err) {
            res.status(400).send(err);
        } 
        else {
            res.json(author);
        }
    });
});


// All requests to API begin with /api
app.use("/api", router);




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
        else {
            res.json(rows);
        }
    });
});

app.post('/post-example', function(req, res) {
	// This is just to check if there is any data posted in the body of the HTTP request:
	console.log(req.body);
	return res.json(req.body);
});


// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:

app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/");


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