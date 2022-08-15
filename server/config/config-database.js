const mysql = require("mysql")

const config = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "database",
  port: "3306"
})

config.connect(function (err, rows) {
  if (err) throw err
  console.log("Database is connected...")
})

module.exports = config
