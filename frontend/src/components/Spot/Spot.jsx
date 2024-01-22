import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSpotByIdThunk } from "../../store/spot"
import { useParams } from "react-router-dom"
import './Spot.css'


export function Spot () {
    const dispatch = useDispatch()
    const {spotId} = useParams()
    const {spot} = useSelector(state => state.spot)
    let spotImageRay = spot.SpotImages //without coniditional in return statement, page breaks
    

    useEffect(() => {
        dispatch(getSpotByIdThunk(spotId))
    }, [dispatch, spotId])

    return (

        <div>
            <h2>{spot.name}</h2>
            <h3>{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>
            <div className='singleSpotImageContainer'>
                <img src={spotImageRay && spotImageRay[0].url}></img> 
                <div className ='singleSpotImageContainerB'>
                <img src={spotImageRay && spotImageRay[0].url}></img>
                <img src={spotImageRay && spotImageRay[0].url}></img>
                <img src={spotImageRay && spotImageRay[0].url}></img>
                <img src={spotImageRay && spotImageRay[0].url}></img>
                </div>
            </div>
            <div className='singleSpotHostInfo'>
                <h3>{`Hosted by ${spot.Owner?.firstName} ${spot.Owner?.lastName}`}</h3>
            </div>
        </div>
    )
}