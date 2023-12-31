const express = require('express');

const { setTokenCookie } = require('../../utils/auth');
const { Spot } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res) => {
    const Spots = await Spot.findAll()
    let resObj = {Spots}

    res.json(resObj)

})


module.exports = router;