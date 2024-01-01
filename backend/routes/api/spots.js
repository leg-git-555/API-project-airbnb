const express = require('express');

const { setTokenCookie } = require('../../utils/auth');
const { Spot, Review, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')

const router = express.Router();

router.get('/', async (req, res) => {
    const Spots = await Spot.findAll()
    let resObj = {Spots}

    return res.json(resObj)

})

router.get('/current', requireAuth,  async (req, res) => {
    const {user} = req;
    let id = user.id;
    
    let userSpots = await Spot.findAll({
        where: {
            ownerId: id
        }, 
    })

    let userSpotsB = userSpots.map(spot => spot.toJSON())

    console.log(userSpotsB)

    for (let spot of userSpotsB) {
        console.log(spot) //add avg score in here 
        spot.testKey = 'test value'
    }


    return res.json(userSpotsB)
})


module.exports = router;