import { useEffect, useState } from "react"
import { csrfFetch } from "../../store/csrf"
import './CreateSpot.css'
import { useNavigate } from "react-router-dom"


export const CreateSpot = () => {
    const navigate = useNavigate()
    const [country, setCountry] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [description, setDescription] = useState('')
    const [name, setName] = useState('')
    const [validations, setValidations] = useState({})
    const [price, setPrice] = useState(0)
    const [imageOne, setImageOne] = useState('')
    const [imageTwo, setImageTwo] = useState('')
    const [imageThree, setImageThree] = useState('')
    const [imageFour, setImageFour] = useState('')
    const [imageFive, setImageFive] = useState('')


    useEffect(() => {
        let errorObj = {}

        //so many form validations
        if (address.length === 0) errorObj.address = 'Address is required'
        if (country.length === 0) errorObj.country = 'Country is required'
        if (city.length === 0) errorObj.city = 'City is required'
        if (state.length === 0) errorObj.state = 'State is required'
        if (description.length < 30) errorObj.description = errorObj.description = 'Description needs a minimum of 30 characters'
        if (name.length === 0) errorObj.name = 'Name is required'
        if (price === '' || parseInt(price) <= 0) errorObj.price = 'Price is required'
        if (!imageOne.endsWith('.jpg') && !imageOne.endsWith('.jpeg') && !imageOne.endsWith('.png')) errorObj.imageOne = 'Image URL must end in .png, .jpg, or .jpeg'
        if (imageOne === '') errorObj.imageOne = 'Preview image is required'
        if (imageTwo.length > 0 && !imageTwo.endsWith('.jpg') && !imageTwo.endsWith('.jpeg') && !imageTwo.endsWith('.png')) errorObj.imageTwo = 'Image URL must end in .png, .jpg, or .jpeg'
        if (imageThree.length > 0 && !imageThree.endsWith('.jpg') && !imageThree.endsWith('.jpeg') && !imageThree.endsWith('.png')) errorObj.imageThree = 'Image URL must end in .png, .jpg, or .jpeg'
        if (imageFour.length > 0 && !imageFour.endsWith('.jpg') && !imageFour.endsWith('.jpeg') && !imageFour.endsWith('.png')) errorObj.imageFour = 'Image URL must end in .png, .jpg, or .jpeg'
        if (imageFive.length > 0 && !imageFive.endsWith('.jpg') && !imageFive.endsWith('.jpeg') && !imageFive.endsWith('.png')) errorObj.imageFive = 'Image URL must end in .png, .jpg, or .jpeg'

        setValidations(errorObj)
    }, [setValidations, address, country, city, state, description, name, price, imageOne, imageTwo, imageThree, imageFour, imageFive])

    const submitForm = async (e) => {
        e.preventDefault()

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
                method:'POST',
                body: JSON.stringify({
                    url: imageOne,
                    preview: true
                })
            })

                //complete other fetches if user submits more than preview image
                if (imageTwo.length > 1) {
                    await csrfFetch(path, {
                        method:'POST',
                        body: JSON.stringify({
                            url: imageTwo,
                            preview: true
                        })
                    })
                }

                if (imageThree.length > 1) {
                    await csrfFetch(path, {
                        method:'POST',
                        body: JSON.stringify({
                            url: imageThree,
                            preview: true
                        })
                    })
                }

                if (imageFour.length > 1) {
                    await csrfFetch(path, {
                        method:'POST',
                        body: JSON.stringify({
                            url: imageFour,
                            preview: true
                        })
                    })
                }

                if (imageFive.length > 1) {
                    await csrfFetch(path, {
                        method:'POST',
                        body: JSON.stringify({
                            url: imageTwo,
                            preview: true
                        })
                    })
                }

                navigate(`/spots/${trueRes.id}/`)
            
        } catch (e) {
            console.log(e)
            alert('this spot already exists!')
        } 
    }

    return (
        <div className="create-spot-form-container">
            <form
                className="create-spot-form"
                onSubmit={e => submitForm(e)}
            >
                <h2>Create a new Spot</h2>
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
                {validations.country && <p className='validation-error'>{validations.country}</p>}
                <label>
                    Street Address
                    <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                    />
                </label>
                {validations.address && <p className='validation-error'>{validations.address}</p>}
                <label>
                    City
                    <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                    />
                </label>
                {validations.city && <p className='validation-error'>{validations.city}</p>}
                <label>
                    State
                    <input
                        type="text"
                        value={state}
                        onChange={e => setState(e.target.value)}
                    />
                </label>
                {validations.state && <p className='validation-error'>{validations.state}</p>}
                
                <p>------------------------------------------------------</p>
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood</p>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                {validations.description && <p className='validation-error'>{validations.description}</p>}
                <p>------------------------------------------------------</p>
                <h3>Create a title for your spot</h3>
                <p>Catch guests attention with a spot title that highlights what makes your place special.</p>
                    <input 
                        type="text"
                        placeholder="Name of your spot"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                {validations.name && <p className='validation-error'>{validations.name}</p>}
                <label></label>

                <p>------------------------------------------------------</p>
                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
                    <input 
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                {validations.price && <p className='validation-error'>{validations.price}</p>}
                <p>------------------------------------------------------</p>
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                    <input 
                        type="text"
                        value={imageOne}
                        placeholder="Preview Image URL"
                        onChange={e => setImageOne(e.target.value)}
                    />
                {validations.imageOne && <p className='validation-error'>{validations.imageOne}</p>}
                    <input
                        type="text"
                        value={imageTwo}
                        placeholder="Image Url"
                        onChange={e => setImageTwo(e.target.value)}
                    />
                {validations.imageTwo && <p className='validation-error'>{validations.imageTwo}</p>}
                    <input 
                        type="text"
                        value={imageThree}
                        placeholder="Image Url"
                        onChange={e => setImageThree(e.target.value)}
                    />
                {validations.imageThree && <p className='validation-error'>{validations.imageThree}</p>}
                    <input 
                        type="text"
                        value={imageFour}
                        placeholder="Image Url"
                        onChange={e => setImageFour(e.target.value)}
                    />
                {validations.imageFour && <p className='validation-error'>{validations.imageFour}</p>}
                    <input 
                        type="text"
                        value={imageFive}
                        placeholder="Image Url"
                        onChange={e => setImageFive(e.target.value)}
                    />
                {validations.imageFive && <p className='validation-error'>{validations.imageFive}</p>}
                <button
                    type="submit"
                    disabled={Object.keys(validations).length > 0}
                >
                    Submit spot
                </button>

            </form>
        </div>

    )
}