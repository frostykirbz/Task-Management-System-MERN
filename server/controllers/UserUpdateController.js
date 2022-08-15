var con = require("../config/config-database")
var bcrypt = require("bcrypt")
var validator = require("validator")
var setMessage = require("../message")

// get the elements of one array which are not present in another array
function checkArrayDiff(array1, array2) {
  var elements = array1.filter(f => !array2.includes(f))
  return elements
}

function checkArray(array1, array2) {
  var elements = array1.filter(f => array2.includes(f))
  return elements
}

// Edit user
// Frontend: UserEdit.js [Axios.get("/api/user/update")]
const editUser = (req, res, next) => {
  let password = ""
  let email = ""

  let username = req.body.username
  let updatedPassword = req.body.password
  let updatedEmail = req.body.email

  console.log("HERE")

  console.log(updatedPassword)
  console.log(updatedEmail)
  // hash password information
  const saltRounds = 10

  // Check user details (Table: accounts)
  // data details: password / email / role (Admin/User) / isactive (Active/Inactive)
  const checkAccounts = `SELECT password, email
                         FROM accounts
                         WHERE username = ?`

  con.query(checkAccounts, [username], function (err, rows) {
    if (err) throw err

    if (rows.length > 0) {
      password = rows[0].password
      email = rows[0].email
    }

    // If user did not update the rest of the fields
    // takes previous data and updates along with the new data
    if (updatedPassword == "") {
      updatedPassword = password
    } else if (updatedPassword.length < 8 || updatedPassword.length > 10) {
      console.log("Password must be in length of 8-10 characters.")
      return next(setMessage("Password must be in length of 8-10 characters.", req, res))
    } else if (!validator.isStrongPassword(updatedPassword)) {
      console.log("Password must have at least an alphabet, a number and a special character.")
      return next(setMessage("Password must have at least an alphabet, a number and a special character.", req, res))
    } else {
      // hash password using bcrypt
      const hash = bcrypt.hashSync(updatedPassword, saltRounds)
      updatedPassword = hash
    }

    if (updatedEmail != "" && !validator.isEmail(updatedEmail)) {
      console.log("Email must be in email format.")
      return next(setMessage("Email must be in email format.", req, res))
    } else if (updatedEmail != "" && validator.isEmail(updatedEmail)) {
      const checkEmail = `SELECT email
                          FROM accounts
                          WHERE email = ? AND username != ?`
      con.query(checkEmail, [updatedEmail, username], function (err, rows) {
        if (rows.length > 0) {
          console.log("This email exists, please use another email.")
          return next(setMessage("This email exists, please use another email.", req, res))
        } else {
          console.log("updated with email")

          // Update user details (Table: accounts)
          // data details: password / email / group (Admin/PM/etc) / isactive (Active/Inactive)
          const updateAccounts = `UPDATE accounts SET password = ?, email = ? WHERE username = ?`

          con.query(updateAccounts, [updatedPassword, updatedEmail, username], function (err, rows) {
            if (err) throw err

            if (rows.length > 0) {
              console.log(rows)
            }
          })

          const userInfo = {
            username: username
          }

          res.send(userInfo)
        }
      })
    } else {
      updatedEmail = email

      console.log("updated without changing email")

      // Update user details (Table: accounts)
      // data details: password / email / group (Admin/PM/etc) / isactive (Active/Inactive)
      const updateAccounts = `UPDATE accounts SET password = ?, email = ?, isactive = ?, usergroup = ? WHERE username = ?`

      con.query(updateAccounts, [updatedPassword, updatedEmail, username], function (err, rows) {
        if (err) throw err

        if (rows.length > 0) {
          console.log(rows)
        }
      })

      const userInfo = {
        username: username
      }

      res.send(userInfo)
    }
  })
}

module.exports = { editUser }
