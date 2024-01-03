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

    const validateReviewImageUrl = [
        check('url')
          .exists({ checkFalsy: true })
          .notEmpty()
          .withMessage('Url is required.'),
        handleValidationErrors
      ];

// add an image to a review based on Review id
    router.post('/:reviewId/images', requireAuth, validateReviewImageUrl, async (req, res) => {
        let reviewId = req.params.reviewId
        reviewId = parseInt(reviewId)
        let userId = req.user.id
        const {url} = req.body

            let review = await Review.findByPk(reviewId, {
                include: [
                    {
                        model: ReviewImage
                    }
                ]
            })

                //error handler 1 - check if review exists
                if (!review) {
                    return res.status(404).json({
                        "message": "Review couldn't be found"
                      })
                }

                //error handler 2 - check the user is authorized to add image
                if (review.userId !== userId) {
                    return res.status(403).json({
                        "message": "Forbidden"
                      })
                }

                //error handler 3 - check that aren't more than 10 existing review images
                if (review.ReviewImages.length === 10) {
                    return res.status(403).json({
                        "message": "Maximum number of images for this resource was reached"
                      })
                }

        let newReviewImage = await ReviewImage.create({reviewId, url})
            
            newReviewImage = newReviewImage.toJSON()
            delete newReviewImage.reviewId;
            delete newReviewImage.createdAt;
            delete newReviewImage.updatedAt;




        res.status(200).json(
            newReviewImage
        )
    })

    const validateReviewEdit = [
        check('review')
          .exists({ checkFalsy: true })
          .notEmpty()
          .withMessage('Review text is required'),
        check('stars')
          .exists({ checkFalsy: true })
          .isInt({ min: 0, max: 5 })
          .withMessage('Stars must be an integer from 1 to 5'),
        handleValidationErrors
      ];

//edit a review
    router.put('/:reviewId', requireAuth, validateReviewEdit, async (req, res) => {
        let reviewId = req.params.reviewId
        reviewId = parseInt(reviewId)
        const userId = req.user.id
        const {review, stars} = req.body

        let reviewRecord = await Review.findByPk(reviewId)

            //error handler 1 - check if reviewRecord exists
            if (!reviewRecord) {
                return res.status(404).json({
                    "message": "Review couldn't be found"
                  })
            }

            //error handler 2 - check that review record is owned by current user
            if (reviewRecord.userId !== userId) {
                return res.status(403).json({
                    "message": "Forbidden"
                  })
            }

        reviewRecord.review = review
        reviewRecord.stars = stars
        await reviewRecord.save()

        res.status(200).json(reviewRecord)
    })













module.exports = router;