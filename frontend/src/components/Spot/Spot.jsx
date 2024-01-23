import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSpotByIdThunk } from "../../store/spot"
import { useParams } from "react-router-dom"
import './Spot.css'
import { getReviewsByIdThunk } from "../../store/reviews"
import star from "../../star.ico"

//npm install react-icons

export function Spot() {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const { spot } = useSelector(state => state.spot) //spot slice of state
    let spotImageRay = spot.SpotImages //without coniditional in return statement, page breaks
    const { Reviews } = useSelector(state => state.reviews) //review slice of state
    const { user } = useSelector(state => state.session)


    const monthObj = {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    }

    useEffect(() => {
        dispatch(getSpotByIdThunk(spotId))
        dispatch(getReviewsByIdThunk(spotId))
    }, [dispatch, spotId])

    return (

        <div>
            <h2>{spot.name}</h2>
            <h3>{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>
            <div className='singleSpotImageContainer'>
                <img src={spotImageRay && spotImageRay[0].url}></img>
                <div className='singleSpotImageContainerB'>
                    <img src={spotImageRay && spotImageRay[0].url}></img>
                    <img src={spotImageRay && spotImageRay[0].url}></img>
                    <img src={spotImageRay && spotImageRay[0].url}></img>
                    <img src={spotImageRay && spotImageRay[0].url}></img>
                </div>
            </div>
            <div className='singleSpotBottomThird'>
                <div className='hostInfoSpotDescription'>
                    <h3>{`Hosted by ${spot.Owner?.firstName} ${spot.Owner?.lastName}`}</h3>
                    <p>{spot?.description}</p>
                </div>
                <div className="calloutBox">
                    <div className="calloutBoxUpper">
                        <div>
                            {`$${spot?.price} night`}
                        </div>

                        {Reviews && Reviews.length > 0 ? (

                            <div className='starBox'>
                                <img src={star}></img>
                                <div>{`${spot?.avgStarRating} · ${Reviews.length} reviews`}</div>
                            </div>

                        ) : (

                            <div className='starBox'>
                                <img src={star}></img>
                                <div>New</div>
                            </div>

                        )}
                    </div>
                    <button>Reserve</button>
                </div>
            </div>
            <div>
                {Reviews && Reviews.length > 0 ? (
                    <>
                        <div className='starBox'>
                            <img src={star}></img>
                            <div>{`${spot?.avgStarRating} · ${Reviews.length} reviews`}</div>
                        </div>
                        <div className='reviewCardContainer'>
                            {Reviews.map(review => (
                                <div className='reviewCard' key={review.id}>
                                    <div>{review.User.firstName}</div>
                                    <div>{monthObj[review.createdAt.slice(5, 7)]} {review.createdAt.slice(0, 4)}</div>
                                    <div>{review.review}</div>
                                    <br />
                                </div>
                            ))}
                        </div>


                    </>

                ) : (

                    <>
                        <div className='starBox'>
                            <img src={star}></img>
                        </div>
                        {user?.id !== spot?.ownerId && <div>Be the first to post a review!</div>}
                    </>

                )}
            </div>
        </div>
    )
}