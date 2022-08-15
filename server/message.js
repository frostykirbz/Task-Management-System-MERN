const message = function (err, req, res, next) {
  res.send({ errorMsg: err })
}

module.exports = message
