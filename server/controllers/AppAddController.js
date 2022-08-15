var con = require("../config/config-database")
var strip = require("strip")
var validator = require("validator")
var setMessage = require("../message")

const addApp = (req, res, next) => {
  let appAcronym = req.body.appAcronymAdd
  let appDescription = req.body.appDescriptionAdd
  let appRNumber = req.body.appRNumberAdd
  let appStartDate = req.body.appStartDateAdd
  let appEndDate = req.body.appEndDateAdd
  let appPermitCreate = req.body.appPermitCreateAdd
  let appPermitOpen = req.body.appPermitOpenAdd
  let appPermitToDo = req.body.appPermitToDoAdd
  let appPermitDoing = req.body.appPermitDoingAdd
  let appPermitDone = req.body.appPermitDoneAdd

  console.log("create" + appPermitCreate)
  // remove all leading and trailing spaces and tabs
  appAcronym = strip(appAcronym)
  appDescription = strip(appDescription)

  if (validator.isEmpty(appAcronym)) {
    console.log("Please enter application acronym.")
    return next(setMessage("Please enter application acronym.", req, res))
  } else {
    const checkAppAcronym = `SELECT *
                             FROM application
                             WHERE App_Acronym = ?`
    con.query(checkAppAcronym, [appAcronym], function (err, rows) {
      if (err) console.log(err)
      if (rows.length > 0) {
        console.log("This application acronym exists, please use another acronym.")
        return next(setMessage("This application acronym exists, please use another acronym.", req, res))
      } else {
        if (appRNumber == "") {
          console.log("Please enter application running number.")
          return next(setMessage("Please enter application running number.", req, res))
        } else {
          if (appDescription === "") {
            console.log("Please enter application description.")
            return next(setMessage("Please enter application description.", req, res))
          } else {
            if (appPermitCreate == "") {
              console.log("Please enter Permit Create.")
              return next(setMessage("Please enter Permit Create.", req, res))
            } else {
              if (appStartDate == "") {
                appStartDate = null
              }

              if (appEndDate == "") {
                appEndDate = null
              }

              const addApp = `INSERT INTO application VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())`

              con.query(addApp, [appAcronym, appDescription, appRNumber, appStartDate, appEndDate, appPermitCreate, appPermitOpen, appPermitToDo, appPermitDoing, appPermitDone], function (err, rows) {
                if (err) throw err

                console.log("Application " + appAcronym + " is created successfully.")
              })
            }

            const appInfo = {
              appAcronym: appAcronym
            }

            res.send(appInfo)
          }
        }
      }
    })
  }
}

module.exports = { addApp }
