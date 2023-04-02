const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Number = require('../models/Number')

router.get('/test',(req, res) => {
  response = {status: 'ok'};
  //res.end(JSON.stringify(response));
  res.end('test');
  //res.end(JSON.stringify(req.body));
})

// @desc    send SMS
// @route   POST /sms/send
router.post('/send', async (req, res) => {
  console.log('req.body.serialNumber: %s',req.body.serialNumber)
  console.log('req.body.text: %s',req.body.text)
  console.log('data: %s', 'some fancy data');
  console.log('req.body: %s', req.body);
  match = await Number.find( { serialNumber: "e581f02dc2fdb929efb8961b3b3351b21ac1fa75db9744b1b5661b0d8aa780db" } );
  console.log(JSON.stringify(match));
  //response = {status: 'ok'};
  //res.end(JSON.stringify(response));
  //res.end(body);
  res.end(JSON.stringify(match));
})

// @desc    register phone Number
// @route   POST /sms/register
router.post('/register', async (req, res) => {
  const filter = { serialNumber: req.body.serialNumber };
  const update = { serialNumber: req.body.serialNumber, phoneNumber: req.body.phoneNumber };
  try {
    match = await Number.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true 
    });
    count = await Number.countDocuments(filter); 
    console.log('req.body.serialNumber: %s',req.body.serialNumber)
    console.log('req.body.phoneNumber: %s',req.body.phoneNumber)
    console.log('match: %s' , JSON.stringify(match))
    console.log('count: %d' , JSON.stringify(count))
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
    //TODO more than one result unexpected
    const numbers = await Number.find().lean()
    //console.log('mongo query result: %s',JSON.stringify(numbers))
    response = {'serialNumber':numbers[0].serialNumber, 'phoneNumber':numbers[0].phoneNumber}
    //console.log(response)
    res.render('sms/index',{numbers})
  }catch(err){
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
