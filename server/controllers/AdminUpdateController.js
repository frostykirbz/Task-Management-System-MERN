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

// Edit one user
// Frontend: AdminUserEdit.js [Axios.get("/api/admin/user/update/:id")]
const editUserAdmin = (req, res, next) => {
  // declare variables
  let password = ""
  let email = ""
  let isactive = ""
  let updatedUserGroup = ""
  let existingGroup = []
  let selectedGroup = []
  let newGroup = []
  let editedGroup = []
  let userGroup = []
  let activeGroup = []
  let inactiveGroup = []

  let username = req.body.username
  let updatedPassword = req.body.password
  let updatedEmail = req.body.email
  let updatedIsActive = req.body.isactive
  let updatedGroup = req.body.selectedGroup

  // hash password information
  const saltRounds = 10

  // Check user details (Table: accounts)
  // data details: password / email / role (Admin/User) / isactive (Active/Inactive)
  const checkAccounts = `SELECT password, email, isactive, usergroup 
                             FROM accounts 
                             WHERE username = ?`

  con.query(checkAccounts, [username], function (err, rows) {
    if (err) throw err

    if (rows.length > 0) {
      password = rows[0].password
      email = rows[0].email
      isactive = rows[0].isactive
    }

    // if group is empty
    if (updatedGroup == "") {
      updatedUserGroup = ""
    }
    // if group has values
    else {
      for (var i = 0; i < updatedGroup.length; i++) {
        selectedGroup.push(updatedGroup[i].value)
      }
      updatedUserGroup = selectedGroup.toString()
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
          if (updatedIsActive == "") {
            updatedIsActive = isactive
          }
          // Update user details (Table: accounts)
          // data details: password / email / group (Admin/PM/etc) / isactive (Active/Inactive)
          const updateAccounts = `UPDATE accounts SET password = ?, email = ?, isactive = ?, usergroup = ? WHERE username = ?`

          con.query(updateAccounts, [updatedPassword, updatedEmail, updatedIsActive, updatedUserGroup, username], function (err, rows) {
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
      if (updatedIsActive == "") {
        updatedIsActive = isactive
      }

      // Update user details (Table: accounts)
      // data details: password / email / group (Admin/PM/etc) / isactive (Active/Inactive)
      const updateAccounts = `UPDATE accounts SET password = ?, email = ?, isactive = ?, usergroup = ? WHERE username = ?`

      con.query(updateAccounts, [updatedPassword, updatedEmail, updatedIsActive, updatedUserGroup, username], function (err, rows) {
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

    const checkNewGroup = `SELECT groupname
                               FROM usergroup`

    con.query(checkNewGroup, function (err, rows) {
      for (var i = 0; i < rows.length; i++) {
        existingGroup.push(rows[i].groupname)
      }

      newGroup = checkArrayDiff(selectedGroup, existingGroup)

      // if user adds new group that is not in the group (usergroup)
      if (newGroup != "") {
        const addGroup = `INSERT INTO usergroup (groupname, description, isactive) VALUES (?, ?, ?)`
        const addUserGroup = `INSERT INTO accountsgroup (groupname, username, isactive) VALUES (?, ?, ?)`

        for (var i = 0; i < newGroup.length; i++) {
          // Add group into usergroup table
          con.query(addGroup, [newGroup[i], "", "Active"], function (err, rows) {
            console.log("Group has been added in usergroup table.")
          })

          // Add group into accountsgroup table
          con.query(addUserGroup, [newGroup[i], username, "Active"], function (err, rows) {
            console.log("Group has been added in accountsgroup table.")
          })
        }
      }

      const groupCheck = `SELECT groupname
                              FROM accountsgroup
                              WHERE username = ?`

      con.query(groupCheck, [username], function (err, rows) {
        for (var i = 0; i < rows.length; i++) {
          userGroup.push(rows[i].groupname)
        }

        // if user has group
        if (selectedGroup != "") {
          editedGroup = checkArrayDiff(selectedGroup, userGroup)
          inactiveGroup = checkArrayDiff(userGroup, selectedGroup)
          activeGroup = checkArray(selectedGroup, userGroup)

          console.log(editedGroup)
          console.log(inactiveGroup)
          console.log(activeGroup)

          // if user has no group in accountsgroup (added into existing usergroup's group)
          if (editedGroup != "") {
            const insertGroup = `INSERT INTO accountsgroup (groupname, username, isactive) VALUES (?, ?, ?)`
            for (var i = 0; i < editedGroup.length; i++) {
              con.query(insertGroup, [editedGroup[i], username, "Active"], function (err, rows) {
                console.log("Group is added into accountsgroup.")
              })
            }
          }
          // if user has existing groups in accountsgroup (set active/inactive)
          else {
            const updateGroup = `UPDATE accountsgroup SET isactive = ? WHERE groupname = ? AND username = ?`
            for (var i = 0; i < inactiveGroup.length; i++) {
              con.query(updateGroup, ["Inactive", inactiveGroup[i], username], function (err, rows) {
                console.log("Updated!")
              })
            }

            for (var i = 0; i < activeGroup.length; i++) {
              con.query(updateGroup, ["Active", activeGroup[i], username], function (err, rows) {
                console.log("Updated!")
              })
            }
          }
        }
        // if user has no group
        else {
          const updateGroup = `UPDATE accountsgroup SET isactive = ? WHERE groupname = ? AND username = ?`
          for (var i = 0; i < userGroup.length; i++) {
            con.query(updateGroup, ["Inactive", userGroup[i], username], function (err, rows) {
              console.log("Updated!!")
            })
          }
        }

        // reset isactive to inactive (selectedGroup isactive is overwritten, hence need to set back)
        let groupArray = []
        const checkActiveGroup = `SELECT groupname FROM usergroup WHERE isactive = ?`
        const updateActiveGroup = `UPDATE accountsgroup SET isactive = ? WHERE groupname = ? AND username = ?`

        con.query(checkActiveGroup, ["Inactive"], function (err, rows) {
          if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
              groupArray.push(rows[i].groupname)
            }
          }

          for (var i = 0; i < groupArray.length; i++) {
            con.query(updateActiveGroup, ["Inactive", groupArray[i], username], function (err, rows) {
              console.log("Updated with inactive user group.")
            })
          }
        })
      })
    })
  })
}

module.exports = { editUserAdmin }
