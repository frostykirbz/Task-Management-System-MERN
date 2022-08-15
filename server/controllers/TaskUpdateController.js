var con = require("../config/config-database")
var strip = require("strip")

// Edit task (with/without plan)
const editTask = (req, res, next) => {
  let taskName = req.body.taskEdit
  let taskPlan = req.body.updatedTaskPlanEdit
  let taskApp = req.params.id
  let taskState = req.body.taskStateEdit
  let taskOwner = req.body.taskOwner
  let taskDescription = ""
  let taskNotes = ""
  let updatedTaskDescription = req.body.taskDescriptionEdit
  let updatedTaskNotes = req.body.taskNotesUpdated
  let planColor = ""
  let formattedTaskNotes = ""
  let notesArray = []

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
  taskDescription = strip(taskDescription)
  taskNotes = strip(taskNotes)

  // UPDATE TASK - VALIDATION
  // check task description - if there is task description/there is no task description
  // check task plan - if there is selected plan (check plan color - update color based on selected plan [if plan is empty, update plan color to empty string])
  // check task notes - if there is task notes (insert in tasknotes table and update tasknotes in task table)/there is no task notes (dont need insert in tasknotes table and update tasknotes in task table)

  // check for task plan
  // if task plan is empty, set null
  // if task plan is not empty, set select's value
  if (taskPlan !== null) {
    taskPlan = taskPlan.value
  } else {
    taskPlan = null
  }

  // get previous value for task description and task notes
  const getTaskData = `SELECT Task_description, Task_notes 
                       FROM task
                       WHERE Task_name = ?
                       AND Task_app_Acronym = ?`

  con.query(getTaskData, [taskName, taskApp], function (err, rows) {
    // if there is existing data for task
    if (rows.length > 0) {
      taskDescription = rows[0].Task_description
      taskNotes = rows[0].Task_notes
    }

    // check for task description
    // if task description is empty, set previous task description
    // if task description is not empty, set updated task description
    if (updatedTaskDescription === "") {
      updatedTaskDescription = taskDescription
    }

    // check task plan color
    const getPlanColor = `SELECT plan.Plan_color 
                          FROM plan
                          WHERE Plan_MVP_name = ?
                          AND Plan_app_Acronym = ?`
    con.query(getPlanColor, [taskPlan, taskApp], function (err, rows) {
      if (err) throw err
      // if there is a plan color (set database plan color value)
      if (rows.length > 0) {
        planColor = rows[0].Plan_color
      }
      // if there is no plan color (set default plan color as light grey)
      else {
        planColor = ""
      }

      // check for updated task notes
      if (updatedTaskNotes) {
        // insert into task notes
        const addTaskNotes = `INSERT INTO tasknotes (Task_name, Task_plan, Task_app, Task_notes, Task_updatedate, Task_state, Task_owner) VALUES (?, ?, ?, ?, now(), ?, ?)`

        con.query(addTaskNotes, [taskName, taskPlan, taskApp, updatedTaskNotes, taskState, taskOwner], console.log("Added Task Notes."))

        // get existing task notes based on task
        const getTaskNotes = `SELECT Task_notes, DATE_FORMAT(Task_updateDate, "%d-%m-%Y") AS updatedate, TIME_FORMAT(Task_updateDate, "%H:%i:%s") AS updatetime, Task_state, Task_owner
                              FROM tasknotes
                              WHERE Task_name = ?
                              AND Task_app = ?       
                              ORDER BY Task_updateDate DESC`
        con.query(getTaskNotes, [taskName, taskApp], function (err, rows) {
          // if task notes exist in database
          if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
              formattedTaskNotes =
                "[" + rows[i].updatedate + " " + rows[i].updatetime + "\tTask State: " + rows[i].Task_state + "\t Task Owner: " + rows[i].Task_owner + "]\n" + rows[i].Task_notes + "\n"
              notesArray.push(formattedTaskNotes)
            }

            formattedTaskNotes = notesArray.join("\n")

            // update all editable fields in task
            const updateTaskNotes = `UPDATE task SET Task_description = ?, Task_notes = ?, Task_plan = ?, Task_owner = ?, Task_plan_color = ? WHERE Task_name = ? AND Task_app_Acronym = ?`
            con.query(updateTaskNotes, [updatedTaskDescription, formattedTaskNotes, taskPlan, taskOwner, planColor, taskName, taskApp], console.log("updated notes with new notes!"))
          }
          // if task notes does not exist in database (first task notes)
          else {
            // format task notes with header (datetime, task state, task owner)
            formattedTaskNotes = "[" + datetime + "\tTask State: " + taskState + "\t Task Owner: " + taskOwner + "]\n" + updatedTaskNotes + "\n"

            // update all editable fields in task
            const updateTaskNotes = `UPDATE task SET Task_description = ?, Task_notes = ?, Task_plan = ?, Task_owner = ?, Task_plan_color = ? WHERE Task_name = ? AND Task_app_Acronym = ?`
            con.query(updateTaskNotes, [updatedTaskDescription, formattedTaskNotes, taskPlan, taskOwner, planColor, taskName, taskApp], console.log("updated notes without existing task notes!"))
          }
        })

        // send to frontend
        const taskInfo = {
          taskName: taskName
        }

        res.send(taskInfo)
      }
      // if updated task notes is empty
      else {
        // set previous task notes
        updatedTaskNotes = taskNotes

        // get existing task notes based on task
        const getTaskNotes = `SELECT Task_notes, DATE_FORMAT(Task_updateDate, "%d-%m-%Y") AS updatedate, TIME_FORMAT(Task_updateDate, "%H:%i:%s") AS updatetime, Task_state, Task_owner
                              FROM tasknotes
                              WHERE Task_name = ?
                              AND Task_app = ?       
                              ORDER BY Task_updateDate DESC`
        con.query(getTaskNotes, [taskName, taskApp], function (err, rows) {
          // if task notes exist in database
          if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
              formattedTaskNotes =
                "[" + rows[i].updatedate + " " + rows[i].updatetime + "\tTask State: " + rows[i].Task_state + "\t Task Owner: " + rows[i].Task_owner + "]\n" + rows[i].Task_notes + "\n"
              notesArray.push(formattedTaskNotes)
            }

            formattedTaskNotes = notesArray.join("\n")

            // update all editable fields in task
            const updateTaskNotes = `UPDATE task SET Task_description = ?, Task_notes = ?, Task_plan = ?, Task_plan_color = ? WHERE Task_name = ? AND Task_app_Acronym = ?`
            con.query(updateTaskNotes, [updatedTaskDescription, formattedTaskNotes, taskPlan, planColor, taskName, taskApp], console.log("updated notes with existing task notes!"))
          }
          // if task notes does not exist in database
          else {
            // format task notes with header (datetime, task state, task owner)
            formattedTaskNotes = "[" + datetime + "\tTask State: " + taskState + "\t Task Owner: " + taskOwner + "]\n" + updatedTaskNotes + "\n"

            // update all editable fields in task
            const updateTaskNotes = `UPDATE task SET Task_description = ?, Task_notes = ?, Task_plan = ?, Task_plan_color = ? WHERE Task_name = ? AND Task_app_Acronym = ?`
            con.query(updateTaskNotes, [updatedTaskDescription, updatedTaskNotes, taskPlan, planColor, taskName, taskApp], console.log("updated notes without existing task notes!"))
          }
        })

        // send to frontend
        const taskInfo = {
          taskName: taskName
        }

        res.send(taskInfo)
      }
    })
  })
}

module.exports = { editTask }
