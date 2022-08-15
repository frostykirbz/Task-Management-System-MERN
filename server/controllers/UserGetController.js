var con = require("../config/config-database")

// Display user details after login
// Frontend: AdminHome.js/UserHome.js [Axios.post("/api/user/details", { username })]
const getUserDetails = (req, res, next) => {
  const username = req.body.username
  const getUser = `SELECT username, usergroup, email
                   FROM accounts
                   WHERE username = ?`

  con.query(getUser, [username], function (err, rows) {
    if (err) throw err
    console.log(rows)
    res.send(rows)
  })
}

module.exports = { getUserDetails }
