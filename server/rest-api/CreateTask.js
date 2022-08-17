const con = require("../config/config-database")
const strip = require("strip")
const bcrypt = require("bcrypt")
const validator = require("validator")

// create task function
const CreateTask = async (req, res) => {
  let { username, password } = req.body
  let { taskName, taskDescription, taskNotes, taskPlan, taskAppAcronym, taskState, taskCreator, taskOwner } = req.body

  // call login promise
  const Login = await login({ username, password })
  const CreateTask = await createtask({ taskName, taskDescription, taskNotes, taskPlan, taskAppAcronym, taskState, taskCreator, taskOwner })

  if (Login === "emptyUsername") {
    res.send({ err: "emptyUsername", code: 4005 })
  } else if (Login === "whitespaceUsername") {
    res.send({ err: "whitespaceUsername", code: 4005 })
  } else if (Login === "emptyPassword") {
    res.send({ err: "emptyPassword", code: 4005 })
  } else if (Login === "denyLoginPermission") {
    res.send({ err: "denyLoginPermission", code: 4002 })
  } else if (Login === "invalidLogin") {
    res.send({ err: "invalidLogin", code: 4001 })
  } else {
    if (CreateTask === "emptyTaskName") {
      res.send({ err: "emptyTaskName", code: 4005 })
    } else if (CreateTask === "duplicatedTaskName") {
      res.send({ err: "duplicatedTaskName", code: 4005 })
    } else if (CreateTask === "emptyTaskDescription") {
      res.send({ err: "emptyTaskDescription", code: 4005 })
    } else if (CreateTask === "emptyTaskAppAcronym") {
      res.send({ err: "emptyTaskAppAcronym", code: 4005 })
    } else if (CreateTask === "invalidTaskAppAcronym") {
      res.send({ err: "invalidTaskAppAcronym", code: 4005 })
    } else {
      res.send({ err: "success", code: 200 })
    }
  }
}

function checkUsernameFormat(username) {
  var whitespace = /^\S*$/
  if (whitespace.test(username)) {
    return true
  } else {
    return false
  }
}

// Login promise (POST method)
function login({ username, password }) {
  return new Promise((resolve, reject) => {
    // declare variables
    let email = ""
    let isactive = ""
    let usergroup = ""

    // LOGIN - VALIDATION
    // remove all leading and trailing spaces/tabs
    username = strip(username)
    password = strip(password)

    // await promise
    // check for result with if statement const = false
    // if false return next
    // if true res.send

    // return resolve("empty password")

    // check username (empty field)
    if (validator.isEmpty(username)) {
      return resolve("emptyUsername")
    }

    // check username (whitespace)
    if (!checkUsernameFormat(username)) {
      return resolve("whitespaceUsername")
    }

    // check password (empty field)
    if (validator.isEmpty(password)) {
      return resolve("emptyPassword")
    }

    if (username && password) {
      const checkLogin = `SELECT password, email, isactive, usergroup
                            FROM accounts
                            WHERE username = ?`

      con.query(checkLogin, [username], async function (err, rows) {
        if (err) reject(err)

        if (rows.length > 0) {
          const passwordCheck = bcrypt.compareSync(password, rows[0].password)

          // if valid password (matches hash password in database)
          if (passwordCheck) {
            const checkUser = `SELECT username, password, email, isactive, usergroup
                              FROM accounts
                              WHERE accounts.username = ?`

            con.query(checkUser, [username], async function (err, rows) {
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
                  return resolve("denyLoginPermission")
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
                  return resolve(userInfo)
                }
              } else {
                return resolve("invalidLogin")
              }
            })
          } else {
            return resolve("invalidLogin")
          }
        } else {
          return resolve("invalidLogin")
        }
      })
    }
  })
}

