const fs = require('fs'); // Ensures the database folder exists
const path = require('path') // for safe file paths
const sqlite3 = require('sqlite3').verbose() //imports the sqlite3, and used verbose to show full stack traces
const DB_FILE = process.env.DATABASE_FILE || path.join(__dirname, '..', 'data', 'fastfood.db'); // database file path, either from environement variable or default to fastfood.db in the current directory
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true}); // Creates a parent folder if it is missing
const db = new sqlite3.Database(DB_FILE); // Opens the database at the configured file path, and if the file does not exist, it will be created

const hbs = require('hbs') // imports hbs
hbs.registerHelper('json', function(context) { // this is a helper function so we can have json in our hbs
  return JSON.stringify(context) // using JSON.stringify to convert it to a string
})

db.serialize(function() { // a function so that it runs based on order
 let sql = "CREATE TABLE IF NOT EXISTS users (userid TEXT PRIMARY KEY, password TEXT, role TEXT)" // a table is created for the users with the columns userid, password, and role
 db.run(sql) // this will run the sql variable so that it displays the table
 sql = "INSERT OR REPLACE INTO users VALUES ('Abdulla', 'Abdulla', 'admin')" // to insert values into the table
 db.run(sql) // this will run the sql variable so that it displays the values in the table
 sql = "INSERT OR REPLACE INTO users VALUES ('Jack', 'secret', 'guest')" // to insert values into the table
 db.run(sql) // this will  run the sql variable so that it displays the values in the table
  sql = "INSERT OR REPLACE INTO users VALUES ('Liam', 'secret2', 'guest')" // to insert values into the table
  db.run(sql) // this will  run the sql variable so that it displays the values in the table
  sql = "CREATE TABLE IF NOT EXISTS ranklist (userid TEXT, restaurant TEXT, logo TEXT, rank TEXT, PRIMARY KEY (userid, restaurant))" // a table is created for ranklist with the columns userid, restaurant name, logo (the image), the rank (S to F), and primary key for userid and restaurant so that each user can only rank a restaurant once
  db.run(sql) // this will run the sql variable so that it displays the table
})

exports.authenticate = function(request, response, next) { // function for user authentication
  /*
	Middleware to do BASIC http 401 authentication
	*/
  let auth = request.headers.authorization
  // auth is a base64 representation of (username:password)
  //so we will need to decode the base64
  if (!auth) { // if there is no authorization header
    //note here the setHeader must be before the writeHead
    response.setHeader('WWW-Authenticate', 'Basic realm="need to login"') // sets the header so that it requires authorization
    response.writeHead(401, {'Content-Type': 'text/html'}) // sends a 401 
    console.log('No authorization found, send 401.') // logs no uthorization found
    return response.end(); // ends response
  }
    console.log("Authorization Header: " + auth)
    //decode authorization header
    // Split on a space, the original auth
    //looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
    var tmp = auth.split(' ')

    // create a buffer and tell it the data coming in is base64
    var buf = Buffer.from(tmp[1], 'base64');

    // read it back out as a string
    var plain_auth = buf.toString()
    console.log("Decoded Authorization ", plain_auth)

    //extract the userid and password as separate strings
    var credentials = plain_auth.split(':') // split on a ':'
    var username = credentials[0]
    var password = credentials[1]
    console.log("User: ", username)
    console.log("Password: ", password)

    var authorized = false // set it to false, so that we determine if it is a authorized user
    db.all("SELECT userid, password, role FROM users", function(err, rows) { // users in the databse get selected
      for (var i = 0; i < rows.length; i++) { // goes through all the rows
        if (rows[i].userid == username && rows[i].password == password) { // if both username and password are correct
          authorized = true // then set it to true because it is a valid authorized  user
          request.userid = username // attach the username to the request object for later use
          request.user_role = rows[i].role // attach the user role to the request object for later use
          break // exits the loop once user is found
        }
      }
      if (!authorized) { // if not authorized
        response.setHeader('WWW-Authenticate', 'Basic realm="need to login"') // sets header so that it requires authorization
        response.writeHead(401, {'Content-Type': 'text/html'}) // send a 401
        console.log('No authorization found, send 401.') // logs no authorization found
        return response.end() // ends response
      } else { // else if the user is authorized
        next() // then next is called to move on to the next middleware
    }
  })
}

exports.users = function(request, response) {// created a function for the users page
  console.log('USER ROLE: ' + request.user_role) // logs user role
  if (request.user_role !== 'admin') { // if that user is not the admin
    response.writeHead(403, { 'Content-Type': 'text/html' }) // then send a 403
    response.end("ERROR: Admin Privileges Required To See Users") // ends the response and display an error message
    return // exits the function
  }
  db.all("SELECT userid, password, role FROM users", function(err, rows) { // users in the database get selected
    response.render('users', {title: 'List of Users', userRegistred: rows}) // rendering the user page to contain a title List of Users and to display the users in the database (https://www.topcoder.com/thrive/articles/using-ejs-template-engine-with-express-js)
  })
}

exports.rankList = function(request, response) { // created a function for the rankList page
  const ranks = ['S', 'A', 'B', 'C', 'D', 'F'] // this is the ranks to rank the fast food restaurants
  const tier = Object.fromEntries(ranks.map(r => [r, []])) // made an onject that contains ranks with empty arrays

  db.all("SELECT restaurant, logo, rank FROM ranklist WHERE userid = ?", [request.userid], function(err, rows) { // the restaurants, logos, and ranks get selected from the rankList table where the userid equals the user that is logged in 
    for (let i = 0; i < rows.length; i++) { // goes through all the rows
      let row = rows[i] // the row variable gets set to current row
      if (ranks.includes(rows[i].rank)) { // if it is present in the ranks
        tier[rows[i].rank].push({name: rows[i].restaurant, logo: rows[i].logo}) // then it will add the restaurant name and logo to the rank
      }
    }

    response.render('rankList', {title: 'Ranking Restaurants', tier}) // rendering the rankList page to have the title Ranking Restaurants and to display the tier object (which contains the key as the rank and value as the array of restaurants and logos) (https://www.topcoder.com/thrive/articles/using-ejs-template-engine-with-express-js)
  })
}

exports.restaurants =  function(request, response) { // created a function for the restaurants JSON page
  const list = [ // setup a list for the fast food resaurants, this list contains the name and logo of the restaurants
    {name: "A&W", logo: "/images/A&W.png"},
    {name: "Burger King", logo: "/images/Burger King.png"},
    {name: "Dairy Queen", logo: "/images/Dairy Queen.png"},
    {name: "Dominos", logo: "/images/Dominos.png"},
    {name: "Five Guys", logo: "/images/Five Guys.png"},
    {name: "KFC", logo: "/images/KFC.png"},
    {name: "Little Caesers", logo: "/images/Little Caesers.png"},
    {name: "Mary Browns", logo: "/images/Mary Browns.png"},
    {name: "Mcdonald's", logo: "/images/Mcdonald's.png"},
    {name: "Pizza Hut", logo: "/images/Pizza Hut.png"},
    {name: "Popeyes", logo: "/images/Popeyes.png"},
    {name: "Subway", logo: "/images/Subway.png"},
    {name: "Taco Bell", logo: "/images/Taco Bell.png"},
    {name: "Tim Hortons", logo: "/images/Tim Hortons.png"},
    {name: "Wendy's", logo: "/images/Wendy's.png"}
  ]
  response.writeHead(200, {'Content-Type' : 'application/json'}) // header set to 200 and content type to json because it is a json file
  response.end(JSON.stringify(list)) // ends it then converts the list to a string so that it can be seen as a json file
}

