import { FormEventHandler, useState } from "react";
import { useNavigate } from "react-router";
import api from "../api";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/token', { username, password });
            const { access, refresh } = response.data;
            localStorage.setItem('access-token', access);
            localStorage.setItem('refresh-token', refresh);
            navigate('/content');
        } catch (error) {
            console.log('Login Failed');
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} placeholder="username" onChange={e => setUsername(e.target.value)}/>
                <input type="password" value={password} placeholder="password" onChange={e => setPassword(e.target.value)}/>
                <input type="submit" value="Submit"/>
            </form>
        </>
    )
}

export default Login;