// Create Task
function createtask({ taskName, taskDescription, taskNotes, taskPlan, taskAppAcronym, taskState, taskCreator, taskOwner }) {
  return new Promise((resolve, reject) => {
    let planColor = ""
    let rNumber = 0
    let taskID = ""
    let formattedTaskNotes = ""

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

    // remove all leading and trailing spaces and tabs
    taskName = strip(taskName)
    taskDescription = strip(taskDescription)
    taskNotes = strip(taskNotes)

    // CREATE NEW TASK - VALIDATION
    // check task name - if task name is emptyfield and duplicated
    // check task description - if there is task description/there is no task description
    // check task plan - if there is selected plan/there is no selected plan (check plan color - insert color if there is plan)
    // check task notes - if there is task notes/there is no task notes

    // check for empty task name
    if (validator.isEmpty(taskName)) {
      return resolve("emptyTaskName")
    }
    // if task name is not empty
    else {
      // check for duplicated task name
      const checkTaskName = `SELECT *
                           FROM task
                           WHERE Task_name = ?`
      con.query(checkTaskName, [taskName], function (err, rows) {
        if (err) throw err
        // if task name exists in database (duplicated task name)
        if (rows.length > 0) {
          return resolve("duplicatedTaskName")
        }
        // if task name does not exist in database (can use this task name)
        else {
          // check for empty task description
          if (validator.isEmpty(taskDescription)) {
            return resolve("emptyTaskDescription")
          }
          // if task description is not empty
          else {
            // check for empty task app acronym
            if (validator.isEmpty(taskAppAcronym)) {
              return resolve("emptyTaskAppAcronym")
            }

            // check for empty task plan
            // if task plan is empty, set its value as null
            if (taskPlan === "") {
              taskPlan = null
            }

            // check task plan color
            const getPlanColor = `SELECT plan.Plan_color 
                                  FROM plan
                                  WHERE Plan_MVP_name = ?
                                  AND Plan_app_Acronym = ?`
            con.query(getPlanColor, [taskPlan, taskAppAcronym], function (err, rows) {
              if (err) reject(err)
              // if there is a plan color (set database plan color value)
              if (rows.length > 0) {
                planColor = rows[0].Plan_color
              }
              // if there is no plan color (set default plan color value as light grey)
              else {
                planColor = ""
              }

              // check for existing task
              const checkTask = `SELECT * 
                                 FROM task 
                                 WHERE Task_app_Acronym = ?`
              con.query(checkTask, [taskAppAcronym], function (err, rows) {
                if (err) reject(err)
                // if task exists in database
                if (rows.length > 0) {
                  // get app rnumber
                  const getAppRNumber = `SELECT App_Rnumber
                                         FROM application
                                         WHERE App_Acronym = ?`

                  con.query(getAppRNumber, [taskAppAcronym], function (err, rows) {
                    if (err) reject(err)

                    if (rows.length > 0) {
                      // get latest app rnumber and create task id (app_acronym and app rnumber)
                      rNumber = rows[0].App_Rnumber + 1
                      taskID = taskAppAcronym + "_" + rNumber
                    } else {
                      return resolve("invalidTaskAppAcronym")
                    }

                    // check for added task notes
                    if (taskNotes) {
                      // format task notes with header (datetime, task state, task owner)
                      formattedTaskNotes = "[" + datetime + "\tTask State: " + taskState + "\t Task Owner: " + taskOwner + "]\n" + taskNotes + "\n"

                      // insert task with formatted task notes into task table
                      const addTask = `INSERT INTO task VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())`
                      con.query(
                        addTask,
                        [taskName, taskDescription, formattedTaskNotes, taskID, taskPlan, taskAppAcronym, taskState, taskCreator, taskOwner, planColor],
                        console.log("Created Task with task notes.")
                      )

                      // insert into task notes table
                      const addTaskNotes = `INSERT INTO tasknotes (Task_name, Task_plan, Task_app, Task_notes, Task_state, Task_owner, Task_updateDate) VALUES (?, ?, ?, ?, ?, ?, now())`
                      con.query(addTaskNotes, [taskName, taskPlan, taskAppAcronym, taskNotes, taskState, taskOwner], console.log("Added task notes."))

                      // update latest app rnumber in application table
                      const updateAppRNumber = `UPDATE application SET App_Rnumber = ? WHERE App_Acronym = ?`
                      con.query(updateAppRNumber, [rNumber, taskAppAcronym], console.log("Updated App rnumber."))
                    }

                    // if task notes is empty (user did not write anything)
                    else {
                      // insert task with formatted task notes into task table
                      const addTask = `INSERT INTO task VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())`
                      con.query(
                        addTask,
                        [taskName, taskDescription, taskNotes, taskID, taskPlan, taskAppAcronym, taskState, taskCreator, taskOwner, planColor],
                        console.log("Created Task with no task notes.")
                      )

                      // update latest app rnumber in application table
                      const updateAppRNumber = `UPDATE application SET App_Rnumber = ? WHERE App_Acronym = ?`
                      con.query(updateAppRNumber, [rNumber, taskAppAcronym], console.log("Updated App rnumber."))
                    }

                    // send to frontend
                    const taskInfo = {
                      taskName: taskName,
                      taskDescription: taskDescription,
                      taskNotes: taskNotes,
                      taskID: taskID,
                      taskPlan: taskPlan,
                      taskAppAcronym: taskAppAcronym,
                      taskState: taskState,
                      taskCreator: taskCreator,
                      taskOwner: taskOwner,
                      planColor: planColor
                    }

                    return resolve(taskInfo)
                  })
                }
                // if no task exists in database (first task)
                else {
                  // get app rnumber
                  const getAppRNumber = `SELECT App_Rnumber
                                         FROM application
                                         WHERE App_Acronym = ?`

                  con.query(getAppRNumber, [taskAppAcronym], function (err, rows) {
                    if (err) reject(err)

                    if (rows.length > 0) {
                      // get app rnumber and create task id (app_acronym and app rnumber)
                      rNumber = rows[0].App_Rnumber
                      taskID = taskAppAcronym + "_" + rNumber
                    } else {
                      return resolve("invalidTaskAppAcronym")
                    }

                    // check for added task notes
                    if (taskNotes) {
                      // format task notes with header (datetime, task state, task owner)
                      formattedTaskNotes = "[" + datetime + "\tTask State: " + taskState + "\t Task Owner: " + taskOwner + "]\n" + taskNotes + "\n"

                      // insert task with formatted task notes into task table
                      const addTask = `INSERT INTO task VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())`
                      con.query(
                        addTask,
                        [taskName, taskDescription, formattedTaskNotes, taskID, taskPlan, taskAppAcronym, taskState, taskCreator, taskOwner, planColor],
                        console.log("Created Task with task notes.")
                      )

                      // insert into task notes table
                      const addTaskNotes = `INSERT INTO tasknotes (Task_name, Task_plan, Task_app, Task_notes, Task_state, Task_owner, Task_updateDate) VALUES (?, ?, ?, ?, ?, ?, now())`
                      con.query(addTaskNotes, [taskName, taskPlan, taskAppAcronym, taskNotes, taskState, taskOwner], console.log("Added task notes."))
                    }

                    // if task notes is empty (user did not write anything)
                    else {
                      // insert task with formatted task notes into task table
                      const addTask = `INSERT INTO task VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())`
                      con.query(
                        addTask,
                        [taskName, taskDescription, taskNotes, taskID, taskPlan, taskAppAcronym, taskState, taskCreator, taskOwner, planColor],
                        console.log("Created Task with no task notes.")
                      )
                    }

                    // send to frontend
                    const taskInfo = {
                      taskName: taskName,
                      taskDescription: taskDescription,
                      taskNotes: taskNotes,
                      taskID: taskID,
                      taskPlan: taskPlan,
                      taskAppAcronym: taskAppAcronym,
                      taskState: taskState,
                      taskCreator: taskCreator,
                      taskOwner: taskOwner,
                      planColor: planColor
                    }

                    return resolve(taskInfo)
                  })
                }
              })
            })
          }
        }
      })
    }
  })
}

module.exports = { CreateTask }
