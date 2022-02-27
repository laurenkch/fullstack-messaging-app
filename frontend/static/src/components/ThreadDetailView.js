import NewMessageField from './NewMessageField';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons';

function ThreadDetailView({threadSelection }) {

    ////////////////////////////////////////////////////////////////////////////LOAD MESSAGES

    const [messages, setMessages] = useState(null)
    const [message, setMessage] = useState({
        text: '',
        username: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [messageToEdit, setMessageToEdit] = useState('');

    const handleError = (err) => {
        console.warn(err);
    }

    const loadMessages = async () => {
        const response = await fetch(`/api/v1/threads/${threadSelection.id}/messages/`).catch(handleError);
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

            const options = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
                body: JSON.stringify({ 'text': message.text, 'thread': threadSelection.id }),
            };
            const response = await fetch(`/api/v1/threads/${threadSelection.id}/messages/`, options).catch(handleError);

            if (!response.ok) {
                throw new Error('Network response not ok');
            }
            const data = await response.json();
            setMessages([...messages, data])
    };
    
        ////////////////////////////////////////////////////////////////////////////EDIT MESSAGE
    
    const enableEditMode = (item) => {
        setIsEditing(true);
        setMessageToEdit(item);
    }

    const handleInput = (e) => {

        const { value } = e.target

        setMessageToEdit((messageToEdit) => ({
            ...messageToEdit,
            'text': value,
        }));
    }

    const editMessage = async (e) => {
        e.preventDefault();
        const pk = messageToEdit.id

        const options = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({ ...messageToEdit }),
        };

        const response = await fetch(`/api/v1/threads/${threadSelection.id}/messages/${pk}`, options).catch(handleError)

        if (!response.ok) {
            throw new Error('Network was not ok');
        }

    const newMessages = messages.map((item) => {
        if (item.id == pk) {
            return { ...messageToEdit }
        } else {
            return { ...item }
        }
    })
        setMessages(newMessages);
        setIsEditing(false);
    }

        ////////////////////////////////////////////////////////////////////////////DELETE MESSAGE

    const deleteMessage = (message) => {
        const pk = message.id;

        const pushDelete = async () => {

            const options = {
                method: "DELETE",
                headers: {
                    'content-type': "application/json",
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            }

            const response = await fetch(`/api/v1/threads/${threadSelection.id}/messages/${pk}`, options).catch(handleError)
            if (!response.ok) {
                throw new Error('Network was not ok');
            }
        }
        pushDelete();
        const newMessages = messages.filter((item) => (item.id != pk))
        setMessages(newMessages)
    }


  //////////////////////////////////////////////////////////////////////DISPLAY LOGIC

    if (!messages) {
        return <div>Fetching messages...</div>
    }

    let editForm= '';
    if (isEditing) {
        editForm =
            <Form onSubmit={editMessage} key={messageToEdit.id}>
                <Form.Label htmlFor='new-message'></Form.Label>
                <Form.Control
                    id='message'
                    value={messageToEdit.text}
                    onChange={handleInput}
                    required
                    autoComplete='off'
                />
                <Button type='submit'>Edit</Button>
            </Form>
    }

    const messageForm = (self) =>
        <div key={self.id} className='message'>
            <Button type='button' className="delete-message" onClick={()=>deleteMessage(self)}><FontAwesomeIcon icon={faX} /></Button>
            <div>
                <div className='username'>
                    {self.username}
                </div>
                <div className="message-text" onClick={() => enableEditMode(self)}>
                    {self.text}
                </div>
            </div>
        </div>
    

    let messageHTML = '';
    if (isEditing) {

        messageHTML = messages.map((message) => message.id == messageToEdit.id ? editForm : messageForm(message))

    } else {

        messageHTML = messages.map((item, index) => (
            <div key={index} className='message'>
                <Button type='button' className="delete-message" onClick={()=>deleteMessage(item)}><FontAwesomeIcon icon={faX} /></Button>
                <div>
                    <div className='username'>
                        {item.username}
                    </div>
                    <div className="message-text" onClick={() => enableEditMode(item)}>
                        {item.text}
                    </div>
                </div>
            </div>
        ))
    }

    return (
        <div className='thread-display'>
            <div className='thread-title'>
                <h2>{threadSelection.name}</h2>
            </div>
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