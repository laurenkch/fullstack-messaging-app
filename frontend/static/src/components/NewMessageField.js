import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

function NewMessageField({ submitNewMessage}) {

    const [message, setMessage] = useState('');

    const handleInput = (e) => {
        setMessage (e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        submitNewMessage(message);
    }

    return (

        <Form onSubmit={handleSubmit}>
            <Form.Label htmlFor='message'>Message</Form.Label>
            <Form.Control
                id='message'
                value={message}
                onChange={handleInput}
                required
                autoComplete='off'
            />
            <Button type='submit'>Send</Button>
        </Form>
    )
}

export default NewMessageField;