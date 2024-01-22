import { csrfFetch } from "./csrf";

//action type
const REVIEWS_BY_ID = 'reviews/REVIEWS_BY_ID'


//action creator
export const ReviewsByIdAction = (payload) => {
    return {
        type: REVIEWS_BY_ID,
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

    }

}

const initialState = {
    Reviews: []
}
//reducer to update our review slice of state!
export function reviewsBySpotIdReducer (state = initialState, action) {

    switch(action.type) {
        case REVIEWS_BY_ID: {
            let newState = {...state, ...action.payload}
            return newState
        }
        default:
            return state

    }
}
