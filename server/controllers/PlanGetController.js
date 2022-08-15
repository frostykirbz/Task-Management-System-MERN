var con = require("../config/config-database")

// Get all plans
const getPlan = (req, res, next) => {
  const getPlan = `SELECT plan.Plan_MVP_name, plan.Plan_app_Acronym, date_format(plan.Plan_startDate, "%d-%m-%Y") AS startDate, date_format(plan.Plan_endDate, "%d-%m-%Y") AS endDate, plan.Plan_color, application.App_permit_Create
                   FROM plan, application
                   WHERE plan.Plan_app_Acronym = application.App_Acronym
                   AND plan.Plan_app_Acronym = '${req.params.id}'`

  con.query(getPlan, function (err, rows) {
    if (err) throw err
    res.send(rows)
    console.log(rows)
  })
}

module.exports = { getPlan }
