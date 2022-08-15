var con = require("../config/config-database")
var validator = require("validator")
var setMessage = require("../message")
var strip = require("strip")

// add new group
// Frontend: AdminGroupAdd.js  [Axios.get("/api/admin/group/add")]
const addGroup = (req, res, next) => {
  app.post("/admin/group/add", function (req, res, next) {
    let groupname = req.body.group
    let description = req.body.description

    groupname = strip(groupname)
    description = strip(description)

    if (validator.isEmpty(groupname)) {
      console.log("Please enter group.")
      return next(setMessage("Please enter group.", req, res))
    } else {
      const groupCheck = `SELECT * FROM usergroup WHERE groupname = ?`

      con.query(groupCheck, [groupname], function (err, rows) {
        if (rows.length > 0) {
          console.log("This group exists, please use another group.")
          return next(setMessage("This group exists, please use another group.", req, res))
        } else {
          const insertGroup = `INSERT INTO usergroup (groupname, description, isactive) VALUES (?, ?, ?)`

          con.query(insertGroup, [groupname, description, "Active"], function (err, rows) {
            if (rows.length > 0) {
              console.log("Group has been created successfully.")
            }
          })

          const groupInfo = {
            group: groupname
          }

          res.send(groupInfo)
          console.log(groupInfo)
        }
      })
    }
  })
}

module.exports = { addGroup }
