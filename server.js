const express = require('express') //express framework
const path = require('path') // for a safe file path
const logger = require('morgan') // morgan logger to log requests
const PORT = process.env.PORT || 3000 //allow environment variable to possible set PORT (set at 3000)

const app = express() // an express app is made

//Middleware
app.use(express.static(__dirname + '/public')) //static server for public so eveyrthing in public gets accessed
app.use(logger('dev')) // this is the logging middleware adds it in dev mode, for logging requests to the console
app.use(express.json()) // to parse json data for fetch() 

app.set('views', path.join(__dirname, 'views')) // goes to the views folder containing the hbs files 
app.engine('handlebars', require('hbs').__express) // register the handlebars engine with express with a .handlebars extension
app.set('view engine', 'handlebars') // this will assign the view engine to handlebars
app.locals.pretty = true // set it to true so that html is pretty

const routes = require('./routes/index') // loads the routes from the index.js file in the routes folder
app.use(routes.authenticate) // this is for authentication, to ensure that the user is logged in before accessing the routes

app.get('/users', routes.users) // when a user goes to /users, it will then display the users page
app.get('/ranklist', routes.rankList) // when a user goes to /ranklist, it will then display the ranklist page
app.get('/restaurants', routes.restaurants) // contains JSON parsed data with the restaurants name and logo

//starts server at the specific port
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port: ${PORT}`)
    console.log(`To Test:`)
    console.log(`http://localhost:${PORT}/ranklist`) // logs the URL for testing the rankList page
    console.log(`http://localhost:${PORT}/users`) // logs the URL for testing the users page
  
})
