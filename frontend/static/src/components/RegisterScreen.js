import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';


function Register({ setAuthorization, setUserName }) {

  const [state, setState] = useState({
        username: '',
        password1: '',
        password2: '',
        email: ''
        })
    
    const handleInput = (e) => {
        const { name, value } = e.target

        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));

    }

    const handleError = (err) => {
        console.log(err);
    }

    const handleSubmit = async e => {
        e.preventDefault();

        if (state.password1 === state.password2) {

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
                body: JSON.stringify(state),
            };

            const response = await fetch("/rest-auth/registration/", options).catch(
                handleError
            );

            if (!response.ok) {
                throw new Error('Network response not ok');
            } else {
                const data = await response.json();
                Cookies.set("Authorization", `Token ${data.key}`);
                setAuthorization(true);
                setUserName(state.username)
            }
        } else {
            alert('passwords must match');
        }
    }

    
    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Label htmlFor='username'>Username</Form.Label>
                <Form.Control
                    type="text"
                    id="username"
                    name='username'
                    onChange={handleInput}
                    required
                    value={state.username}
                />
                <Form.Label htmlFor='email'>Email</Form.Label>
                <Form.Control
                    type='email'
                    id='email'
                    name='email'
                    required
                    onChange={handleInput}
                    value={state.email}
                />
                <Form.Label htmlFor='password'>Password</Form.Label>
                <Form.Control
                    type="password"
                    id="password1"
                    name='password1'
                    onChange={handleInput}
                    required
                    value={state.password1}
                />
                <Form.Label htmlFor='password'>Please type your password again</Form.Label>
                <Form.Control
                    type="password"
                    id="password2"
                    name='password2'
                    onChange={handleInput}
                    required
                    value={state.password2}
                />
                <Button type='submit'>Create Account</Button>
            </Form>
        </div>
    )
}

export default Register