import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSpotsThunk } from "../../store/spots"
import './Spots.css'
// import '../../../public/'


export function Spots() {
    const dispatch = useDispatch()
    const stateData = useSelector(state => state.spots)
    let spots = []

    

    for (const spot in stateData) {
        spots.push(stateData[spot])
    }
    // console.log('spoooooots',spots)

    // console.log('STAAAAAAA',stateData)


    useEffect(() => {
        dispatch(getSpotsThunk())
    }, [dispatch])

    return (
        <>
            <h3>will this reder</h3>
            <div>{stateData.wow}</div>
            <button>get spots!</button>
            <div className='spotsContainer'>
                {spots.map(spot => (
                    <div className='spotCard' key={spot.id}>
                        <img src='https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg'></img>

                        <div className='locationStars'>
                            <div>{`${spot.city}, ${spot.state}`}</div>
                            { !isNaN(parseInt(spot.avgRating)) && <div>{`${spot.avgRating}`}</div>}
                        </div>

                    </div>
                ))}
            </div>
        </>
    )
}

