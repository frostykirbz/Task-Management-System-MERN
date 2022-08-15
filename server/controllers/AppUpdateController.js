var con = require("../config/config-database")
var validator = require("validator")
var setMessage = require("../message")
var strip = require("strip")
const e = require("express")

// Edit group
// Frontend: AdminGroupEdit.js [Axios.get("/api/admin/group/update/:id")]
const editApp = (req, res, next) => {
  let appAcronym = req.body.appAcronymEdit
  let updatedAppDescription = req.body.appDescriptionEdit
  let updatedAppStartDate = req.body.appStartDateEdit
  let updatedAppEndDate = req.body.appEndDateEdit
  let appPermitCreate = req.body.appPermitCreateEdit
  let updatedAppPermitCreate = req.body.updatedAppPermitCreate
  let updatedAppPermitOpen = req.body.updatedAppPermitOpen
  let updatedAppPermitToDo = req.body.updatedAppPermitToDo
  let updatedAppPermitDoing = req.body.updatedAppPermitDoing
  let updatedAppPermitDone = req.body.updatedAppPermitDone
  console.log(req.body)

  // remove all leading and trailing spaces and tabs
  updatedAppDescription = strip(updatedAppDescription)

  // UPDATE APP - VALIDATION
  // check permit create - if there is permit create/there is no permit create
  // check start date/end date - if there is no date (null)

  // check for dates
  // if start date is empty, set null
  // if start date is not empty, set start date
  if (updatedAppStartDate === "") {
    updatedAppStartDate = null
  }

  // // // if end date is empty, set null
  // // // if end date is not empty, set end date
  if (updatedAppEndDate === "") {
    updatedAppEndDate = null
  }

  // // check for permits
  // // if permit create is empty, set null
  // // if permit create is not empty, set select's value\
  if (updatedAppPermitCreate !== null) {
    updatedAppPermitCreate = updatedAppPermitCreate.value
  } else {
    console.log("Please enter permit create.")
    return next(setMessage("Please enter permit create.", req, res))
  }

  // if permit open is empty, set null
  // if permit open is not empty, set select's value
  if (updatedAppPermitOpen !== null) {
    updatedAppPermitOpen = updatedAppPermitOpen.value
  } else {
    updatedAppPermitOpen = null
  }

  // if permit todo is empty, set null
  // if permit todo is not empty, set select's value
  if (updatedAppPermitToDo !== null) {
    updatedAppPermitToDo = updatedAppPermitToDo.value
  } else {
    updatedAppPermitToDo = null
  }

  // if permit doing is empty, set null
  // if permit doing is not empty, set select's value
  if (updatedAppPermitDoing !== null) {
    updatedAppPermitDoing = updatedAppPermitDoing.value
  } else {
    updatedAppPermitDoing = null
  }

  // if permit done is empty, set null
  // if permit done is not empty, set select's value
  if (updatedAppPermitDone !== null) {
    updatedAppPermitDone = updatedAppPermitDone.value
  } else {
    updatedAppPermitDone = null
  }

  const updateApp = `UPDATE application SET App_Description = ?, App_startDate = ?, App_endDate = ?, App_permit_Create = ?, App_permit_Open = ?, App_permit_toDoList = ?, App_permit_Doing = ?, App_permit_Done = ? WHERE App_Acronym = ?`
  con.query(
    updateApp,
    [updatedAppDescription, updatedAppStartDate, updatedAppEndDate, updatedAppPermitCreate, updatedAppPermitOpen, updatedAppPermitToDo, updatedAppPermitDoing, updatedAppPermitDone, appAcronym],
    function (err, rows) {
      console.log(appAcronym + " is updated successfully.")

      const appInfo = {
        appAcronym: appAcronym
      }

      res.send(appInfo)
    }
  )
}

module.exports = { editApp }
