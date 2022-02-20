import NewMessageField from './NewMessageField';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';

function ThreadDetailView({ messages, setMessages, threadSelection, username }) {

    const handleError = (err) => {
        console.warn(err);
    }


    console.log(username);
    
    const submitNewMessage = async (message) => {

        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({ 'text': message, 'thread': threadSelection }),
        };
        const response = await fetch(`/api/v1/threads/${threadSelection}/messages/`, options).catch(handleError);

        if (!response.ok) {
            throw new Error('Network response not ok');
        } 

        setMessages(...messages, message)

    }


    if (!messages) {
        return <div>Fetching messages...</div>
    }

    const messageHTML = messages.map((message) =>
        <div key={message.id}>
            <div className="message-text">
                {message.text}
            </div>
            <div className='username'>
                {message.username}
            </div>
            <Button type='button' value={message.id}>Edit</Button>
            <Button type='button' value={message.id}>Delete</Button>
        </div>)

    return (
        <div>{messageHTML}<NewMessageField submitNewMessage={submitNewMessage}/></div>
    )
}

export default ThreadDetailView