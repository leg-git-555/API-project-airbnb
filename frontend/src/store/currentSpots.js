import { csrfFetch } from "./csrf";


//action type
const GET_CURRENT_SPOTS = 'currentSpots/GET_CURRENT_SPOTS'

//action creator
const getCurrentSpots = (payload) => {
    // console.log('inside get current spots action')
    return {
        type:GET_CURRENT_SPOTS,
        payload
    }
}

//thunk creator
export const getCurrentSpotsThunk = () => async (dispatch) => {
    // console.log('inside get current spots thunk')

    try {
        const res = await csrfFetch('/api/spots/current')
        let spots = await res.json()
        console.log(spots)
        dispatch(getCurrentSpots(spots))

    } catch (err) {
        await err.json()
        //maybe do something with this error
    }


}

const initialState = { Spots: []}

export function currentSpotsReducer (state = initialState, action) {

    switch(action.type) {
        case GET_CURRENT_SPOTS: {
            // console.log('inside switch case')
            return {...state, Spots: action.payload.Spots}
        }
        default:
            return state
    }


}