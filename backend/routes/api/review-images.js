const express = require('express');

const { setTokenCookie } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    let imageId = req.params.imageId
    imageId = parseInt(imageId)
    let userId = req.user.id

        let reviewImage = await ReviewImage.findByPk(imageId, {
            include: [{
                model: Review,
                include: [{
                    model: Spot
                }]
            }]
        })

            //error handler 1 - review image not found
            if (!reviewImage) {
                return res.status(404).json({
                    "message": "Review Image couldn't be found"
                  })
            }

        let reviewerId = reviewImage.Review.userId

            //error handler 2 - review doesn't belong to the current user
            if (userId !== reviewerId) {
                return res.status(403).json({
                    "message": "Forbidden"
                  })
            }

        await reviewImage.destroy()

    res.json({
        "message": "Successfully deleted"
      })
})










module.exports = router