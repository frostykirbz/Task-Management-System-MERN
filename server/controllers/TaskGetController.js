var con = require("../config/config-database")

// Get Task
const getTask = (req, res, next) => {
  const getTask = `SELECT task.Task_name, task.Task_description, task.Task_notes, task.Task_id, task.Task_plan, task.Task_app_Acronym, task.Task_state, task.Task_creator, task.Task_owner, task.Task_plan_color, application.App_permit_Create, application.App_permit_Open, application.App_permit_toDoList, application.App_permit_Doing, application.App_permit_Done
                   FROM task, application
                   WHERE task.Task_app_Acronym = application.App_Acronym
                   AND Task_app_Acronym = '${req.params.id}'`

  con.query(getTask, function (err, rows) {
    if (err) throw err
    res.send(rows)
  })
}

// Get Task for update (individual)
const getOneTask = (req, res, next) => {
  let plan = req.body.plan
  let task = req.body.task

  const getTask = `SELECT *
                   FROM task
                   WHERE Task_app_Acronym = '${req.params.id}'
                   AND Task_plan = ?
                   AND Task_name = ?`

  con.query(getTask, [plan, task], function (err, rows) {
    if (err) throw err

    if (rows.length > 0) {
      const taskInfo = {
        taskName: rows[0].Task_name,
        taskDescription: rows[0].Task_description,
        taskNotes: rows[0].Task_notes,
        taskPlan: rows[0].Task_plan,
        taskApp: rows[0].Task_app_Acronym,
        taskState: rows[0].Task_state,
        taskCreator: rows[0].Task_creator,
        taskOwner: rows[0].Task_owner
      }
      res.send(taskInfo)
    }
  })
}

// Get Task for update (individual)
const getUpdatedTask = (req, res, next) => {
  let task = req.body.task

  const getTask = `SELECT *
                   FROM task
                   WHERE Task_app_Acronym = '${req.params.id}'
                   AND Task_name = ?`

  con.query(getTask, [task], function (err, rows) {
    if (err) throw err

    if (rows.length > 0) {
      const taskInfo = {
        taskName: rows[0].Task_name,
        taskPlan: rows[0].Task_plan,
        taskDescription: rows[0].Task_description,
        taskNotes: rows[0].Task_notes,
        taskPlan: rows[0].Task_plan,
        taskApp: rows[0].Task_app_Acronym,
        taskState: rows[0].Task_state,
        taskCreator: rows[0].Task_creator,
        taskOwner: rows[0].Task_owner
      }
      res.send(taskInfo)
    }
  })
}

// Get Task for update (individual)
const getUpdatedTaskPlan = (req, res, next) => {
  let task = req.body.taskEdit

  const getTask = `SELECT *
                   FROM task
                   WHERE Task_app_Acronym = '${req.params.id}'
                   AND Task_name = ?`

  con.query(getTask, [task], function (err, rows) {
    if (err) throw err

    if (rows.length > 0) {
      const taskInfo = {
        taskName: rows[0].Task_name,
        taskPlan: rows[0].Task_plan,
        taskDescription: rows[0].Task_description,
        taskNotes: rows[0].Task_notes,
        taskPlan: rows[0].Task_plan,
        taskApp: rows[0].Task_app_Acronym,
        taskState: rows[0].Task_state,
        taskCreator: rows[0].Task_creator,
        taskOwner: rows[0].Task_owner
      }
      res.send(taskInfo)
    }
  })
}

// Get Task for view (individual)
const viewTask = (req, res, next) => {
  let task = req.body.task

  const getTask = `SELECT *
                   FROM task
                   WHERE Task_app_Acronym = '${req.params.id}'
                   AND Task_name = ?`

  con.query(getTask, [task], function (err, rows) {
    if (err) throw err

    if (rows.length > 0) {
      const taskInfo = {
        taskName: rows[0].Task_name,
        taskPlan: rows[0].Task_plan,
        taskDescription: rows[0].Task_description,
        taskNotes: rows[0].Task_notes,
        taskPlan: rows[0].Task_plan,
        taskApp: rows[0].Task_app_Acronym,
        taskState: rows[0].Task_state,
        taskCreator: rows[0].Task_creator,
        taskOwner: rows[0].Task_owner
      }
      res.send(taskInfo)
    }
  })
}

module.exports = { getTask, getOneTask, getUpdatedTask, getUpdatedTaskPlan, viewTask }
