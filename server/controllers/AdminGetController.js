var con = require("../config/config-database")

// Display all users in table
// Frontend: AdminUserHome.js [Axios.get("/api/admin/user")]
const getUsers = (req, res, next) => {
  const getGroup = `SELECT username, email, isactive, usergroup
                    FROM accounts`

  con.query(getGroup, function (err, rows) {
    if (err) throw err
    res.send(rows)
  })
}

// Get one user details (Edit one user)
// Frontend: AdminUserEdit.js  [Axios.get("/api/admin/user/:id")]
const getUserUpdate = (req, res, next) => {
  const getUserData = `SELECT username, email, isactive, usergroup
                       FROM accounts
                       WHERE username = '${req.params.id}'`

  con.query(getUserData, function (err, rows) {
    const userInfo = {
      username: rows[0].username,
      email: rows[0].email,
      isactive: rows[0].isactive,
      usergroup: rows[0].usergroup
    }
    res.send(userInfo)
  })
}

// Get existing groups that user is in (Display user current group before editing)
// Frontend: AdminUserEdit.js  [Axios.get("/api/admin/user/group/:id")]
const getUserGroup = (req, res, next) => {
  let getGroupArray = []
  let userGroupArray = []

  const getGroupData = `SELECT usergroup
                          FROM accounts
                          WHERE username = '${req.params.id}'`

  con.query(getGroupData, function (err, rows) {
    if (rows.length > 0) {
      getGroupArray = rows[0].usergroup.split(",")
      for (var i = 0; i < getGroupArray.length; i++) {
        userGroupArray.push({ label: getGroupArray[i], value: getGroupArray[i] })
      }
    }
    res.send(userGroupArray)
  })
}

module.exports = { getUsers, getUserUpdate, getUserGroup }
