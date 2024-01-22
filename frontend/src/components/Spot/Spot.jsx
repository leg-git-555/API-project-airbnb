import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSpotByIdThunk } from "../../store/spot"
import { useParams } from "react-router-dom"
import './Spot.css'
import { getReviewsByIdThunk } from "../../store/reviews"
import star from "../../../public/star.ico"


export function Spot() {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const { spot } = useSelector(state => state.spot)
    let spotImageRay = spot.SpotImages //without coniditional in return statement, page breaks

    const { Reviews } = useSelector(state => state.reviews)
    // console.log('reviews data', Reviews)


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
        </div>
    )
}