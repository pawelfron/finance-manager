import { FormEventHandler, useContext, useState } from "react";
import { useNavigate } from "react-router";
import api from "../api";
import './Register.css'
import { AuthContext } from "../AuthContext";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register', { username, email, password });

            const success = await login(username, password);
            if (success) {
                navigate('/dashboard');
            }
            // const response = await api.post('/token', { username, password });
            // const { access, refresh } = response.data;
            // localStorage.setItem('access-token', access);
            // localStorage.setItem('refresh-token', refresh);
            // navigate('/dashboard');
        } catch (e) {
            console.log('Register failed');
        }
    }
    return (
        <form className="register-form mx-auto mt-5 p-2" onSubmit={handleSubmit}>
            <h3>Register on finance manager:</h3>
            <div className="m-1">
                <label htmlFor="username" className="form-label">Username:</label>
                <input id="username" type="text" className="form-control" value={username} placeholder="Username" onChange={e => setUsername(e.target.value)}/>
            </div>

            <div className="m-1">
                <label htmlFor="email" className="form-label">Email:</label>
                <input id="email" type="email" className="form-control" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)}/>
            </div>

            <div className="m-1">
                <label htmlFor="password" className="form-label">Password:</label>
                <input id="password" type="password" className="form-control" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)}/>
            </div>


            <input type="submit" value="Register" className="btn btn-primary m-1"/>
        </form>
    )
}

export default Register;