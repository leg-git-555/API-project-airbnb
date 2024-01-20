import { csrfFetch } from "./csrf"


//action type 
const GET_SPOTS = 'spots/GET_SPOTS'

//action creator 
export const getSpots = (payload) => ({
    type: GET_SPOTS,
    payload
})

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
            // console.log('inside spot reducer, get spots', action.payload)

            return {...state, ...action.payload}
        }
        default:
            return state
    }

}

