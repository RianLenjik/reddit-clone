import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import logo from '../images/lan.png';
import './Navbar.css';

export default function Navbar () {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        event.preventDefault(); // Prevent default action
        logout(); // Execute logout logic
        navigate('/'); // Redirect to login or another appropriate page
      };

    return (
        <nav className='app__navbar'>
            <a href="/" className='app__navbar_logo-link'>
                <div className='app__navbar-logo'>
                    <img src={logo} alt="logo" />
                </div>   
            </a>
            <div className='app__navbar-login_link p__opensans'>
                {isLoggedIn ? (
                    // Show logout option if user is logged in
                    <p><a href="/logout" onClick={handleLogout}>Logout</a></p>
                ) : (
                    // Show login link if user is not logged in
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                )}
            </div>
        </nav>
       
    )
}