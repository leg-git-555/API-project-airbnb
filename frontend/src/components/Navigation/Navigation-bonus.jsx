
//comment in everything to move profile button back into nav

import { NavLink } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import ProfileButton from './ProfileButton-bonus'; moved to header
import './Navigation.css';

function Navigation({ isLoaded }) {
  // const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='navbar'>
      <li>
        tester nav element
      </li>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoaded && (
        <li>
          formerUserAuth
          {/* <ProfileButton user={sessionUser} /> */}
        </li>
      )}
    </ul>
  );
}

export default Navigation;
