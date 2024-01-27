import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { csrfFetch } from "../../store/csrf"
import { deleteReviewByIdAction } from "../../store/reviews"




export function DeleteReviewModal({reviewId}) {
    const {closeModal} = useModal()
    const dispatch = useDispatch()

    async function deleteClick () {
        const path = `/api/reviews/${reviewId}`
        
        await csrfFetch(path, {
            method: 'DELETE'
        })
        dispatch(deleteReviewByIdAction(reviewId))

        closeModal()
    }

    return (
        <>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete this review?</p>
            <button className="delete-button" onClick={() => deleteClick()}>{`Yes (Delete Review)`}</button>
            <button className="keep-button" onClick={() => closeModal()}>{`No (Keep Review)`}</button>
        </>
    )
}