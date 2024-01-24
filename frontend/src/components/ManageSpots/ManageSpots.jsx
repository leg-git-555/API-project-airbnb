import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentSpotsThunk } from "../../store/currentSpots"
import star from '../../star.ico'
import { useNavigate } from "react-router-dom"



export function ManageSpots () {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    let {Spots} = useSelector(state => state.currentSpots)

    // console.log('current spots data', Spots)

        useEffect(() => {
            dispatch(getCurrentSpotsThunk())
        }, [dispatch])

    return (
        <>
            <h1>Manage Your Spots</h1>
            <button>Create a New Spot</button>
            <div className="spotsContainer">
            {Spots.map(spot => (
                <div className='spotCard' key={spot.id} onClick={() => navigate(`/spots/${spot.id}`)}>
                   <img src={spot.previewImage}></img>

                   <div className='locationStars'>
                        <div>{`${spot.city}, ${spot.state}`}</div>
                        <div className="starContainer">
                            <img src={star}></img>
                            {!isNaN(parseInt(spot.avgRating)) && <div>{`${spot.avgRating}`}</div>}
                        </div>

                   </div>
                        <div>
                            {`$${spot.price} night`}
                        </div>

                        <div>
                            <button>update</button>
                            <button>delete</button>
                        </div>
                </div>
            ))}

            </div>
        </>
    )
}