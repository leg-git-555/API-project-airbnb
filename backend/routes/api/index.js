const router = require('express').Router();

const {User} = require('../../db/models')

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });

router.get('/users', async (req, res) => {
    const users = await User.findAll()

    res.json(users)
})

// router.get('/woah', (req, res) => {
//     res.send(`woahhh you're doing it!`)
// })
  

module.exports = router