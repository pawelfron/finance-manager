import { FormEventHandler, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import './Login.css'
import { AuthContext } from "../AuthContext";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { isLoggedIn, login } = useContext(AuthContext);

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/dashboard');
        }
    }, [isLoggedIn]);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        const success = await login(username, password);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <form className="login-form mx-auto mt-5 p-2" onSubmit={handleSubmit}>
            <h3>Login to finance manager:</h3>
            <div className="m-1">
                <label htmlFor="username" className="form-label">Username:</label>
                <input id="username" type="text" className="form-control" value={username} placeholder="Username" onChange={e => setUsername(e.target.value)}/>
            </div>

            <div className="m-1">
                <label htmlFor="password" className="form-label">Password:</label>
                <input id="password" type="password" className="form-control" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)}/>
            </div>


            <input type="submit" value="Login" className="btn btn-primary m-1"/>
        </form>
    )
}

export default Login;