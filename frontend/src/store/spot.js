import { csrfFetch } from "./csrf";

//action type
const SPOT_BY_ID = 'spot/GET_SPOT_BY_ID'

//action creator
export const SpotById = (payload) => {
    return {
        type: SPOT_BY_ID,
        payload
    }
    
}

//thunk creator
export const getSpotByIdThunk = (id) => async (dispatch) => {
    try {
        const path = `/api/spots/${id}`
    
        let res = await csrfFetch(path)
        let spot = await res.json()
        
        // console.log(spot)
        dispatch(SpotById(spot))
        
    } catch (e) {
        //const error = await e.json()
        // console.log(error)
    }

}

const initialState = {spot: {}}

//singleSpotReducer
export function singleSpotReducer (state = initialState, action) {
    
    switch(action.type) {
        case SPOT_BY_ID: {
            return {...state, spot: action.payload}
        }
        default: 
            return state
    }
}