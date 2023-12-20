const router = require('express').Router();


router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });

// router.get('/woah', (req, res) => {
//     res.send('woahhhh')
// })
  

module.exports = router