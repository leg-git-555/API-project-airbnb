import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSpotByIdThunk } from "../../store/spot"
import { useParams } from "react-router-dom"
import './Spot.css'


export function Spot () {
    const dispatch = useDispatch()
    const {spotId} = useParams()
    const {spot} = useSelector(state => state.spot)
    let spotImageRay = spot.SpotImages
       console.log('spot img ray', spotImageRay)

    useEffect(() => {
        dispatch(getSpotByIdThunk(spotId))
    }, [dispatch, spotId])

    return (

        <div>
            <h3>{spot.name}</h3>
            <h4>{`${spot.city}, ${spot.state}, ${spot.country}`}</h4>
            <div className='singleSpotImageContainer'>
                <img src={spotImageRay && spotImageRay[0].url}></img>
                <div>well</div>
            </div>
        </div>
    )
}