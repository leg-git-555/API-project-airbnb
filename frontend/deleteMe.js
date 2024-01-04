/*

on my new compt test!

*/
let Spots = await Spot.findAll({
    //     include: {
    //         model: SpotImage,
    //         where: {
    //             preview: true
    //         },
    //         attributes: ['url']
    //     }
    // })

    // //convert Spots to JSON so it can be manipulated
    // Spots = Spots.map(spot => {
    //     spot = spot.toJSON()
    //     return spot
    // })

    // //iterate over each spot, add the avgRating and previewImage
    // for (let spot of Spots) {
    //     let count = await Review.count({
    //         where: {
    //             spotId: spot.id
    //         }
    //     })
    //     let avgRating = await Review.sum('stars', {
    //         where: {
    //             spotId: spot.id
    //         }
    //     })
    //         avgRating = avgRating/count
    //         spot.avgRating = avgRating

    //         spot.previewImage = spot.SpotImages[0].url
    //         delete spot.SpotImages
    // }

    
    // let resObj = {Spots}

    // return res.json(resObj)