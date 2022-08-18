const con = require("../config/config-database")
const strip = require("strip")
const bcrypt = require("bcrypt")
const validator = require("validator")
const { checkGroup } = require("../controllers/GroupCheckController")

function checkUsernameFormat(username) {
  var whitespace = /^\S*$/
  if (whitespace.test(username)) {
    return true
  } else {
    return false
  }
}

// create task function (POSTMAN - POST METHOD)
const GetTaskbyState = async (req, res) => {
  try {
    // declare variables for Login and CreateTask
    let JSON = req.body
    let getTaskByStateInfo = {}

    // setting JSON keys to lower case
    for (let key in JSON) {
      getTaskByStateInfo[key.toLowerCase()] = JSON[key]
    }

    let Task_state = getTaskByStateInfo.task_state

    // call all required promises (login/checkgroup/createtask)
    const Login = await login(createTaskInfo)
    console.log(Login)
    // Login: if user is authenticated (success)
    if (Login.code === 200) {
      console.log("login")
      try {
        // Check App Permit Create: if user is in app permit create (success)
      } catch (error) {
        // Login: error (fail)
        res.send({ error })
      }
    }
  } catch (error) {
    res.send({ error })
  }
}

// Login (PROMISE)
function login(JSON) {
  return new Promise((resolve, reject) => {
    // declare variables
    let username = JSON.username
    let password = JSON.password
    let email = ""
    let isactive = ""
    let usergroup = ""

    if (!JSON.hasOwnProperty("username") || !JSON.hasOwnProperty("password") || !JSON.hasOwnProperty("task_state")) {
      return reject({ code: 4008 })
    }

    // LOGIN - VALIDATION
    // remove all leading and trailing spaces/tabs
    username = strip(username)
    password = strip(password)

    // check username (empty field)
    if (validator.isEmpty(username)) {
      return reject({ msg: "Empty Username", code: 4006 })
    }

    // check username (whitespace)
    if (!checkUsernameFormat(username)) {
      return reject({ msg: "Whitespace Username", code: 4005 })
    }

    // check password (empty field)
    if (validator.isEmpty(password)) {
      return reject({ msg: "Empty Password", code: 4006 })
    }

    if (username && password) {
      const checkLogin = `SELECT password, email, isactive, usergroup
                          FROM accounts
                          WHERE username = ?`

      con.query(checkLogin, [username], function (err, rows) {
        if (err) reject(err)

        if (rows.length > 0) {
          const passwordCheck = bcrypt.compareSync(password, rows[0].password)

          // if valid password (matches hash password in database)
          if (passwordCheck) {
            const checkUser = `SELECT username, password, email, isactive, usergroup
                               FROM accounts
                               WHERE accounts.username = ?`

            con.query(checkUser, [username], function (err, rows) {
              if (err) reject(err)

              if (rows.length > 0) {
                // req.session.loggedin = true
                // req.session.username = username

                // get user details from database
                email = rows[0].email
                isactive = rows[0].isactive
                usergroup = rows[0].usergroup

                // check if user is inactive
                // if user is inactive (deny login)
                if (isactive == "Inactive") {
                  return reject({ msg: "Deny Permission", code: 4002 })
                }
                // if user is active (approve login)
                else if (isactive == "Active") {
                  // store user details in JSON
                  const userInfo = {
                    username: username,
                    email: email,
                    isactive: isactive,
                    usergroup: usergroup
                  }
                  return resolve({ code: 200 })
                }
              } else {
                return reject({ msg: "Invalid Login", code: 4001 })
              }
            })
          } else {
            return reject({ msg: "Invalid Login", code: 4001 })
          }
        } else {
          return reject({ msg: "Invalid Login", code: 4001 })
        }
      })
    }
  })
}

function gettaskstate(Task_state) {
  return new Promise((resolve, reject) => {
    // if check for validation (reject with code 4001-4008)
    // E.g. return reject({code: 4006 })
    // if no validation errors (resolve with code 200)
    // E.g. return resolve({code: 200 })

    if (validator.isEmpty(Task_state)) {
      return reject({ msg: "task state missing", code: 4006 })
    }
  })
}

module.exports = { GetTaskbyState }
