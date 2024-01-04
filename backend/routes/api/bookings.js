const express = require('express');

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

















module.exports = router;