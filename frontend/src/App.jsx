import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation/Navigation-bonus';
import * as sessionActions from './store/session';
import logo from './alien_favicon.ico'
import { Spots } from './components/Spots/Spots';
import ProfileButton from './components/Navigation/ProfileButton-bonus';
import { Spot } from './components/Spot/Spot';
import { CreateSpot } from './components/CreatSpot/CreateSpot';

function Layout() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector(state => state.session.user);


  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <div className='header'>
        <h1>Alien-BnB</h1>
        <img src={logo} alt='alien logo' id='logo' onClick={() => { navigate('/') }}></img>
        <div id='authButtonContainer'>
          <ProfileButton user={sessionUser} />
        </div>
      </div>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}

    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Spots />
      },
      {
        path: 'login',
        element: <LoginFormPage />
      },
      {
        path: 'signup',
        element: <SignupFormPage />
      },
      {
        path: 'spots',
        element: <Spots />
      },
      {
        path: '/spots/:spotId',
        element: <Spot />
      },
      {
        path: '/createspot',
        element: <CreateSpot />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
