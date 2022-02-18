import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';


function Register(props) {

    const [state, setState] = useState({
        username: '',
        password: '',
        email: ''
        })
    
    const handleInput = (e) => {
        e.preventDefault();
        setState(state[e.target.name] = e.target.value)
    }

    const handleError = (err) => {
        console.log(err);
    }

    const handleSubmit = async e => {
        e.preventDefault();

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify(state),
        };

        const response = await fetch("/rest-auth/registration", options).catch(
            handleError
        );

        if (!response.ok) {
            throw new Error('Network response not ok');
        } else {
            const data = await response.json();
            Cookies.set("Authorization", `Token ${data.key}`);
            props.setAuth(true);
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
                    id="password"
                    name='email'
                    onChange={handleInput}
                    required
                    value={state.password}
                />
                <Button type='submit'>Create Account</Button>
            </Form>
        </div>
    )
}

export default Register