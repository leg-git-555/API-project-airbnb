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
    const userId = req.user.id

        let spotImage = await SpotImage.findByPk(imageId, {
            include: {
                model: Spot
            }
        })

            //error handler 1 - spot image not found
            if (!spotImage) {
                return res.status(404).json({
                    "message": "Spot Image couldn't be found"
                  })
            }

            //error handler 2 - spot must belong to the current user
            if (spotImage.Spot.ownerId !== userId) {
                return res.status(403).json({
                    "message": "Forbidden"
                  })
            }

        await spotImage.destroy()


    res.json({
        "message": "Successfully deleted"
      })
})





module.exports = router