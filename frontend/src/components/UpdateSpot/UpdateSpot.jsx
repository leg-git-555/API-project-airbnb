import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { getSpotByIdThunk } from "../../store/spot"
import './UpdateSpot.css'
import { csrfFetch } from "../../store/csrf"


export function UpdateSpot() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const spot = useSelector(state => state.spot.spot)

    //slices of state, defaulted to store data
    const [country, setCountry] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [description, setDescription] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    //error handler slices of state
    const [validations, setValidations] = useState({})
    const [submitBool, setSubmitBool] = useState(false)


    useEffect(() => {
        dispatch(getSpotByIdThunk(id))
    }, [dispatch, id])

    useEffect(() => {
        if (spot.country) setCountry(spot.country)
        if (spot.address) setAddress(spot.address)
        if (spot.city) setCity(spot.city)
        if (spot.state) setState(spot.state)
        if (spot.description) setDescription(spot.description)
        if (spot.name) setName(spot.name)
        if (spot.price) setPrice(spot.price)

    }, [spot])

    useEffect(() => {
        let errorObj = {}

        if (country?.length === 0) errorObj.country = 'Country is required'
        if (address.length === 0) errorObj.address = 'Address is required'
        if (city.length === 0) errorObj.city = 'City is required'
        if (state.length === 0) errorObj.state = 'State is required'
        if (description.length < 30) errorObj.description = errorObj.description = 'Description needs a minimum of 30 characters'
        if (name.length === 0) errorObj.name = 'Name is required'
        if (price === '' || parseInt(price) <= 0) errorObj.price = 'Price is required'

        setValidations(errorObj)
    }, [setValidations, spot, country, address, city, state, description, name, price])

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitBool(true)

        if (Object.keys(validations).length > 0) {
            // console.log('uhoh')
            return
        } else {

            const path = `/api/spots/${id}`
            await csrfFetch(path, {
                method: 'PUT',
                body: JSON.stringify({
                    country,
                    address,
                    city,
                    state,
                    description,
                    name,
                    price: parseInt(price),
                    lat: 10,
                    lng: 10
                })
            })

            navigate(`/spots/${id}`)
        }
    }

    return (
        <>

            <form
                onSubmit={e => handleSubmit(e)}
                className="create-spot-form"
            >
                <h1>Update your Spot</h1>
                <h3>{`Where's your place located?`}</h3>
                <h4>Guests will only get your exact address once they&apos;ve booked a reservation</h4>
                <label>
                    Country
                    <input
                        type="text"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                    >
                    </input>
                </label>
                {submitBool && validations.country && <p className='validation-error'>{validations.country}</p>}
                <label>
                    Street Address
                    <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                    />
                </label>
                {submitBool && validations.address && <p className='validation-error'>{validations.address}</p>}
                <label>
                    City
                    <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                    />
                </label>
                {submitBool && validations.city && <p className='validation-error'>{validations.city}</p>}
                <label className="form-bottom">
                    State
                    <input
                        type="text"
                        value={state}
                        onChange={e => setState(e.target.value)}
                    />
                </label>
                {submitBool && validations.state && <p className='validation-error'>{validations.state}</p>}
                <h3>Describe your place to guests</h3>
                <h4>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood</h4>
                <label className="form-bottom">
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    {submitBool && validations.description && <p className='validation-error'>{validations.description}</p>}
                </label>
                <h3>Create a title for your spot</h3>
                <h4>{`Catch guests' attention with a spot title that highlights what makes your place special`}</h4>
                <label className="form-bottom">
                <input
                    type="text"
                    placeholder="Name of your spot"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                {submitBool && validations.name && <p className='validation-error'>{validations.name}</p>}
                </label>
                <h3>Set a base price for your spot</h3>
                <h4>Competitive pricing can help your listing stand out and rank higher in search results</h4>
                <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />
                {submitBool && validations.price && <p className='validation-error'>{validations.price}</p>}
                <button>
                    Update your Spot
                </button>

            </form>
        </>
    )
}