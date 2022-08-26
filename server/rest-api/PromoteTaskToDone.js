const con = require("../config/config-database")
const strip = require("strip")
const bcrypt = require("bcrypt")
const validator = require("validator")
const nodemailer = require("nodemailer")
const { checkGroup } = require("../controllers/GroupCheckController")

function checkUsernameFormat(username) {
  var whitespace = /^\S*$/
  if (whitespace.test(username)) {
    return true
  } else {
    return false
  }
}

// promote task to done function (POSTMAN - POST METHOD)
const PromoteTask2DoneAPI = async (req, res) => {
  try {
    // declare variables for Login and CreateTask
    let JSON = req.body
    let promoteTaskToDoneInfo = {}

    // setting JSON keys to lower case
    for (let key in JSON) {
      promoteTaskToDoneInfo[key.toLowerCase()] = JSON[key]
    }

    let username = promoteTaskToDoneInfo.username
    let Task_name = promoteTaskToDoneInfo.task_name
    let Task_state = "Done"

    // remove all leading and trailing spaces and tabs
    Task_name = strip(Task_name)

    // call all required promises (login/checkgroup/promotetask)
    const Login = await login(promoteTaskToDoneInfo)

    // Login: if user is authenticated (success)
    if (Login.code === 200) {
      console.log("login")
      try {
        const PermitDoing = await checkAppPermitDoing(Task_name)

        // Check App Permit Create: if user is in app permit create (success)
        if (PermitDoing.code === 200) {
          console.log("permit doing")
          let permitdoing = PermitDoing.permitDoing
          try {
            const UserGroup = await checkGroup(username, permitdoing)
            console.log("usergroup")
            if (UserGroup) {
              console.log("correct usergroup")
              try {
                const success = await promotetask(Task_name, Task_state, username)
                console.log("promote task")
                // Create Task: if create task validation errors are none (success)
                if (success.code === 200) {
                  console.log("promoted task successfully")
                  res.send(success)
                }
              } catch (error) {
                // Promote Task: error (fail)
                res.send(error)
              }
            }
          } catch (error) {
            // User Group === App Permit Doing: error (fail)
            res.send(error)
          }
        }
      } catch (error) {
        // Get App Permit Doing: error (fail)
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

    if (!JSON.hasOwnProperty("username") || !JSON.hasOwnProperty("password") || !JSON.hasOwnProperty("task_name")) {
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

// Promote Task (PROMISE)
function promotetask(Task_name, Task_state, Task_owner) {
  return new Promise((resolve, reject) => {
    let Task_app_Acronym = ""
    let Task_plan = ""
    let taskNotes = ""
    let updatedTaskNotes = ""
    let previousTaskState = ""
    let formattedTaskNotes = ""
    let notesArray = []

    // send mail variables
    let taskOwnerEmail = ""
    let email = ""
    let usergroup = false

    // new date object
    let date_ob = new Date()

    // current date
    // adjust 0 before single digit date
    let day = ("0" + date_ob.getDate()).slice(-2)

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2)

    // current year
    let year = date_ob.getFullYear()

    // current hours
    let hours = date_ob.getHours()

    // current minutes
    let minutes = date_ob.getMinutes()

    // current seconds
    let seconds = date_ob.getSeconds()

    // current datetime (DD-MM-YYYY HH:MM:SS format)
    let datetime = day + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds

    const getTaskNotes = `SELECT Task_notes, DATE_FORMAT(Task_updateDate, "%d-%m-%Y") AS updatedate, TIME_FORMAT(Task_updateDate, "%H:%i:%s") AS updatetime, Task_state, Task_owner
                          FROM tasknotes
                          WHERE Task_name = ?
                          AND Task_app = ?       
                          ORDER BY Task_updateDate DESC`

    const getTask = `SELECT * 
                     FROM task
                     WHERE Task_name = ?
                     AND Task_state = "Doing"`

    const addTaskNotes = `INSERT INTO tasknotes (Task_name, Task_plan, Task_app, Task_notes, Task_state, Task_owner, Task_updateDate) VALUES (?, ?, ?, ?, ?, ?, now())`

    const updateTask = `UPDATE task SET Task_notes = ?, Task_state = ?, Task_owner = ? WHERE Task_name = ? AND Task_app_Acronym = ?`

    // check for task notes
    con.query(getTask, [Task_name], function (err, rows) {
      if (err) reject(err)

      // if task (task state: doing) exists in database
      if (rows.length > 0) {
        Task_plan = rows[0].Task_plan
        Task_app_Acronym = rows[0].Task_app_Acronym
        taskNotes = rows[0].Task_notes
        previousTaskState = rows[0].Task_state

        // if task notes is empty
        if (taskNotes === "") {
          // tasknotes
          updatedTaskNotes = Task_owner + " has moved task from " + previousTaskState + " state to " + Task_state + " state."

          // insert into tasknotes
          con.query(addTaskNotes, [Task_name, Task_plan, Task_app_Acronym, updatedTaskNotes, Task_state, Task_owner], console.log("Added Task Notes."))

          // format task notes with header (datetime, task state, task owner)
          formattedTaskNotes = "[" + datetime + "\tTask State: " + Task_state + "\t Task Owner: " + Task_owner + "]\n" + updatedTaskNotes + "\n"

          // update tasknotes in task
          con.query(updateTask, [formattedTaskNotes, Task_state, Task_owner, Task_name, Task_app_Acronym], console.log("Updated task notes."))
        }
        // if task notes is not empty
        else {
          // tasknotes
          updatedTaskNotes = Task_owner + " has moved task from " + previousTaskState + " state to " + Task_state + " state."

          // insert into tasknotes
          con.query(addTaskNotes, [Task_name, Task_plan, Task_app_Acronym, updatedTaskNotes, Task_state, Task_owner], console.log("Added Task Notes."))

          con.query(getTaskNotes, [Task_name, Task_app_Acronym], function (err, rows) {
            if (err) reject(err)
            // if task notes exist in database
            if (rows.length > 0) {
              for (var i = 0; i < rows.length; i++) {
                formattedTaskNotes =
                  "[" + rows[i].updatedate + " " + rows[i].updatetime + "\tTask State: " + rows[i].Task_state + "\t Task Owner: " + rows[i].Task_owner + "]\n" + rows[i].Task_notes + "\n"
                notesArray.push(formattedTaskNotes)
              }

              formattedTaskNotes = notesArray.join("\n")

              // update tasknotes in task
              con.query(updateTask, [formattedTaskNotes, Task_state, Task_owner, Task_name, Task_app_Acronym], console.log("Updated task notes."))
            }
            // if task notes does not exist in database
            else {
              // format task notes with header (datetime, task state, task owner)
              formattedTaskNotes = "[" + datetime + "\tTask State: " + Task_state + "\t Task Owner: " + Task_owner + "]\n" + updatedTaskNotes + "\n"

              // update tasknotes in task
              con.query(updateTask, [formattedTaskNotes, Task_state, Task_owner, Task_name, Task_app_Acronym], console.log("Updated task notes."))
            }
          })
        }

        // send mail
        const transport = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: process.env.MAIL_PORT,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
          }
        })

        const getAccountEmail = `SELECT * 
                                 FROM accounts`

        const getAccount = `SELECT * 
                            FROM accounts 
                            WHERE username = ?`

        con.query(getAccount, [Task_owner], function (err, rows) {
          if (err) reject(err)
          if (rows.length > 0) {
            taskOwnerEmail = rows[0].email
          }

          con.query(getAccountEmail, async function (err, rows) {
            if (err) reject(err)
            if (rows.length > 0) {
              for (var i = 0; i < rows.length; i++) {
                email = rows[i].email
                usergroup = rows[i].usergroup.includes("Project Lead")

                if (usergroup) {
                  await transport.sendMail({
                    from: taskOwnerEmail,
                    to: email,
                    subject: "TMS Task Notification",
                    html: `
                          <h2>Your task is now completed!</h2>
                          <hr/>
                          <p>Dear ${rows[i].username},</p>
                          <p>${Task_owner} has completed task ${Task_name} in Application ${Task_app_Acronym}.</p>
                          <br/>
                          <p><small><i>This is an automated email. Do not reply this email.</i></small></p>
                      `
                  })
                }
              }
            }
          })
        })

        console.log("Task is moved to another state.")
        return resolve({ code: 200 })
      }
      // if task (task state: doing) does not exist in database
      else {
        return reject({ code: 4005 })
      }
    })
  })
}

// Check App Permit Doing (PROMISE)
function checkAppPermitDoing(task) {
  return new Promise((resolve, reject) => {
    // check empty task app acronym
    if (validator.isEmpty(task)) {
      return reject({ code: 4006 })
    }

    let Task_app_Acronym = ""
    let Task_state = ""
    let permitDoing = ""
    const getTaskApp = `SELECT *
                        FROM task
                        WHERE Task_name = ?`

    con.query(getTaskApp, [task], function (err, rows) {
      if (err) reject(err)
      if (rows.length > 0) {
        Task_app_Acronym = rows[0].Task_app_Acronym
        Task_state = rows[0].Task_state

        // check for valid task state but not "doing"
        if (Task_state.toLowerCase() === "open" || Task_state.toLowerCase() === "to do" || Task_state.toLowerCase() === "done" || Task_state.toLowerCase() === "close") {
          return reject({ code: 4007 })
        }

        const appPermitDoing = `SELECT *
                                FROM application
                                WHERE App_Acronym = ?`

        con.query(appPermitDoing, [Task_app_Acronym], function (err, rows) {
          if (err) reject(err)
          if (rows.length > 0) {
            permitDoing = rows[0].App_permit_Doing
            return resolve({ code: 200, permitDoing: permitDoing })
          } else {
            return reject({ code: 4005 })
          }
        })
      } else {
        return reject({ code: 4005 })
      }
    })
  })
}

module.exports = { PromoteTask2DoneAPI }
