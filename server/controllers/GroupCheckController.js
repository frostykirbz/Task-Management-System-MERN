var con = require("../config/config-database")

function checkGroup({ username, groupname }) {
  return new Promise((resolve, reject) => {
    const groupcheck = `SELECT *
                        FROM accounts
                        WHERE username = ?`

    con.query(groupcheck, [username], function (err, rows) {
      if (err) reject(err)
      if (rows.length > 0) {
        if (rows[0].usergroup.includes(groupname)) {
          return resolve(true)
        }
      }
      return resolve(false)
    })
  })
}

// check user group
const checkUserGroup = (req, res, next) => {
  const username = req.body.username
  const getUser = `SELECT *
                   FROM accounts
                   WHERE username = ?`

  con.query(getUser, [username], function (err, rows) {
    if (err) throw err
    console.log(JSON.stringify(rows[0].usergroup))
    res.send(JSON.stringify(rows[0].usergroup))
  })
}

module.exports = { checkGroup, checkUserGroup }
