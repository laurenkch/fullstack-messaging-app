import NewMessageField from './NewMessageField';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import { useState, useEffect, useRef } from 'react';

function ThreadDetailView({threadSelection }) {

    ////////////////////////////////////////////////////////////////////////////LOAD MESSAGES

    const [messages, setMessages] = useState(null)
    const [message, setMessage] = useState({
        text: '',
        username: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleError = (err) => {
        console.warn(err);
    }

    const loadMessages = async () => {
        const response = await fetch(`/api/v1/threads/${threadSelection}/messages/`).catch(handleError);
        if (!response.ok) {
            throw new Error("Network response was not OK");
        } else {
            const data = await response.json();
            setMessages(data)
        }
    };

    let intervalID = useRef();

    useEffect(() => {
        loadMessages();
        if (intervalID.current) {
            clearInterval(intervalID.current)
        }
        intervalID.current = setInterval(() => loadMessages(), 10000);

    }, [threadSelection])

    ////////////////////////////////////////////////////////////////////////////ADD MESSAGE

    const submitNewMessage = async (message) => {

        if (isEditing) {
            editMessage()
        } else {
            const options = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
                body: JSON.stringify({ 'text': message.text, 'thread': threadSelection }),
            };
            const response = await fetch(`/api/v1/threads/${threadSelection}/messages/`, options).catch(handleError);

            if (!response.ok) {
                throw new Error('Network response not ok');
            }
            const data = await response.json();
            setMessages([...messages, data])
        };
    };
    
        ////////////////////////////////////////////////////////////////////////////EDIT MESSAGE

    const editMessage = async () => {
        console.log(message.text)
        const pk = message.id
        console.log(pk);

        const options = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({...message }),
        };

        const response = await fetch(`/api/v1/threads/${threadSelection}/messages/${pk}`, options).catch(handleError)

        if (!response.ok) {
            throw new Error('Network was not ok');
        }

    const newMessages = messages.map((item) => {
        if (item.id == pk) {
            return { ...message }
        } else {
            return { ...item }
        }
    })
        setMessages(newMessages);
    }

    const enableEditMode = (e) => {
        e.preventDefault();
        const editID = parseInt(e.target.value)
        setIsEditing(true);
        setMessage(messages.find((message) => message.id === editID))
    }
        ////////////////////////////////////////////////////////////////////////////DELETE MESSAGE

    const deleteMessage = (e) => {
        e.preventDefault();
        const pk = e.target.value;

        const pushDelete = async () => {

            const options = {
                method: "DELETE",
                headers: {
                    'content-type': "application/json",
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            }

            const response = await fetch(`/api/v1/threads/${threadSelection}/messages/${pk}`, options).catch(handleError)
            if (!response.ok) {
                throw new Error('Network was not ok');
            }
        }
        pushDelete();
        const newMessages = messages.filter((item) => (item.id != pk))
        setMessages(newMessages)
    }

    if (!messages) {
        return <div>Fetching messages...</div>
    }

    const messageHTML = messages.map((item, index) =>
        <div key={index}>
            <div className="message-text">
                {item.text}
            </div>
            <div className='username'>
                {item.username}
            </div>
            <Button type='button' value={item.id} onClick = {enableEditMode}>Edit</Button>
            <Button type='button' value={item.id} onClick={deleteMessage}>Delete</Button>
        </div>)

    return (
        <div>
            {messageHTML}
            <NewMessageField
                className='new-message-field'
                submitNewMessage={submitNewMessage}
                message={message}
                setMessage={setMessage}
            />
        </div>
    )
}

export default ThreadDetailView