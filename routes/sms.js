const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Number = require('../models/Number')

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

// @desc    register phone Number
// @route   POST /sms/register
router.post('/register', async (req, res) => {
  console.log('req.body.serialNumber: %s',req.body.serialNumber)
  console.log('req.body.phoneNumber: %s',req.body.phoneNumber)
  try {
    await Number.create(req.body)
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
    res.redirect('/sms/numbers')
    
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
  
})

// @desc    list enrolled pairs
// @route   GET /sms/numbers
router.get('/numbers', ensureAuth, async (req, res) => {
  try{
    const numbers = await Number.find().lean()
    console.log('mongo query result: %s',JSON.stringify(numbers))
    res.render('sms/index',{numbers})
  }catch(err){
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
