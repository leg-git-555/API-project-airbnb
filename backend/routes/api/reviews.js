const express = require('express');

const { setTokenCookie } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//get current user reviews
    router.get('/current', requireAuth, async (req, res) => {
        let userId = req.user.id
        userId = parseInt(userId)

            let reviews = await Review.findAll({
                where: {
                    userId
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    {
                        model: Spot,
                        include: [
                            {model: SpotImage}
                            ]
                    },
                    {
                        model: ReviewImage,
                        attributes: ['id', 'url']
                    }
                ]
            })

            reviews = reviews.map(review => review.toJSON())

            for (let review of reviews) {
                let previewImage = review.Spot.SpotImages[0].url
                review.Spot.previewImage = previewImage
                
                    delete review.Spot.SpotImages
                    delete review.Spot.description
            }

        return res.status(200).json({'Reviews': reviews})
    })













module.exports = router;