const con = require("../config/config-database")
const strip = require("strip")
const bcrypt = require("bcrypt")
const validator = require("validator")

function checkUsernameFormat(username) {
  var whitespace = /^\S*$/
  if (whitespace.test(username)) {
    return true
  } else {
    return false
  }
}

// get task by state function (POSTMAN - GET METHOD)
const GetTaskbyStateAPI = async (req, res) => {
  try {
    // declare variables for Login and CreateTask
    let JSON = req.body
    let getTaskByStateInfo = {}

    // setting JSON keys to lower case
    for (let key in JSON) {
      getTaskByStateInfo[key.toLowerCase()] = JSON[key]
    }

    let Task_state = getTaskByStateInfo.task_state

    // remove all leading and trailing spaces and tabs
    Task_state = strip(Task_state)

    // call all required promises (login/checktaskstate)
    const Login = await login(getTaskByStateInfo)

    // Login: if user is authenticated (success)
    if (Login.code === 200) {
      console.log("login")
      try {
        // Check Task state: (success)
        const success = await gettaskbystate(Task_state)

        if (success.code === 200) {
          console.log("task state")
          res.send(success)
        }
      } catch (error) {
        // Check Task state: error (fail)
        res.send(error)
      }
    }
  } catch (error) {
    // Login: error (fail)
    res.send(error)
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
      return reject({ code: 4006 })
    }

    // check username (whitespace)
    if (!checkUsernameFormat(username)) {
      return reject({ code: 4005 })
    }

    // check password (empty field)
    if (validator.isEmpty(password)) {
      return reject({ code: 4006 })
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
                  return reject({ code: 4002 })
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
                return reject({ code: 4001 })
              }
            })
          } else {
            return reject({ code: 4001 })
          }
        } else {
          return reject({ code: 4001 })
        }
      })
    }
  })
}

// Get Task by State (PROMISE)
function gettaskbystate(Task_state) {
  return new Promise((resolve, reject) => {
    // check for empty task state
    if (validator.isEmpty(Task_state)) {
      return reject({ code: 4006 })
    }

    // check for invalid task state
    if (
      Task_state.toLowerCase() === "open" ||
      Task_state.toLowerCase() === "to do" ||
      Task_state.toLowerCase() === "doing" ||
      Task_state.toLowerCase() === "done" ||
      Task_state.toLowerCase() === "close"
    ) {
      const getTask = `SELECT * 
                       FROM task
                       WHERE LOWER( Task_state ) = ?`

      con.query(getTask, [Task_state.toLowerCase()], function (err, rows) {
        if (err) reject(err)

        // if there are tasks
        if (rows.length > 0) {
          return resolve({ code: 200, data: rows })
        }
        // if there are no task
        else {
          return resolve({ code: 200, data: [] })
        }
      })
    }
    // if invalid task state
    else {
      return reject({ code: 4005 })
    }
  })
}

module.exports = { GetTaskbyStateAPI }
