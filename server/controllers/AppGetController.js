var con = require("../config/config-database")

// Get all applications
const getApp = (req, res, next) => {
  const getApplication = `SELECT *, date_format(App_startDate, "%d-%m-%Y") AS startDate, date_format(App_endDate, "%d-%m-%Y") AS endDate
                          FROM application`

  con.query(getApplication, function (err, rows) {
    if (err) throw err
    if (rows.length > 0) {
      res.send(rows)
    }
  })
}

// Get application (view)
const viewApp = (req, res, next) => {
  let app = req.body.app

  const getAppData = `SELECT *, date_format(App_startDate, "%d-%m-%Y") AS startDate, date_format(App_endDate, "%d-%m-%Y") AS endDate
                      FROM application
                      WHERE App_Acronym = ?`

  con.query(getAppData, [app], function (err, rows) {
    if (err) throw err
    if (rows.length > 0) {
      const appInfo = {
        appName: rows[0].App_Acronym,
        appDescription: rows[0].App_Description,
        appRNumber: rows[0].App_Rnumber,
        appStartDate: rows[0].startDate,
        appEndDate: rows[0].endDate,
        appPermitCreate: rows[0].App_permit_Create,
        appPermitOpen: rows[0].App_permit_Open,
        appPermitToDo: rows[0].App_permit_toDoList,
        appPermitDoing: rows[0].App_permit_Doing,
        appPermitDone: rows[0].App_permit_Done
      }

      res.send(appInfo)
      console.log(appInfo)
    }
  })
}

// Get application (edit)
const getEditApp = (req, res, next) => {
  let app = req.body.app
  const getAppData = `SELECT *, date_format(App_startDate, "%Y-%m-%d") AS startDate, date_format(App_endDate, "%Y-%m-%d") AS endDate
                      FROM application
                      WHERE App_Acronym = ?`

  con.query(getAppData, [app], function (err, rows) {
    if (err) throw err
    if (rows.length > 0) {
      const appInfo = {
        appName: rows[0].App_Acronym,
        appDescription: rows[0].App_Description,
        appRNumber: rows[0].App_Rnumber,
        appStartDate: rows[0].startDate,
        appEndDate: rows[0].endDate,
        appPermitCreate: rows[0].App_permit_Create,
        appPermitOpen: rows[0].App_permit_Open,
        appPermitToDo: rows[0].App_permit_toDoList,
        appPermitDoing: rows[0].App_permit_Doing,
        appPermitDone: rows[0].App_permit_Done
      }

      res.send(appInfo)
      console.log(appInfo)
    }
  })
}

// Get one application
const getDashboardApp = (req, res, next) => {
  const getApplication = `SELECT *, date_format(App_startDate, "%d-%m-%Y") AS startDate, date_format(App_endDate, "%d-%m-%Y") AS endDate
                          FROM application
                          WHERE App_Acronym = '${req.params.id}'`

  con.query(getApplication, function (err, rows) {
    if (err) throw err
    if (rows.length > 0) {
      res.send(rows)
    }
  })
}

module.exports = { getApp, viewApp, getEditApp, getDashboardApp }
