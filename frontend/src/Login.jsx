import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { login } from './services/authService';

export default function Login() {
    const [data, setData] = useState({});

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await login(
                data.email,
                data.password
            );

            setUser(response.user);

            navigate("/", {
                replace: true
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleChange = (input, field) => {
        let value = input.target.value;
        setData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <div className='login'>
            <h1 className='mb-4'>Login</h1>
            <form onSubmit={handleLogin}>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email</label>
                    <input
                        type="email"
                        class="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        onChange={(e) => handleChange(e, "email")}
                    />
                </div>
                <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">Password</label>
                    <input
                        type="password"
                        class="form-control"
                        id="exampleInputPassword1"
                        onChange={(e) => handleChange(e, "password")}
                    />
                </div>
                <button type="submit" class="btn btn-primary">Accedi</button>
            </form>
        </div>
    )
}
