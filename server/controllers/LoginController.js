const con = require("../config/config-database")
const strip = require("strip")
const bcrypt = require("bcrypt")
const validator = require("validator")
const setMessage = require("../message")
const { checkGroup } = require("./GroupCheckController")

function checkUsernameFormat(username) {
  var whitespace = /^\S*$/
  if (whitespace.test(username)) {
    return true
  } else {
    return false
  }
}

// declare promise

// Login Authentication
// Frontend: Login.js [Axios.post("/api/login", { username })]
const loginAuth = async (req, res, next) => {
  let username = req.body.username
  let password = req.body.password
  let email = ""
  let isactive = ""
  let group = ""

  // LOGIN - VALIDATION
  // remove all leading and trailing spaces/tabs
  username = strip(username)
  password = strip(password)

  // call checkGroup function
  const admin = await checkGroup({ username, groupname: "Admin" })

  // await promise
  // check for result with if statement const = false
  // if false return next
  // if true res.send

  // return resolve("empty password")

  // check username (empty field)
  if (validator.isEmpty(username)) {
    console.log("Please enter username.")
    return next(setMessage("Please enter username.", req, res))
  }

  // check username (whitespace)
  if (!checkUsernameFormat(username)) {
    console.log("Username must not contain whitespace.")
    return next(setMessage("Username must not contain whitespace.", req, res))
  }

  // check password (empty field)
  if (validator.isEmpty(password)) {
    console.log("Please enter password.")
    return next(setMessage("Please enter password.", req, res))
  }

  if (username && password) {
    const checkLogin = `SELECT password, email, isactive, usergroup
                          FROM accounts
                          WHERE username = ?`

    con.query(checkLogin, [username], function (err, rows) {
      if (err) throw err

      if (rows.length > 0) {
        const passwordCheck = bcrypt.compareSync(password, rows[0].password)

        // if valid password (matches hash password in database)
        if (passwordCheck) {
          const checkUser = `SELECT username, password, email, isactive, usergroup
                             FROM accounts
                             WHERE accounts.username = ?`

          con.query(checkUser, [username], function (err, rows) {
            if (rows.length > 0) {
              req.session.loggedin = true
              req.session.username = username

              // get user details from database
              email = rows[0].email
              isactive = rows[0].isactive
              group = rows[0].usergroup

              // check if user is inactive
              // if user is inactive (deny login)
              if (isactive == "Inactive") {
                console.log("User has no permission to login.")
                return next(setMessage("User has no permission to login.", req, res))
              }
              // if user is active (approve login)
              else if (isactive == "Active") {
                // store user details in JSON
                const userInfo = {
                  username: username,
                  admin: admin
                }

                res.send(userInfo)
                console.log("User " + username + " has logged in sucessfully.")
                console.log(userInfo)
              }
            } else {
              console.log("Invalid Username and/or Password.")
              return next(setMessage("Invalid Username and/or Password.", req, res))
            }
          })
        } else {
          console.log("Invalid Username and/or Password.")
          return next(setMessage("Invalid Username and/or Password.", req, res))
        }
      } else {
        console.log("Invalid Username and/or Password.")
        return next(setMessage("Invalid Username and/or Password.", req, res))
      }
    })
  }
}

module.exports = { loginAuth }
