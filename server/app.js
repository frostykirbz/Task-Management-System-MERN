// requires modules
const express = require("express")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const routeRoute = require("./routes/routes")
const cors = require("cors")

// creates a new express application
const app = express()
require("dotenv").config()

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
)

// set environment variable PORT to tell your webserver what port to listen on
// whatever is in environment variable PORT or 3000 if nothing is there
const port = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// create middleware to use routes
app.use("/api", routeRoute)

// if not within routes, send 4004 error to postman (REST API)
app.use("*", function checkroute(req, res) {
  res.send({ code: 4004 })
})

// bind and listen connections on specified host and PORT
app.listen(port)
