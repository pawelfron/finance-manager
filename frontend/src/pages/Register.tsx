import { FormEventHandler, useState } from "react";
import { useNavigate } from "react-router";
import api from "../api";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register', { username, email, password });
            const response = await api.post('/token', { username, password });
            const { access, refresh } = response.data;
            localStorage.setItem('access-token', access);
            localStorage.setItem('refresh-token', refresh);
            navigate('/content');
        } catch (e) {
            console.log('Register failed');
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} placeholder="username" onChange={e => setUsername(e.target.value)}/>
                <input type="email" value={email} placeholder="email" onChange={e => setEmail(e.target.value)}/>
                <input type="password" value={password} placeholder="password" onChange={e => setPassword(e.target.value)}/>
                <input type="submit" value="Submit"/>
            </form>
        </>
    )
}

export default Register;