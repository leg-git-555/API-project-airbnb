import { csrfFetch } from "./csrf"


//action type 
const GET_SPOTS = 'spots/GET_SPOTS'
const DELETE_SPOT = 'spots/DELETE_SPOT'

//action creator 
export const getSpots = (payload) => ({
    type: GET_SPOTS,
    payload
})

export const deleteSpotAction = (payload) => {
    console.log('inside action')
    return {
        type: DELETE_SPOT,
        payload
    }
}


//thunk creator
export const getSpotsThunk = () => async (dispatch) => {
    // console.log('inside get spots thunk')
    const response = await csrfFetch('/api/spots')
    let spots = await response.json()
    spots = spots.Spots //response is now an array of spots 

        let spotsObj = {}

            spots.forEach(spot => spotsObj[spot.id] = spot)



    dispatch(getSpots(spotsObj))
}

const initialState = {}

export function spotsReducer (state = initialState, action) {

    switch(action.type) {
        case GET_SPOTS: {

            return {...state, ...action.payload}
        } case DELETE_SPOT: {
            console.log('inside reducer', action.payload, state)
            let newState = {...state}
            delete newState[action.payload]
            return newState
        }
        default:
            return state
    }

}

