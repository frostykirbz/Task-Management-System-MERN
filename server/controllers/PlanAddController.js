var con = require("../config/config-database")
var strip = require("strip")
var validator = require("validator")
var setMessage = require("../message")

// add new plan
const addPlan = (req, res, next) => {
  let planMVPName = req.body.planMVPName
  let planStartDate = req.body.planStartDate
  let planEndDate = req.body.planEndDate
  let planAppAcronym = req.body.id
  let planColor = req.body.color
  let colorArray = []
  let checkColor = false

  // remove all leading and trailing spaces and tabs
  planMVPName = strip(planMVPName)

  // CREATE NEW PLAN - VALIDATION
  // check plan name
  if (validator.isEmpty(planMVPName)) {
    console.log("Please enter plan MVP name.")
    return next(setMessage("Please enter plan MVP name.", req, res))
  } else {
    const checkPlanMVPName = `SELECT *
                              FROM plan
                              WHERE Plan_MVP_name = ?`
    con.query(checkPlanMVPName, [planMVPName], function (err, rows) {
      if (err) console.log(err)
      if (rows.length > 0) {
        console.log("This plan MVP name exists, please use another plan MVP name.")
        return next(setMessage("This plan MVP name exists, please use another plan MVP name.", req, res))
      } else {
        if (planStartDate == "") {
          console.log("Please enter start date.")
          return next(setMessage("Please enter start date.", req, res))
        }

        if (planEndDate == "") {
          console.log("Please enter end date.")
          return next(setMessage("Please enter end date.", req, res))
        }

        const checkPlanColor = `SELECT Plan_color
                                FROM plan`

        const addPlan = `INSERT INTO plan VALUES (?, ?, ?, ?, ?, now())`

        con.query(checkPlanColor, function (err, rows) {
          // there is existing plan color in plan
          if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
              colorArray.push(rows[i].Plan_color)
            }

            console.log(colorArray)
            checkColor = colorArray.includes(planColor)
            if (checkColor) {
              console.log("This plan color exists, please use another plan color.")
              return next(setMessage("This plan color exists, please use another plan color.", req, res))
            } else {
              con.query(addPlan, [planMVPName, planStartDate, planEndDate, planAppAcronym, planColor], function (err, rows) {
                if (err) throw err

                console.log("Plan " + planMVPName + " is created successfully.")

                const planInfo = {
                  planMVPName: planMVPName
                }

                res.send(planInfo)
              })
            }
          }
          // there is no plan color in plan (first plan color)
          else {
            con.query(addPlan, [planMVPName, planStartDate, planEndDate, planAppAcronym, planColor], function (err, rows) {
              if (err) throw err

              console.log("Plan " + planMVPName + " is created successfully.")

              const planInfo = {
                planMVPName: planMVPName
              }

              res.send(planInfo)
            })
          }
        })
      }
    })
  }
}

module.exports = { addPlan }
