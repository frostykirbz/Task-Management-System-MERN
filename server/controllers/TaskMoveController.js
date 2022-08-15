var con = require("../config/config-database")

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
                 AND Task_app_Acronym = ?`

const addTaskNotes = `INSERT INTO tasknotes (Task_name, Task_plan, Task_app, Task_notes, Task_state, Task_owner, Task_updateDate) VALUES (?, ?, ?, ?, ?, ?, now())`

const updateTask = `UPDATE task SET Task_notes = ?, Task_state = ?, Task_owner = ? WHERE Task_name = ? AND Task_app_Acronym = ?`

const handleMoveState = (req, res, next) => {
  let taskName = req.body.taskName
  let taskPlan = req.body.taskPlan
  let taskApp = req.body.taskApp
  let taskState = req.body.taskState
  let taskOwner = req.body.taskOwner
  let taskNotes = ""
  let updatedTaskNotes = ""
  let previousTaskState = ""
  let formattedTaskNotes = ""
  let notesArray = []

  // check for task notes
  con.query(getTask, [taskName, taskApp], function (err, rows) {
    // if task exists in database
    if (rows.length > 0) {
      taskNotes = rows[0].Task_notes
      previousTaskState = rows[0].Task_state

      // if task notes is empty
      if (taskNotes === "") {
        // tasknotes
        updatedTaskNotes = taskOwner + " has moved task from " + previousTaskState + " state to " + taskState + " state."

        // insert into tasknotes
        con.query(addTaskNotes, [taskName, taskPlan, taskApp, updatedTaskNotes, taskState, taskOwner], console.log("Added Task Notes."))

        // format task notes with header (datetime, task state, task owner)
        formattedTaskNotes = "[" + datetime + "\tTask State: " + taskState + "\t Task Owner: " + taskOwner + "]\n" + updatedTaskNotes + "\n"

        // update tasknotes in task
        con.query(updateTask, [formattedTaskNotes, taskState, taskOwner, taskName, taskApp], console.log("Updated task notes."))
      }
      // if task notes is not empty
      else {
        // tasknotes
        updatedTaskNotes = taskOwner + " has moved task from " + previousTaskState + " state to " + taskState + " state."

        // insert into tasknotes
        con.query(addTaskNotes, [taskName, taskPlan, taskApp, updatedTaskNotes, taskState, taskOwner], console.log("Added Task Notes."))

        con.query(getTaskNotes, [taskName, taskApp], function (err, rows) {
          // if task notes exist in database
          if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
              formattedTaskNotes =
                "[" + rows[i].updatedate + " " + rows[i].updatetime + "\tTask State: " + rows[i].Task_state + "\t Task Owner: " + rows[i].Task_owner + "]\n" + rows[i].Task_notes + "\n"
              notesArray.push(formattedTaskNotes)
            }

            formattedTaskNotes = notesArray.join("\n")

            // update tasknotes in task
            con.query(updateTask, [formattedTaskNotes, taskState, taskOwner, taskName, taskApp], console.log("Updated task notes."))
          }
          // if task notes does not exist in database
          else {
            // format task notes with header (datetime, task state, task owner)
            formattedTaskNotes = "[" + datetime + "\tTask State: " + taskState + "\t Task Owner: " + taskOwner + "]\n" + updatedTaskNotes + "\n"

            // update tasknotes in task
            con.query(updateTask, [formattedTaskNotes, taskState, taskOwner, taskName, taskApp], console.log("Updated task notes."))
          }
        })
      }

      res.send("Task is moved to another state.")
    }
  })
}

module.exports = { handleMoveState }
