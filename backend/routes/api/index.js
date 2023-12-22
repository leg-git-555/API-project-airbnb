const router = require('express').Router();
const {User} = require('../../db/models')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');

router.use(restoreUser)




  
  

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