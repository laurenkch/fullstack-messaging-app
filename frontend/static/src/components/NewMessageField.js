import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function NewMessageField({ submitNewMessage, message, setMessage}) {
    
    const handleInput = (e) => {

        const { value } = e.target

        setMessage((message) => ({
            ...message,
            'text': value,
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        submitNewMessage(message);
        setMessage({'text': ''});

    }

    return (

        <Form onSubmit={handleSubmit}>
            <Form.Label htmlFor='message'></Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                id='message'
                value={message.text}
                onChange={handleInput}
                required
                autoComplete='off'
                className='message-textarea'
            />
            <Button type='submit'>Send</Button>
        </Form>
    )
}

export default NewMessageField;