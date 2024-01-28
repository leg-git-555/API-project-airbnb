import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { login } from '../../store/session';
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

  useEffect(() => {
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
        // console.log('data inside on submit', data.message)
        if (data && data.message === 'Invalid credentials') {
          setErrors({
            invalidCredentials: data.message
          });

        }
      });
  };

  return (
    <div className='login-form-container'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className='login-form-input-container'>
          <label>
            <input
              placeholder='Username or Email'
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
            {errors.credential && <p>{errors.credential}</p>}
          </label>
          <label>
            <input
              placeholder='password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p>{errors.password}</p>}
          </label>
        </div>
       
        {errors.invalidCredentials && <p>{errors.invalidCredentials}</p>}

        <button
          type="submit"
          disabled={Object.keys(errors).length > 0 && !errors.invalidCredentials}
        >
          Log In
        </button>
        <div onClick={() => {
              dispatch(login({credential: 'Declan-41', password: 'password2'}))
              closeModal()
              }}className='demo-user-login'>
          Demo User
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
