var con = require("../config/config-database")
var strip = require("strip")
var validator = require("validator")
var setMessage = require("../message")
var bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// check for whitespace
function checkUsernameFormat(username) {
  var whitespace = /^\S*$/
  if (whitespace.test(username)) {
    return true
  } else {
    return false
  }
}

// get the elements of one array which are not present in another array
function newGroupCheck(array1, array2) {
  var elements = array1.filter(f => !array2.includes(f))
  return elements
}

// add new user
// Frontend: AdminUserAdd.js  [Axios.get("/api/admin/user/add")]
const addUser = (req, res, next) => {
  let username = req.body.username
  let password = req.body.password
  let email = req.body.email
  let group = req.body.group
  let groups = []
  let existingGroups = []
  let newGroups = []

  // remove all leading and trailing spaces and tabs
  username = strip(username)
  password = strip(password)
  email = strip(email)

  // hash password information
  const saltRounds = 10

  // store group values in array (without label)
  for (var i = 0; i < group.length; i++) {
    groups.push(group[i].value)
  }

  // CREATE NEW USER - VALIDATION
  // check username
  if (validator.isEmpty(username)) {
    console.log("Please enter username.")
    return next(setMessage("Please enter username.", req, res))
  } else if (!checkUsernameFormat(username)) {
    console.log("Username must not have any space.")
    return next(setMessage("Username must not have any space.", req, res))
  } else {
    const checkUsername = `SELECT username
                               FROM accounts
                               WHERE username = ?`
    con.query(checkUsername, [username], function (err, rows) {
      if (err) console.log(err)
      if (rows.length > 0) {
        console.log("This username exists, please use another username.")
        return next(setMessage("This username exists, please use another username.", req, res))
      } else {
        if (validator.isEmpty(password)) {
          console.log("Please enter password.")
          return next(setMessage("Please enter password.", req, res))
        } else if (password.length < 8 || password.length > 10) {
          console.log("Password must be in length of 8-10 characters.")
          return next(setMessage("Password must be in length of 8-10 characters.", req, res))
        } else if (!validator.isStrongPassword(password)) {
          console.log("Password must have at least an alphabet, a number and a special character.")
          return next(setMessage("Password must have at least an alphabet, a number and a special character.", req, res))
        } else {
          if (email != "" && !validator.isEmail(email)) {
            console.log("Email must be in email format.")
            return next(setMessage("Email must be in email format.", req, res))
          } else if (email != "" && validator.isEmail(email)) {
            const checkEmail = `SELECT email
                                    FROM accounts
                                    WHERE email = ?`
            con.query(checkEmail, [email], function (err, rows) {
              if (rows.length > 0) {
                console.log("This email exists, please use another email.")
                return next(setMessage("This email exists, please use another email.", req, res))
              } else {
                console.log("inserted with email")
                // hash password using bcrypt
                const hash = bcrypt.hashSync(password, saltRounds)

                // convert array to string
                const groupArray = groups.toString()

                // add new user into accounts table
                con.query("INSERT INTO accounts (username, password, email, isactive, usergroup) VALUES (?, ?, ?, ?, ?)", [username, hash, email, "Active", groupArray], function (err) {
                  console.log("Username: " + username)
                  console.log("Password: " + password)
                  console.log("Email: " + email)
                  console.log("Group: " + groupArray)
                  console.log("User " + username + " has created successfully.")
                })

                const userInfo = {
                  username: username
                }

                res.send(userInfo)

                // if user enters group (check if there is newly created group, then add group)
                if (group != "") {
                  // get all groups from user group table
                  const existingGroup = `SELECT groupname
                               FROM usergroup`

                  // store all groups into array
                  con.query(existingGroup, function (err, rows) {
                    if (rows.length > 0) {
                      for (var i = 0; i < rows.length; i++) {
                        existingGroups.push(rows[i].groupname)
                      }

                      // check and filter between user added group and all groups array
                      newGroups = newGroupCheck(groups, existingGroups)

                      // if there is newly added group (add into usergroup table)
                      if (newGroups != "") {
                        for (var i = 0; i < newGroups.length; i++) {
                          const addUserGroup = `INSERT INTO usergroup (groupname, description, isactive) VALUES (?, ?, ?)`

                          con.query(addUserGroup, [newGroups[i], "", "Active"], function (err, rows) {
                            if (err) throw err
                            if (rows.length > 0) {
                              console.log("Group have been added into table usergroup in database.")
                            }
                          })
                        }
                      }

                      for (var i = 0; i < groups.length; i++) {
                        const addGroup = `INSERT INTO accountsgroup (groupname, username, isactive) VALUES (?, ?, ?)`

                        con.query(addGroup, [groups[i], username, "Active"], function (err, rows) {
                          if (err) throw err
                          if (rows.length > 0) {
                            console.log("Group and user have been added into table accountsgroup in database.")
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          } else {
            console.log("inserted without email")
            // hash password using bcrypt
            const hash = bcrypt.hashSync(password, saltRounds)

            // convert array to string
            const groupArray = groups.toString()

            // add new user into accounts table
            con.query("INSERT INTO accounts (username, password, email, isactive, usergroup) VALUES (?, ?, ?, ?, ?)", [username, hash, email, "Active", groupArray], function (err) {
              // if (err) throw err
              if (err) return next(setMessage(err, req, res))

              console.log("Username: " + username)
              console.log("Password: " + password)
              console.log("Email: " + email)
              console.log("Group: " + groupArray)
              console.log("User " + username + " has created successfully.")
            })

            const userInfo = {
              username: username
            }

            res.send(userInfo)

            // if user enters group (check if there is newly created group, then add group)
            if (group != "") {
              // get all groups from user group table
              const existingGroup = `SELECT groupname
                               FROM usergroup`

              // store all groups into array
              con.query(existingGroup, function (err, rows) {
                if (rows.length > 0) {
                  for (var i = 0; i < rows.length; i++) {
                    existingGroups.push(rows[i].groupname)
                  }

                  // check and filter between user added group and all groups array
                  newGroups = newGroupCheck(groups, existingGroups)

                  // if there is newly added group (add into usergroup table)
                  if (newGroups != "") {
                    for (var i = 0; i < newGroups.length; i++) {
                      const addUserGroup = `INSERT INTO usergroup (groupname, description, isactive) VALUES (?, ?, ?)`

                      con.query(addUserGroup, [newGroups[i], "", "Active"], function (err, rows) {
                        if (err) throw err
                        if (rows.length > 0) {
                          console.log("Group have been added into table usergroup in database.")
                        }
                      })
                    }
                  }

                  for (var i = 0; i < groups.length; i++) {
                    const addGroup = `INSERT INTO accountsgroup (groupname, username, isactive) VALUES (?, ?, ?)`

                    con.query(addGroup, [groups[i], username, "Active"], function (err, rows) {
                      if (err) throw err
                      if (rows.length > 0) {
                        console.log("Group and user have been added into table accountsgroup in database.")
                      }
                    })
                  }
                }
              })
            }
          }
        }
      }
    })
  }
}

module.exports = { addUser }
