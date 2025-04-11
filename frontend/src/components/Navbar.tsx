import { Link, useNavigate } from "react-router";
import './Navbar.css'
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

const Navbar = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogoutButton = async () => {
        const success = await logout();
        if (success) {
            navigate('/');
        }
    }

    return (
        <nav className="navbar col-2 bg-primary-subtle p-3 align-items-start">
            <div className="nav flex-column">
                <div className="navbar-brand m-1">finance manager</div>

                <div className="row-cols">
                    { isLoggedIn ?
                        <button type='button' className="btn btn-secondary btn-sm m-1" onClick={handleLogoutButton}>Logout</button> :
                        <>
                            <Link to="/login" className="btn btn-primary btn-sm m-1">Login</Link>
                            <Link to="/register" className="btn btn-secondary btn-sm m-1">Register</Link>
                        </>
                    }
                </div>

                <Link to="/" className="nav-item nav-link m-1">Home</Link>
                <Link to="/dashboard" className="nav-item nav-link m-1">Dashboard</Link>
                <Link to="/table" className="nav-item nav-link m-1">Table</Link>
                <Link to="/categories" className="nav-item nav-link m-1">Categories</Link>
                <Link to="/analysis" className="nav-item nav-link m-1">Analysis</Link>
                <Link to="/account" className="nav-item nav-link m-1">Account</Link>
            </div>

        </nav>
    )
};

export default Navbar;