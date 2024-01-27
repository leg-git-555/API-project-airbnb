import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCurrentSpotsThunk } from "../../store/currentSpots"
import star from '../../star.ico'
import { useNavigate } from "react-router-dom"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"
import { DeleteSpotModal } from "../DeleteSpotModal/DeleteSpotModal"
import { getSpotsThunk } from "../../store/spots"



export function ManageSpots() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    let { Spots } = useSelector(state => state.currentSpots)
    useSelector(state => state.spots)
        

    useEffect(() => {
        dispatch(getCurrentSpotsThunk())
        dispatch(getSpotsThunk())
    }, [dispatch])

    return (
        <>
            <h1>Manage Your Spots</h1>
            <button
                onClick={() => navigate('/spots/new')}
            >Create a New Spot</button>
            <div className="spotsContainer">
                {Spots.map(spot => (
            
                        <div className='spotCard' key={spot.id}>

                            <div className="spot-card-img-container">

                            <img src={spot.previewImage} onClick={() => navigate(`/spots/${spot.id}`)}></img>
                            </div>

                            <div className='locationStars' onClick={() => navigate(`/spots/${spot.id}`)}>
                                <div>{`${spot.city}, ${spot.state}`}</div>
                                <div className="starContainer">
                                    <img src={star}></img>
                                    {!isNaN(parseInt(spot.avgRating)) && <div>{`${spot.avgRating?.toFixed(1)}`}</div>}
                                </div>

                            </div>
                            <div onClick={() => navigate(`/spots/${spot.id}`)}>
                                {`$${spot.price} night`}
                            </div>
                            <div className="manage-spots-button-container" key={spot.id}>
                                <button onClick={() => { navigate(`/spots/${spot.id}/edit`) }}>update</button>
                                <button>
                                    <OpenModalMenuItem 
                                        itemText="Delete"
                                        modalComponent={<DeleteSpotModal id={spot.id} />}
                                    />
                                </button>
                            </div>
                        </div>
            
                ))}

            </div>
        </>
    )
}