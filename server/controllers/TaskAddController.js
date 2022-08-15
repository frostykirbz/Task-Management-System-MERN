var con = require("../config/config-database")
var strip = require("strip")
var validator = require("validator")
var setMessage = require("../message")

// add new task (with plan)
const addTask = (req, res, next) => {
  let taskName = req.body.taskAdd
  let taskDescription = req.body.taskDescriptionAdd
  let taskNotes = req.body.taskNotesAdd
  let taskPlan = req.body.taskPlanAdd
  let taskAppAcronym = req.body.id
  let taskState = req.body.taskStateAdd
  let taskCreator = req.body.taskCreatorAdd
  let taskOwner = req.body.taskOwnerAdd
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
  // check plan color - insert color based on plan
  // check task notes - if there is task notes/there is no task notes

  // check for empty task name
  if (validator.isEmpty(taskName)) {
    console.log("Please enter task name.")
    return next(setMessage("Please enter task name.", req, res))
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
        console.log("This task name exists, please use another task name.")
        return next(setMessage("This task name exists, please use another task name.", req, res))
      }
      // if task name does not exist in database (can use this task name)
      else {
        // check for empty task description
        if (validator.isEmpty(taskDescription)) {
          console.log("Please enter task description.")
          return next(setMessage("Please enter task description.", req, res))
        }
        // if task description is not empty
        else {
          // check task plan color
          const getPlanColor = `SELECT plan.Plan_color 
                                FROM plan
                                WHERE Plan_MVP_name = ?
                                AND Plan_app_Acronym = ?`
          con.query(getPlanColor, [taskPlan, taskAppAcronym], function (err, rows) {
            if (err) throw err
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
              if (err) throw err
              // if task exists in database
              if (rows.length > 0) {
                // get app rnumber
                const getAppRNumber = `SELECT App_Rnumber
                                       FROM application
                                       WHERE App_Acronym = ?`

                con.query(getAppRNumber, [taskAppAcronym], function (err, rows) {
                  // get latest app rnumber and create task id (app_acronym and app rnumber)
                  rNumber = rows[0].App_Rnumber + 1
                  taskID = taskAppAcronym + "_" + rNumber

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
                    taskName: taskName
                  }

                  res.send(taskInfo)
                })
              }
              // if no task exists in database (first task)
              else {
                // get app rnumber
                const getAppRNumber = `SELECT App_Rnumber
                                       FROM application
                                       WHERE App_Acronym = ?`

                con.query(getAppRNumber, [taskAppAcronym], function (err, rows) {
                  // get app rnumber and create task id (app_acronym and app rnumber)
                  rNumber = rows[0].App_Rnumber
                  taskID = taskAppAcronym + "_" + rNumber

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
                    const addTaskNotes =  `INSERT INTO tasknotes (Task_name, Task_plan, Task_app, Task_notes, Task_state, Task_owner, Task_updateDate) VALUES (?, ?, ?, ?, ?, ?, now())`
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
                    taskName: taskName
                  }

                  res.send(taskInfo)
                })
              }
            })
          })
        }
      }
    })
  }
}

module.exports = { addTask }
