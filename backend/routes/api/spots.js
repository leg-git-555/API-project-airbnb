const express = require('express');

const { setTokenCookie } = require('../../utils/auth');
const { Spot, Review, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')

const router = express.Router();

router.get('/', async (req, res) => {
    let Spots = await Spot.findAll({
        include: {
            model: SpotImage,
            where: {
                preview: true
            },
            attributes: ['url']
        }
    })

    //convert Spots to JSON so it can be manipulated
    Spots = Spots.map(spot => {
        spot = spot.toJSON()
        return spot
    })

    //iterate over each spot, add the avgRating and previewImage
    for (let spot of Spots) {
        let count = await Review.count({
            where: {
                spotId: spot.id
            }
        })
        let avgRating = await Review.sum('stars', {
            where: {
                spotId: spot.id
            }
        })
            avgRating = avgRating/count
            spot.avgRating = avgRating

            spot.previewImage = spot.SpotImages[0].url
            delete spot.SpotImages
    }

    
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
        include: {
            model: SpotImage,
            where: {
                preview: true
            },
            attributes: ['url'],
        }
    })

    let userSpotsB = userSpots.map(spot => spot.toJSON())

    for (let spot of userSpotsB) {
        let count = await Review.count({
            where: {
                spotId: spot.id
            } 
        })

        let avgRating = await Review.sum('stars', {
            where: {
                spotId: spot.id
            }
        })

            avgRating = avgRating/count
            spot.avgRating = avgRating

            spot.previewImage = spot.SpotImages[0].url
            delete spot.SpotImages
    }


    return res.json(userSpotsB)
})

router.get('/:spotId', async (req, res) => {
    let id = req.params.spotId
        id = parseInt(id)

    let spot = await Spot.findByPk(1, {
        include: [{
            model: SpotImage,
            where: {
                spotId: id
            }
        }]
    })

    res.json(spot)
})


module.exports = router;