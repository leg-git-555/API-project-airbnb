
import { useEffect, useState } from "react"
import './ReviewFormModal.css'
import { csrfFetch } from "../../store/csrf"
import star from "../../star.ico"




export function ReviewFormModal({spotId}) {
   
    const [review, setReview] = useState('')
    const [stars, setStars] = useState('')
    const [validations, setValidations] = useState({})
    
        useEffect(() => {
            let errorObj = {}

            if (review.length < 10) errorObj.review = 'Review must have more than 10 characters'
            if (stars > 5 || stars < 1) errorObj.stars = 'Star rating must be 1-5'

            setValidations(errorObj)
        }, [review, stars, setValidations])
        
        async function handleSubmit () {
            try {
                let path = `/api/spots/${spotId}/reviews`
                
                await csrfFetch(path, {
                    method: 'POST',
                    body: JSON.stringify({
                        review,
                        stars
                    })
                })

            } catch (err) {
                //do something with errors
                console.log(err)
            } 

        }

    return(
        <>
        <h1>How was your stay?</h1>
         <form 
            className="review-form"
            onSubmit={() => handleSubmit()}
         >
            <textarea 
                value={review}
                placeholder="Leave your review here..."
                onChange={e => setReview(e.target.value)}
            />
            {/* <input
                type='number'
                value={stars}
                placeholder="rate 1 through 5 stars"
                onChange={e => setStars(e.target.value)}
            /> */}
            <div className="mad-stars">
                <img src={star} onMouseEnter={() => {setStars(1)}} className={stars >= 1 ? 'star-night' : 'k'}></img>
                <img src={star} onMouseEnter={() => {setStars(2)}} className={stars >= 2 ? 'star-night' : 'k'}></img>
                <img src={star} onMouseEnter={() => {setStars(3)}} className={stars >= 3 ? 'star-night' : 'k'}></img>
                <img src={star} onMouseEnter={() => {setStars(4)}} className={stars >= 4 ? 'star-night' : 'k'}></img>
                <img src={star} onMouseEnter={() => {setStars(5)}} className={stars >= 5 ? 'star-night' : 'k'}></img>
                Stars
            </div>
                <div>{stars}</div>
            <button 
                type="submit"
                disabled={Object.keys(validations).length > 0}
            >Submit Your Review</button>
        </form>
        </>
    )
}