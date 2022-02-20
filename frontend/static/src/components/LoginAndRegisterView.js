import { useState } from 'react';
import Login from './LoginScreen';
import Register from './RegisterScreen'
import Button from 'react-bootstrap/Button';

function LoginAndRegister({ setAuth }) {

    const [view, setView] = useState('Login')

    const changeView = (e) => {
        e.preventDefault();

        setView(e.target.value);
    }

    return (
        <div>
            {view === 'Login' ? <h2>Login Form</h2> : <h2>Register New Account</h2>}

            {view === 'Login' ? < Login setAuth={setAuth} /> : < Register setAuth={setAuth}/>}

            {view === 'Login' ?
                <Button type="button" value="register" onClick={changeView}>Click to register a new account instead</Button> :
                <Button type="button" value="Login" onClick={changeView}>Click to log in to an existing account instead</Button>
            }
        </div>
)
}

export default LoginAndRegister