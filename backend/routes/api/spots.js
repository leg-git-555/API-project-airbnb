const express = require('express');

const { setTokenCookie } = require('../../utils/auth');
const { Spot, Review, SpotImage, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')
      .exists({ checkFalsy: true })
      .isFloat({gt: -90, lt: 90})
      .withMessage('Latitude must be within -90 and 90'),
    check('lng')
      .exists({ checkFalsy: true })
      .isFloat({gt: -180, lt: 180})
      .withMessage('Longitude must be within -180 and 180'),
    check('name')
      .exists({ checkFalsy: true })
      .isLength({max: 49})
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .isFloat({ gt: 0 })
      .withMessage('Price per day must be a positive number'),
    
    handleValidationErrors
  ];

//create a spot
    router.post('/', requireAuth, validateSpot, async (req, res) => {
        const ownerId = req.user.id
        const { address, city, state, country, lat, lng, name, description, price} = req.body

            let existingSpot = await Spot.findOne({
                where: {
                    address,
                    city,
                    state
                }
            })

                if (existingSpot) {
                    return res.status(500).json({"message": "Spot already exists"})
                }

        const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price})

        
        res.status(201).json(spot)
    })



//get all spots
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


//get all the current user's spots
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


        return res.json({
            Spots: userSpotsB
        })
    })

//get spot by id
    router.get('/:spotId', async (req, res) => {
        let id = req.params.spotId
            id = parseInt(id)

        let spot = await Spot.findByPk(id, {
            include: [{
                model: SpotImage,
                where: {
                    spotId: id
                }
            }]
        })

            if (!spot) {
                return res.json({
                    "message": "Spot couldn't be found"
                  })
            }

            spot = spot.toJSON()

            let spotOwner = await User.findOne({
                where: {
                    id: spot.ownerId
                },
                attributes: ['id', 'firstName', 'lastName']
            })

            spot.Owner = spotOwner

        res.json(spot)
    })

    const isTrue = (val) => {
        return val === true
    }

    const validateSpotImage = [
        check('url')
          .exists({ checkFalsy: true })
          .withMessage('Url is required'),
        check('preview')
          .exists({ checkFalsy: true })
          .custom(isTrue)
          .withMessage('Preview value is required and must be true'),
        handleValidationErrors
      ];

//add an image to a spot
    router.post('/:spotId/images', requireAuth, validateSpotImage, async (req, res) => {
        let spotId = req.params.spotId
        spotId = parseInt(spotId)

        const ownerId = req.user.id

        const {url, preview} = req.body

            const spot = await Spot.findByPk(spotId)

                //error handler 1
                if (!spot) {
                    res.status(404).json({
                        "message": "Spot couldn't be found"
                      })
                }
                // error handler 2
                if (spot.ownerId !== ownerId) {
                    res.status(403).json({
                        "message": "Forbidden"
                      })
                }
        
        let spotImage = await SpotImage.create({spotId, url, preview})
            spotImage = spotImage.toJSON()
            delete spotImage.createdAt
            delete spotImage.updatedAt
            delete spotImage.spotId



        res.status(200).json(spotImage)
    })

//edit a spot 
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    let spotId = req.params.spotId
    spotId = parseInt(spotId)
    const { address, city, state, country, lat, lng, name, description, price} = req.body
    
    const ownerId = req.user.id

    let spot = await Spot.unscoped().findByPk(spotId)


        //error handler 1
        if (!spot) {
            res.status(404).json({
                "message": "Spot couldn't be found"
              })
        }
        // error handler 2
        if (spot.ownerId !== ownerId) {
            res.status(403).json({
                "message": "Forbidden"
              })
        }
    
    //update values and SAVE!
    spot.setDataValue('address', address)
    spot.setDataValue('city', city)
    spot.setDataValue('state', state)
    spot.setDataValue('country', country)
    spot.setDataValue('lat', lat)
    spot.setDataValue('lng', lng)
    spot.setDataValue('name', name)
    spot.setDataValue('description', description)
    spot.setDataValue('price', price)
    await spot.save()

    res.status(200).json({spot})
})

// delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    let spotId = req.params.spotId
    spotId = parseInt(spotId)

    const ownerId = req.user.id

    let spot = await Spot.unscoped().findByPk(spotId)

        //error handler 1
        if (!spot) {
            res.status(404).json({
                "message": "Spot couldn't be found"
              })
        }
        // error handler 2
        if (spot.ownerId !== ownerId) {
            res.status(403).json({
                "message": "Forbidden"
              })
        }

    await spot.destroy()

    res.status(200).json({
        "message": "Successfully deleted"
      })
})


module.exports = router;