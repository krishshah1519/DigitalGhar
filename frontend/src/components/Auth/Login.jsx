import React ,{useState} from 'react';
import api from "../api/axiosConfig"
import {useNavigate} from "react-router-dom"

const Login = ()=>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const Navigate = useNavigate();
    
    const handleSubmit = ()=> {
        e.preventDefault();
        try{
            const response = api.post("/token/",{
                username,
                password
            });
            localStorage.setItem('accessToken',response.data.access);
            localStorage.setItem('refreshToken',response.data.refresh);
            navigate('/dashboard');
        }catch(err) {
            setError('Invalid username or passoword.');
        }
    };
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                type="text"
                placeholder="username"
                class=""
                value={username}
                onChange={(e)=> setUsername(e.target.value)}
                required
                />
                
                <input
                type="password"
                placeholder="password"
                class=""
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                />
                <button type="submit">Login</button>
                {error && <p style={{color:'red' }}>Error</p>}
            </form>
        </div>
    );
};

export default Login;