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
    <div className='login-outer-wrapper'>
        {view === 'Login' ? <h2>Login Form</h2> : <h2>Register New Account</h2>}
        <div className='login-wrapper'>
            <div className="login-inner-wrapper">
                {view === 'Login' ? < Login setAuth={setAuth} /> : < Register setAuth={setAuth} />}

                {view === 'Login' ?
                    <button type="button" className="bottom-text" value="register" onClick={changeView}>Register a new account instead</button> :
                        <button type="button" className="bottom-text" value="Login" onClick={changeView}>Log in to an existing account instead</button>
                    }
            </div>
        </div>
    </div>
)
}

export default LoginAndRegister