const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/Story')

// @desc    send SMS
// @route   POST /sms/send
router.post('/send', (req, res) => {
  console.log('req.body.serialNumber: %s',req.body.serialNumber)
  console.log('req.body.text: %s',req.body.text)
  console.log('data: %s', 'some fancy data');
  console.log('req.body: %s', req.body);
  //response = {status: 'ok'};
  //res.end(JSON.stringify(response));
  //res.end(body);
  res.end(JSON.stringify(req.body));
})

// @desc    list enrolled pairs
// @route   GET /sms
router.get('/', async (req, res) => {
  try{
    const numbers = await Numbers.find()
    res.render('sms/index',{numbers})
  }catch(err){
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
