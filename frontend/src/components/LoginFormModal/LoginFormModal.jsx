import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

    // console.log('credential', credential)
    // console.log('password', password)
    // console.log(Object.keys(errors).length)
    //test comment

    useEffect( () => {
      let errorObj = {}

        if (credential.length < 4) errorObj.credential = 'Credential must be at least 4 characters'

        if (password.length < 6) errorObj.password = 'Password must be at least 6 characters'

      setErrors(errorObj)
    }, [setErrors, credential, password])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        console.log('data inside on submit', data.message)
        if (data && data.message === 'Invalid credentials') {
          setErrors({
            invalidCredentials: data.message
          });

        }
      });
  };

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        {errors.password && <p>{errors.password}</p>}
        {errors.invalidCredentials && <p>{errors.invalidCredentials}</p>}

        <button 
        type="submit"
        disabled={Object.keys(errors).length > 0 && !errors.invalidCredentials}
        >
          Log In
        </button>
      </form>
    </>
  );
}

export default LoginFormModal;
