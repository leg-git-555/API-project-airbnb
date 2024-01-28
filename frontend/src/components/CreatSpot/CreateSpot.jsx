import { useEffect, useState } from "react"
import { csrfFetch } from "../../store/csrf"
import './CreateSpot.css'
import { useNavigate } from "react-router-dom"


export const CreateSpot = () => {
    const navigate = useNavigate()

    //slices of state use for controlled inputs
    const [country, setCountry] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [description, setDescription] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [imageOne, setImageOne] = useState('')
    const [imageTwo, setImageTwo] = useState('')
    const [imageThree, setImageThree] = useState('')
    const [imageFour, setImageFour] = useState('')
    const [imageFive, setImageFive] = useState('')
    //error handler slices 
    const [validations, setValidations] = useState({})
    const [submitBool, setSubmitBool] = useState(false)
 

    useEffect(() => {
        let errorObj = {}

        //so many form validations
        if (country.length === 0) errorObj.country = 'Country is required'
        if (address.length === 0) errorObj.address = 'Address is required'
        if (city.length === 0) errorObj.city = 'City is required'
        if (state.length === 0) errorObj.state = 'State is required'
        if (description.length < 30) errorObj.description = errorObj.description = 'Description needs a minimum of 30 characters'
        if (name.length === 0) errorObj.name = 'Name is required'
        if (price === '' || parseInt(price) <= 0) errorObj.price = 'Price is required'
        if (imageOne === '') errorObj.imageOne = 'Preview image is required'
        if (!imageOne.endsWith('.jpg') && !imageOne.endsWith('.jpeg') && !imageOne.endsWith('.png')) errorObj.imageOne = 'Image URL must end in .png, .jpg, or .jpeg'
        if (imageTwo.length > 0 && !imageTwo.endsWith('.jpg') && !imageTwo.endsWith('.jpeg') && !imageTwo.endsWith('.png')) errorObj.imageTwo = 'Image URL must end in .png, .jpg, or .jpeg'
        if (imageThree.length > 0 && !imageThree.endsWith('.jpg') && !imageThree.endsWith('.jpeg') && !imageThree.endsWith('.png')) errorObj.imageThree = 'Image URL must end in .png, .jpg, or .jpeg'
        if (imageFour.length > 0 && !imageFour.endsWith('.jpg') && !imageFour.endsWith('.jpeg') && !imageFour.endsWith('.png')) errorObj.imageFour = 'Image URL must end in .png, .jpg, or .jpeg'
        if (imageFive.length > 0 && !imageFive.endsWith('.jpg') && !imageFive.endsWith('.jpeg') && !imageFive.endsWith('.png')) errorObj.imageFive = 'Image URL must end in .png, .jpg, or .jpeg'

        setValidations(errorObj)
    }, [setValidations, address, country, city, state, description, name, price, imageOne, imageTwo, imageThree, imageFour, imageFive])

    const submitForm = async (e) => {
        e.preventDefault()
        setSubmitBool(true)

            if(Object.keys(validations).length > 0) {
                console.log('uhoh')
                return
            } else {
                
                try {
                    let res = await csrfFetch('/api/spots', {
                        method: 'POST',
                        body: JSON.stringify({
                            address,
                            country,
                            city,
                            state,
                            lat: 11,
                            lng: 10,
                            description,
                            name,
                            price: parseInt(price)
                        })
                    })
        
                    let trueRes = await res.json()
        
                    const path = `/api/spots/${trueRes.id}/images`
        
                    await csrfFetch(path, {
                        method: 'POST',
                        body: JSON.stringify({
                            url: imageOne,
                            preview: true
                        })
                    })
        
                    //complete other fetches if user submits more than preview image
                    if (imageTwo.length > 1) {
                        await csrfFetch(path, {
                            method: 'POST',
                            body: JSON.stringify({
                                url: imageTwo,
                                preview: true
                            })
                        })
                    }
        
                    if (imageThree.length > 1) {
                        await csrfFetch(path, {
                            method: 'POST',
                            body: JSON.stringify({
                                url: imageThree,
                                preview: true
                            })
                        })
                    }
        
                    if (imageFour.length > 1) {
                        await csrfFetch(path, {
                            method: 'POST',
                            body: JSON.stringify({
                                url: imageFour,
                                preview: true
                            })
                        })
                    }
        
                    if (imageFive.length > 1) {
                        await csrfFetch(path, {
                            method: 'POST',
                            body: JSON.stringify({
                                url: imageTwo,
                                preview: true
                            })
                        })
                    }
        
                    navigate(`/spots/${trueRes.id}/`)
        
                } catch (e) {
                    // console.log(e)
                    let trueE = await e.json()
                    console.log(trueE.message)
                    // alert(`${trueE.message}`)
                    setValidations({backend: trueE.message})

        
                    //fix this ugh
                }

            }

    }

    return (
        <div className="create-spot-form-container">
            <form
                className="create-spot-form"
                onSubmit={e => submitForm(e)}
            >
                <h2>Create a new Spot</h2>
                {submitBool && validations.backend && <h2 className="validation-error">{validations.backend}</h2>}
                <h3>{`Where's your place located?`}</h3>
                <h4>Guests will only get your exact address once they&apos;ve booked a reservation</h4>
                <label>
                    Country
                    <input
                        placeholder="Country"
                        type="text"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        >
                    </input>
                        {submitBool && validations.country && <p className='validation-error'>{validations.country}</p>}
                </label>
                <label>
                    Street Address
                    <input
                        placeholder="Address"
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                    />
                    {submitBool && validations.address && <p className='validation-error'>{validations.address}</p>}
                </label>
                <label>
                    City
                    <input
                        placeholder="City"
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                    />
                    {submitBool && validations.city && <p className='validation-error'>{validations.city}</p>}
                </label>
                <label className="form-bottom">
                    State
                    <input
                        placeholder="STATE"
                        type="text"
                        value={state}
                        onChange={e => setState(e.target.value)}
                    />
                    {submitBool && validations.state && <p className='validation-error'>{validations.state}</p>}
                </label>

                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood</p>
                <label className="form-bottom">
                    <textarea
                        placeholder="Please write at least 30 characters"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    {submitBool && validations.description && <p className='validation-error'>{validations.description}</p>}
                </label>

                <h3>Create a title for your spot</h3>
                <p>Catch guests attention with a spot title that highlights what makes your place special.</p>
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
                <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
                <label className="form-bottom">
                    <input
                        placeholder="Price per night (USD)"
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                {submitBool && validations.price && <p className='validation-error'>{validations.price}</p>}
                </label>
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <input
                    type="text"
                    value={imageOne}
                    placeholder="Preview Image URL"
                    onChange={e => setImageOne(e.target.value)}
                />
                {submitBool && validations.imageOne && <p className='validation-error'>{validations.imageOne}</p>}
                <input
                    type="text"
                    value={imageTwo}
                    placeholder="Image Url"
                    onChange={e => setImageTwo(e.target.value)}
                />
                {submitBool && validations.imageTwo && <p className='validation-error'>{validations.imageTwo}</p>}
                <input
                    type="text"
                    value={imageThree}
                    placeholder="Image Url"
                    onChange={e => setImageThree(e.target.value)}
                />
                {submitBool && validations.imageThree && <p className='validation-error'>{validations.imageThree}</p>}
                <input
                    type="text"
                    value={imageFour}
                    placeholder="Image Url"
                    onChange={e => setImageFour(e.target.value)}
                />
                {submitBool && validations.imageFour && <p className='validation-error'>{validations.imageFour}</p>}
                <input
                    type="text"
                    value={imageFive}
                    placeholder="Image Url"
                    onChange={e => setImageFive(e.target.value)}
                />
                {submitBool && validations.imageFive && <p className='validation-error'>{validations.imageFive}</p>}
                <button
                    type="submit"
                >
                    Create spot
                </button>

            </form>
        </div>

    )
}