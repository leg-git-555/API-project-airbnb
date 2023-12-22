const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const {User} = require('../../db/models')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');

router.use(restoreUser)


router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});


/*

//  USER AUTH TEST ROUTES BELOW

router.get('/restore-user', (req, res) => {
      return res.json(req.user);
    }
  );

router.get('/require-auth', requireAuth, (req, res) => {
    return res.json(req.user);
  }
);

router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Bukayo-7'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

*/


  
module.exports = router