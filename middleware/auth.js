module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/')
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/dashboard');
    }
  },
  ensureHttpBasic: function (req, res, next){
    var encoded = req.headers.authorization.split(" ")[1]
    var authHeader = Buffer.from(encoded, 'base64').toString()
    pwgood = authHeader == process.env.BASIC_AUTH
    //console.log(pwgood)
    if (pwgood) {
      console.log('authenticated')
      //console.log(encoded)
      return next();
    } else {
      console.log('not authenticated')
      res.status(401)
      res.end(JSON.stringify({'status': 'not authenticated'}));
    }
  },
}
