import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider, useNavigate, NavLink } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import SignupFormPage from './components/SignupFormPage';
// import Navigation from './components/Navigation/Navigation-bonus';
import * as sessionActions from './store/session';
import logo from './alien_favicon.ico'
import { Spots } from './components/Spots/Spots';
import ProfileButton from './components/Navigation/ProfileButton-bonus';
import { Spot } from './components/Spot/Spot';
import { CreateSpot } from './components/CreatSpot/CreateSpot';
import { ManageSpots } from './components/ManageSpots/ManageSpots';
import { UpdateSpot } from './components/UpdateSpot/UpdateSpot';

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

  //<Modal /> on line 42? Keep Modal provider wrapped around app?

  return (
    <>
      <div className='header'>
        <div className='logo-container'>
          <img src={logo} alt='alien logo' id='logo' onClick={() => { navigate('/') }}></img>
          <h1>BnB</h1>
        </div>
        <div id='authButtonContainer'>
          {sessionUser && <NavLink to="/spots/new">Create a New Spot</NavLink>}
          <ProfileButton user={sessionUser} />
        </div>
      </div>
      {/* <Navigation isLoaded={isLoaded} /> */}
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
        path: '/spots/new',
        element: <CreateSpot />
      },
      {
        path: '/spots/current',
        element: <ManageSpots />
      },
      {
        path: '/spots/:id/edit',
        element: <UpdateSpot />
      },
      {
        path: '*',
        element: <h2>Page not found</h2>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
