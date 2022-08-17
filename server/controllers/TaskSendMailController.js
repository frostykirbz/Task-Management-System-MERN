const nodemailer = require("nodemailer")
var con = require("../config/config-database")

const getAccountEmail = `SELECT * 
                         FROM accounts`

const getAccount = `SELECT * 
                    FROM accounts 
                    WHERE username = ?`

// send mail
const sendMail = async (req, res) => {
  let taskOwner = req.body.taskOwner
  let taskName = req.body.taskName
  let taskApp = req.body.taskApp
  let taskOwnerEmail = ""
  let email = ""
  let usergroup = false

  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  })

  con.query(getAccount, [taskOwner], function (err, rows) {
    if (rows.length > 0) {
      taskOwnerEmail = rows[0].email
    }

    con.query(getAccountEmail, async function (err, rows) {
      if (rows.length > 0) {
        for (var i = 0; i < rows.length; i++) {
          email = rows[i].email
          usergroup = rows[i].usergroup.includes("Project Lead")

          if (usergroup) {
            await transport.sendMail({
              from: taskOwnerEmail,
              to: email,
              subject: "TMS Task Notification",
              html: `
                    <h2>Your task is now completed!</h2>
                    <hr/>
                    <p>Dear ${rows[i].username},</p>
                    <p>${taskOwner} has completed task ${taskName} in Application ${taskApp}.</p>
                    <br/>
                    <p><small><i>This is an automated email. Do not reply this email.</i></small></p>
                `
            })
          }
        }
      }
    })
  })
}

module.exports = { sendMail }
