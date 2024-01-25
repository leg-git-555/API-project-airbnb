
import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { csrfFetch } from "../../store/csrf"
import { removeACurrentSpot } from "../../store/currentSpots"


export function DeleteSpotModal ({id}) {
    const dispatch = useDispatch()
    const {closeModal} = useModal()
   

    async function deleteClick () {
        const path = `/api/spots/${id}`
        
        await csrfFetch(path, {
            method: 'DELETE'
        })

        dispatch(removeACurrentSpot(id))
        

        closeModal()
    }


    return (
        <>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button onClick={() => deleteClick()}>{`Yes (Delete Spot)`}</button>
            <button onClick={() => closeModal()}>{`No (Keep Spot)`}</button>
        </>
    )
}