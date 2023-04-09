const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const { ensureHttpBasic } = require('../middleware/auth')

const Number = require('../models/Number')

function sendToTwilio(recipient) {
  //const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const accountSid = 'ACc574c320b7c370f205ffa3efd016ff44'
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);
  //console.log('calling twilio with recipient: %s', recipient);
  client.messages.create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+15074172464',
     to: recipient
   })
  .then(message => console.log(message.sid));
}

function verifyGoogleIdToken(token){
  const {OAuth2Client} = require('google-auth-library');
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      //audience: process.env.GOOGLE_APP_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    var result = { email: payload['email'], sub: payload['sub']}
    console.log(result)
    return result
  } 
  return verify().catch(console.error);
}


router.get('/test',(req, res) => {
  response = {status: 'ok'};
  //res.end(JSON.stringify(response));
  res.end('test');
  //res.end(JSON.stringify(req.body));
})

// @desc    send SMS
// @route   POST /sms/send
router.post('/send', ensureHttpBasic, async (req, res) => {
  console.log('req.body.serialNumber: %s',req.body.serialNumber)
  console.log('req.body.text: %s',req.body.text)
  console.log('req.body: %s', req.body);
  match = await Number.find( { serialNumber: "e581f02dc2fdb929efb8961b3b3351b21ac1fa75db9744b1b5661b0d8aa780db" } );
  console.log(JSON.stringify(match));
  //sendToTwilio(match[0].phoneNumber)
  //response = {status: 'ok'};
  //res.end(JSON.stringify(response));
  //res.end(body);
  res.end(JSON.stringify(match));
})

// @desc    register phone Number
// @route   POST /sms/register
router.post('/register', async (req, res) => {
  const dateNow = Date.now()
  const filter = { serialNumber: req.body.serialNumber };
  const update = { 
    serialNumber: req.body.serialNumber, 
    phoneNumber: req.body.phoneNumber,
    date: dateNow };
  try {
    match = await Number.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true 
    });
    count = await Number.countDocuments(filter); 
    console.log('req.body.serialNumber: %s',req.body.serialNumber)
    console.log('req.body.phoneNumber: %s',req.body.phoneNumber)
    console.log('req.body.googleIdToken: %s',req.body.googleIdToken)
    console.log('match: %s' , JSON.stringify(match))
    console.log('date: %s' , JSON.stringify(dateNow ))
    //console.log('count: %d' , JSON.stringify(count))
    user = await verifyGoogleIdToken(req.body.googleIdToken)
    console.log(user)
    res.end(JSON.stringify({'status': 'ok'}));
  } catch (err) {
    console.error(err)
    res.end(JSON.stringify({'status': 'fail'}));
  }
})

// @desc    delete phone Number
// @route   DELETE /sms/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  console.log('delete %s',req.params.id)
  try {
    let number = await Number.findById(req.params.id).lean()

    if (!number) {
      return res.render('error/404')
    }

    await Number.remove({ _id: req.params.id })
    res.redirect('/sms/render/numbers')
    
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
  
})

// @desc    list enrolled pairs
// @route   GET /sms/numbers
router.get('/numbers', async (req, res) => {
  try{
    console.log(req.user)
    //TODO more than one result unexpected
    const numbers = await Number.find().lean()
    console.log('mongo query result: %s',JSON.stringify(numbers))
    response = {'serialNumber':numbers[0].serialNumber, 'phoneNumber':numbers[0].phoneNumber}
    console.log(response)
    //res.render('sms/index',{numbers})
    res.end(JSON.stringify(response));
  }catch(err){
    console.error(err)
    //res.render('error/500')
    res.end(JSON.stringify({'status': 'fail'}));
  }
})

// @desc    list enrolled pairs
// @route   GET /sms/render/numbers
router.get('/render/numbers', ensureAuth, async (req, res) => {
  try{
    console.log(req.user)
    //TODO more than one result unexpected
    const numbers = await Number.find().lean()
    //console.log('mongo query result: %s',JSON.stringify(numbers))
    res.render('sms/index',{numbers})
  }catch(err){
    console.error(err)
    res.render('error/500')
  }
})

// @desc    return error
// @route   GET /sms/not_authenticated
router.get('/not_authenticated',  (req, res) => {
  res.status(401).json({
    message: "not authenticated",
    error: error.mesage,
  })
})

module.exports = router
