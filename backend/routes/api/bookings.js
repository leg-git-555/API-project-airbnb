const express = require('express');
const { Op } = require('sequelize')

const { setTokenCookie } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//get the current user's bookings
    router.get('/current', requireAuth, async (req, res) => {
        const userId = req.user.id

        let bookings = await Booking.findAll({
            where: {
                userId
            },
            include: [{
                model: Spot,
                include: [{
                    model: SpotImage
                }]
            }]
        })

        bookings = bookings.map(booking => booking.toJSON())

            for (let booking of bookings) {
                if (booking.Spot.SpotImages[0]) {
                    booking.Spot.previewImage = booking.Spot.SpotImages[0].url
                    delete booking.Spot.SpotImages
                } else {
                    booking.Spot.previewImage = 'this spot does not have a preview image yet'
                }
            }


        res.json({
            userId,
            'Bookings': bookings
        })
    })

    const validateDates = [
        check('startDate')
          .exists({ checkFalsy: true })
          .custom((startDate) => {
            let now = Date.now()
            startDate = new Date(startDate) //might need to use is ISO
            let startSeconds = startDate.getTime()
    
                if (!startSeconds || (startSeconds < now)) {
                    throw new Error("startDate cannot be in the past")
                }
    
            return true
          }),
        check('endDate')
          .exists({ checkFalsy: true })
          .custom((value, {req}) => {
            let {startDate, endDate} = req.body
                startDateSeconds = new Date(startDate).getTime()
                endDateSeconds = new Date(endDate).getTime()

                    if (endDateSeconds <= startDateSeconds) {
                        throw new Error("endDate cannot be on or before startDate")
                    }
            return true
          }),

        handleValidationErrors
      ];

// edit a booking 
    router.put('/:bookingId', requireAuth, validateDates, async (req, res) => {
        let bookingId = req.params.bookingId
        bookingId = parseInt(bookingId)
        let userId = req.user.id

        let booking = await Booking.findByPk(bookingId)
        
            //error handler 1 - booking not found
            if (!booking) {
                return res.status(404).json({
                    "message": "Booking couldn't be found"
                })
            }

        let {startDate, endDate} = req.body
        let newStartSeconds = new Date(startDate).getTime()
        let newEndSeconds = new Date(endDate).getTime()

        let currStartSeconds = booking.startDate.getTime()
        let currEndSeconds = booking.endDate.getTime()

        let now = Date.now()


            //error handler 2 - userId doesn't match 
            if (booking.userId !== userId) {
                return res.status(403).json({
                    "message": "Forbidden"
                  })
            }

            //error handler 3 - can't edit booking that's in the past
            if (currEndSeconds < now) {
                return res.status(403).json({
                    "message": "Past bookings can't be modified"
                  })
            }

            //error handler 4 - start is not date or date is in the past
            if (!newStartSeconds || newStartSeconds < now) {
                return res.status(400).json({
                    "message": "Bad Request", 
                    "errors": {
                      "startDate": "startDate cannot be in the past"
                    }
                  })
            }

            //error handler 5 - end date is on or before start date
            if (!newEndSeconds || newEndSeconds <= newStartSeconds) {
                return res.status(400).json({
                    "message": "Bad Request", 
                    "errors": {
                        "endDate": "endDate cannot be on or before startDate"
                    }
                  })
            }

        let spotId = booking.spotId 
        let id = booking.id

        let otherBookings = await Booking.findAll({
            where: {
                spotId,
                id: {
                    [Op.ne]: id
                }
            }
        })
        otherBookings = otherBookings.map(el => el.toJSON())

            //loop over each booking
            for (let booking of otherBookings) {
                let currStartSeconds = new Date(booking.startDate).getTime()
                let currEndSeconds = new Date(booking.endDate).getTime()

                    //check start date conflict
                    if (newStartSeconds >= currStartSeconds && newStartSeconds <= currEndSeconds) {
                        return res.status(403).json({
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "errors": {
                              "startDate": "Start date conflicts with an existing booking"
                            }
                          })
                    }

                    //check end date conflict
                    if (newEndSeconds >= currStartSeconds && newEndSeconds <= currEndSeconds) {
                        return res.status(403).json({
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "errors": {
                                "endDate": "End date conflicts with an existing booking"
                            }
                          })
                    }

                    let wrapCheckStart = currEndSeconds >= newStartSeconds && currEndSeconds <= newEndSeconds

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

        let finalStart = new Date(startDate)
        let finalEnd = new Date(endDate)

        booking.startDate = finalStart
        booking.endDate = finalEnd
        booking.save()
            
        res.json(booking)
    })

//delete a booking
    router.delete('/:bookingId', requireAuth, async (req, res) => {
        let bookingId = req.params.bookingId
        bookingId = parseInt(bookingId)
        let userId = req.user.id


            let booking = await Booking.findByPk(bookingId)
            let now = Date.now()
            

                //error handler 1 - booking not found
                    if (!booking) {
                        return res.status(404).json({
                            "message": "Booking couldn't be found"
                        })
                    }
                
            let startSeconds = booking.startDate.getTime()
                //error handler 2 - can't delete a bookings that's begun
                    if (now >= startSeconds) {
                        return res.status(403).json({
                            "message": "Bookings that have been started can't be deleted"
                          })
                    }
            
            let spot = await Spot.findByPk(booking.spotId)

                //error handler 3 - booking or spot must belong to current user
                    if (booking.userId !== userId && spot.ownerId !== userId) {
                        return res.status(403).json({
                            "message": "Forbidden"
                          })
                    }
        
        await booking.destroy()


        res.json({
            "message": "Successfully deleted"
          })
    })
















module.exports = router;