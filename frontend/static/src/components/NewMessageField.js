import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function NewMessageField({ submitNewMessage, username, message, setMessage}) {
    
    const handleInput = (e) => {
        setMessage (e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        submitNewMessage(message, username);
        setMessage('');
    }

    return (

        <Form onSubmit={handleSubmit}>
            <Form.Label htmlFor='message'>Message</Form.Label>
            <Form.Control
                id='message'
                value={message.text}
                onChange={handleInput}
                required
                autoComplete='off'
            />
            <Button type='submit'>Send</Button>
        </Form>
    )
}

export default NewMessageField;