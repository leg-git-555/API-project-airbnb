import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSpotsThunk } from "../../store/spots"
import './Spots.css'
import star from '../../star.ico'


export function Spots() {
    const dispatch = useDispatch()
    const stateData = useSelector(state => state.spots)
    let spots = []

    for (const spot in stateData) {
        spots.push(stateData[spot])
    }

    useEffect(() => {
        dispatch(getSpotsThunk())
    }, [dispatch])

    return (
        <>
            <h2>Welcome!</h2>
            <div className='spotsContainer'>
                {spots.map(spot => (
                    <div className='spotCard' key={spot.id}>
                        <img src={spot.previewImage}></img>

                        <div className='locationStars'>
                            <div>{`${spot.city}, ${spot.state}`}</div>
                            <div>
                                <img src={star}></img>
                                {!isNaN(parseInt(spot.avgRating)) && <div>{`${spot.avgRating}`}</div>}
                            </div>
                        </div>

                        <div>
                            {`$${spot.price}`}
                        </div>

                    </div>
                ))}
            </div>
        </>
    )
}

