const express = require('express');

const { setTokenCookie } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');
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
        let spots = await Spot.unscoped().findAll()
        spots = spots.map(spot => spot.toJSON())

        let reviews = await Review.findAll()
        reviews = reviews.map(review => review.toJSON())

        let spotImages = await SpotImage.findAll()
        spotImages = spotImages.map(spotImage => spotImage.toJSON())

            for (let spot of spots) {
                let reviewCount = 0;
                let reviewStarSum = 0;

                    reviews.forEach(review => {
                        if (review.spotId === spot.id) {
                            reviewStarSum += review.stars
                            reviewCount++
                        }
                    })
                
                spot.avgRating = (reviewStarSum / reviewCount) || 'no reviews yet for this spot!'

                let previewImage = spotImages.find(el => el.spotId === spot.id)

                    if (previewImage) {
                        spot.previewImage = previewImage.url
                    } else {
                        spot.previewImage = 'no preview image for this spot'
                    }
            }

        res.json({
            'Spots': spots
        })
    })


//get all the current user's spots
    router.get('/current', requireAuth,  async (req, res) => {
        
        const {user} = req;
        let id = user.id;
        
        let userSpots = await Spot.unscoped().findAll({
            where: {
                ownerId: id
            }
        })
        userSpots = userSpots.map(userSpot => userSpot.toJSON())

        let spotImages = await SpotImage.findAll()
        spotImages = spotImages.map(spotImage => spotImage.toJSON())

        for (let spot of userSpots) {
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

            let previewImage = spotImages.find((el) => {
                return el.spotId === spot.id
            })

                avgRating = avgRating/count
                spot.avgRating = avgRating
               
                if (previewImage) {
                    spot.previewImage = previewImage.url
                } else{
                    spot.previewImage = 'no preview image for this spot. feel free to add an image!'
                }
        }


        return res.json({
            Spots: userSpots
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
                return res.status(404).json({
                    "message": "Spot couldn't be found"
                })
            }
            // error handler 2
            if (spot.ownerId !== ownerId) {
                return res.status(403).json({
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
                return res.status(404).json({
                    "message": "Spot couldn't be found"
                })
            }
            // error handler 2
            if (spot.ownerId !== ownerId) {
                return res.status(403).json({
                    "message": "Forbidden"
                })
            }

        await spot.destroy()

        res.status(200).json({
            "message": "Successfully deleted"
        })
    })

//get all reviews by a Spot's id
    router.get('/:spotId/reviews', async (req, res) => {
        let spotId = req.params.spotId
        spotId = parseInt(spotId)

        let spot = await Spot.findByPk(spotId)

            //error handler 1
            if (!spot) {
                return res.status(404).json({
                    "message": "Spot couldn't be found"
                })
            }

        let spotReviews = await Review.findAll({
            where: {
                spotId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        })
        

        res.status(200).json({
            Reviews: [...spotReviews]
        })
    })

    const validateReview = [
        check('review')
          .exists({ checkFalsy: true })
          .withMessage('Review text is required'),
        check('stars')
          .exists({ checkFalsy: true })
          .isInt({ min: 0, max: 5 })
          .withMessage('Stars must be an integer from 1 to 5'),
        handleValidationErrors
      ];

// create a review for a spot
    router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
        let spotId = req.params.spotId
        spotId = parseInt(spotId)
        let userId = req.user.id
        
        const {review, stars} = req.body

            let spot = await Spot.findByPk(spotId)

                //error handler 1
                if (!spot) {
                    return res.status(404).json({
                        "message": "Spot couldn't be found"
                    })
                }

            let existingReview = await Review.findOne({
                where: {
                    spotId,
                    userId
                }
            })

                //error handler 2
                if(existingReview) {
                    return res.status(500).json({
                        "message": "User already has a review for this spot"
                      })
                }

        let newReview = await Review.create({spotId, userId, review, stars})




        res.status(201).json(newReview)
    })

// get all the bookings for a spot based on spot id
    router.get('/:spotId/bookings', requireAuth, async (req, res) => {
        let spotId = req.params.spotId
        spotId = parseInt(spotId)
        const ownerId = req.user.id

            let spot = await Spot.findByPk(spotId)

                // error handler 1 -- spot isn't found
                if (!spot) {
                    return res.status(404).json({
                        "message": "Spot couldn't be found"
                    })
                }
            // res if you're not the owner
            if (spot.ownerId !== ownerId) {
                let bookings = await Booking.findAll({
                    where: {
                        spotId
                    },
                    attributes: ['spotId', 'startDate', 'endDate']
                })

                return res.status(200).json({
                    'Bookings': bookings
                })
            }

            if (spot.ownerId === ownerId) {
                let bookings = await Booking.findAll({
                    where: {
                        spotId
                    },
                    include: [{
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }]
                })

                return res.status(200).json({
                    'Bookings': bookings
                })
            }

    })

    

    // const validateDates = [
    //     check('startDate')
    //       .custom((startDate) => {
    //         let now = Date.now()
    //          startDate = new Date(startDate) //might need to use is ISO
    //         let startSeconds = startDate.getTime()

    //             if (!startSeconds || (startSeconds < now)) {
    //                 throw new Error("startDate cannot be in the past")
    //             }

    //         return true
    //       }),
    //     check('stars')
    //       .exists({ checkFalsy: true })
    //       .isInt({ min: 0, max: 5 })
    //       .withMessage('Stars must be an integer from 1 to 5'),
    //     handleValidationErrors
    //   ];

//create a booking for a spot based on the spot's id
    router.post('/:spotId/bookings', requireAuth, async (req, res) => {
        let spotId = req.params.spotId
        spotId = parseInt(spotId)
        let {startDate, endDate} = req.body
        let userId = req.user.id

        let spot = await Spot.findByPk(spotId)

        let now = Date.now()
        startDate = new Date(startDate) //might need to use is ISO
        let startSeconds = startDate.getTime()
        endDate = new Date(endDate)
        let endSeconds = endDate.getTime()


                // error handler 1 -- spot isn't found
                if (!spot) {
                    return res.status(404).json({
                        "message": "Spot couldn't be found"
                    })
                }

                //error handler 2 -- start date in past
                if (!startSeconds || (startSeconds < now)) {
                    return res.status(400).json({
                        "message": "Bad Request",
                        "errors": {
                        "startDate": "startDate cannot be in the past"
                        }
                    })
                }

                //error handler 3 -- end date before start date
                if (!endDate || (endSeconds <= startSeconds)) {
                    return res.status(400).json({
                        "message": "Bad Request",
                        "errors": {
                            "endDate": "endDate cannot be on or before startDate"
                        }
                    })
                }

        let bookings = await Booking.findAll({
            where: {
                spotId
            }
        })
        bookings = bookings.map(booking => booking.toJSON())

            //loop over each booking
            for (let booking of bookings) {
                let currStartSeconds = new Date(booking.startDate).getTime()
                let currEndSeconds = new Date(booking.endDate).getTime()
                
                    //check start date conflict
                    if (startSeconds >= currStartSeconds && startSeconds <= currEndSeconds) {
                        return res.status(403).json({
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "errors": {
                              "startDate": "Start date conflicts with an existing booking"
                            }
                          })
                    }

                    //check end date conflict
                    if (endSeconds >= currStartSeconds && endSeconds <= currEndSeconds) {
                        return res.status(403).json({
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "errors": {
                                "endDate": "End date conflicts with an existing booking"
                            }
                          })
                    }

                    let wrapCheckStart = currEndSeconds > startSeconds && currEndSeconds < endSeconds

                    //check that new date don't wrap around an existing booking
                    if (wrapCheckStart) {
                        return res.status(403).json({
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "errors": {
                              "startDate": "Start date conflicts with an existing booking",
                              "endDate": "End date conflicts with an existing booking"
                            }
                          })
                    }

            }

        let newBooking = await Booking.create({spotId, userId, startDate, endDate})

        res.json(newBooking)
    })

    //wonky


module.exports = router;