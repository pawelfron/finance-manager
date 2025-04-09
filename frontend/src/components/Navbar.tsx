import { Link, useNavigate } from "react-router";
import api from "../api";

const Navbar = () => {
    const navigate = useNavigate();

    const logout = () => {
        const apiLogout = async () => {
            try {
                const refresh = localStorage.getItem('refresh-token');
                await api.post('/token/logout', { refresh });
                localStorage.removeItem('access-token');
                localStorage.removeItem('refresh-token');
                navigate('/');
            } catch (e) {
                console.log(e);
            }
        }
        
        apiLogout();
    }
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/content">Content</Link>
            <button onClick={logout}>Logout</button>
        </nav>
    )
};

export default Navbar;