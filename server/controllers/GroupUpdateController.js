var con = require("../config/config-database")
var validator = require("validator")
var setMessage = require("../message")
var strip = require("strip")

// Edit group
// Frontend: AdminGroupEdit.js [Axios.get("/api/admin/group/update/:id")]
const editGroup = (req, res, next) => {
  let description = ""
  let isactive = ""

  let updatedGroupname = req.body.group
  let updatedDescription = req.body.description
  let updatedIsActive = req.body.isactive

  const getGroup = `SELECT * FROM usergroup WHERE groupname = ?`
  con.query(getGroup, [updatedGroupname], function (err, rows) {
    if (rows.length > 0) {
      description = rows[0].description
      isactive = rows[0].isactive
    }

    if (description == "") updatedDescription = description
    if (isactive == "") updatedIsActive = isactive

    const groupCheck = `UPDATE usergroup SET description = ?, isactive = ? WHERE groupname = ?`

    con.query(groupCheck, [updatedDescription, updatedIsActive, updatedGroupname], function (err, rows) {
      if (rows.length > 0) {
        console.log("Group is updated in usergroup.")
      }
    })

    // if group is active/inactive
    // set all users in this group in accountsgroup active/inactive
    const updateUserGroup = `UPDATE accountsgroup SET isactive = ? WHERE groupname = ?`
    con.query(updateUserGroup, [updatedIsActive, updatedGroupname], function (err, rows) {
      if (rows.length > 0) {
        console.log("Group is updated in accountsgroup.")
      }
    })
  })

  const groupInfo = {
    group: updatedGroupname
  }

  res.send(groupInfo)
}

module.exports = { editGroup }
