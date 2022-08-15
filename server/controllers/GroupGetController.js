var con = require("../config/config-database")

// Get all groups
// Frontend: AdminGroupHome.js/AdminUserEdit.js  [Axios.get("/api/group")]
const getGroup = (req, res, next) => {
  const getUserGroup = `SELECT *
                        FROM usergroup`

  con.query(getUserGroup, function (err, rows) {
    if (err) throw err
    res.send(rows)
  })
}

// Get usercount details (based on one group)
// app.get("/admin-group-usercount:id", function (req, res) {
//   const getUserCount = `SELECT COUNT(*) as usercount
//                         FROM accountsgroup
//                         WHERE accountsgroup.groupname = '${req.params.id}'`

//   con.query(getUserCount, function (err, rows) {
//     console.log(rows)
//   })
// })
// }

module.exports = { getGroup }
