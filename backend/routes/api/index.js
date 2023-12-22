const router = require('express').Router();
const { Op } = require('sequelize')

const {User} = require('../../db/models')
const { setTokenCookie, restoreUser } = require('../../utils/auth.js');

router.use(restoreUser)

router.get('/restore-user', (req, res) => {
    return res.json(req.user);
  }
);


router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });



// TEST ROUTES BELOW

router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Bukayo-7'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

// router.get('/users', async (req, res) => {
//     const users = await User.findAll()

//     res.json(users)
// })

// router.get('/woah', (req, res) => {
//     res.send(`woahhh you're doing it!`)
// })
  

module.exports = router