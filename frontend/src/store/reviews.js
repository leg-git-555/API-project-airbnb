import { csrfFetch } from "./csrf";

//action type
const REVIEWS_BY_ID = 'reviews/REVIEWS_BY_ID'
const DELETE_REVIEW_BY_ID = 'reviews/DELETE_REVIEW_BY_ID'


//action creator
export const ReviewsByIdAction = (payload) => {
    return {
        type: REVIEWS_BY_ID,
        payload
    }
}

export const deleteReviewByIdAction = (payload) => {
    return {
        type: DELETE_REVIEW_BY_ID,
        payload
    }
}



//thunk creator
export const getReviewsByIdThunk = (id) => async (dispatch) => {
    try {

        const path = `/api/spots/${id}/reviews`
    
        let res = await csrfFetch(path)
        let reviews = await res.json()

            if (reviews) { //don't think the if block is necessary, trying to prevent errors
                dispatch(ReviewsByIdAction(reviews))
            }
    

    } catch (e) {
        //handle error here
    }

}

const initialState = {
    Reviews: []
}
//reducer to update our review slice of state!
export function reviewsBySpotIdReducer (state = initialState, action) {

    switch(action.type) {
        case REVIEWS_BY_ID: {
            let reviewRay = [...action.payload.Reviews]
            reviewRay.reverse()

            let newState = {...state, Reviews: reviewRay}
            return newState
        } case DELETE_REVIEW_BY_ID: {
            let newState = []
                state.Reviews.forEach(el => {
                    if (el.id !== action.payload) newState.push(el)
                })
            return {...state, Reviews: newState}
        }
        default:
            return state

    }
}
