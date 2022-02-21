import NewMessageField from './NewMessageField';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import { useState } from 'react';


function ThreadDetailView({ messages, setMessages, threadSelection, username }) {
    const [message, setMessage] = useState('');

    const handleError = (err) => {
        console.warn(err);
    }

    const submitNewMessage = async (message, username) => {

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

        setMessages([...messages, { 'text': message, 'username': username }])
    }

    const handleEdit = (e) => {
        e.preventDefault();
        const editID = parseInt(e.target.value)
        setMessage(messages.find((message) => message.id === editID))
    }

    if (!messages) {
        return <div>Fetching messages...</div>
    }

    const messageHTML = messages.map((message, index) =>
        <div key={index}>
            <div className="message-text">
                {message.text}
            </div>
            <div className='username'>
                {message.username}
            </div>
            <Button type='button' value={message.id} onClick = {handleEdit}>Edit</Button>
            <Button type='button' value={message.id}>Delete</Button>
        </div>)

    return (
        <div>{messageHTML}<NewMessageField submitNewMessage={submitNewMessage} username={username} message={message} setMessage={setMessage}/></div>
    )
}

export default ThreadDetailView