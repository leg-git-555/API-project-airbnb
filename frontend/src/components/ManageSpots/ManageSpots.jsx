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

        function updateClick (e) {
            e.stopPropagation()

            navigate(`/spots/${spot?.id}/edit`)
        }

    return (
        <>
            <h1>Manage Spots</h1>
            <button
                onClick={() => navigate('/spots/new')}
            >Create a New Spot</button>
            <div className="spotsContainer">
                {Spots.map(spot => (
        
                    
                        <div className='spotCard' key={spot.id} onClick={() => navigate(`/spots/${spot.id}`)}>

                            <div className="spot-card-img-container">

                            <img src={spot.previewImage}></img>
                            </div>

                            <div className='locationStars'>
                                <div>{`${spot.city}, ${spot.state}`}</div>
                                <div className="starContainer">
                                    <img src={star}></img>
                                    {!isNaN(parseInt(spot.avgRating)) && <div>{`${spot.avgRating?.toFixed(1)}`}</div>}
                                </div>

                            </div>
                            <div>
                                {`$${spot.price} night`}
                            </div>
                            <div className="manage-spots-button-container" key={spot.id}>
                                <button onClick={(e) => {
                                    e.stopPropagation()
                                    return navigate(`/spots/${spot?.id}/edit`)
                                }}>update</button>
                                <button onClick={e => e.stopPropagation()}>
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