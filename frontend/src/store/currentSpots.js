import { csrfFetch } from "./csrf";


//action type
const GET_CURRENT_SPOTS = 'currentSpots/GET_CURRENT_SPOTS'
const REMOVE_A_CURRENT_SPOT = 'currentSpots/REMOVE_A_CURRENT_SPOT'

//action creator
const getCurrentSpots = (payload) => {
    // console.log('inside get current spots action')
    return {
        type:GET_CURRENT_SPOTS,
        payload
    }
}

export const removeACurrentSpot = (payload) => {
    // console.log('inside removeCurrent Spot action crator')
    return {
        type: REMOVE_A_CURRENT_SPOT,
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
            
            return {...state, Spots: action.payload.Spots}
        }
        case REMOVE_A_CURRENT_SPOT: {
            let newState = []

                state.Spots.forEach(el => {
                    if (el.id !== action.payload) newState.push(el)
                })
           
            return {...state, Spots: newState }
        }
        default:
            return state
    }


}