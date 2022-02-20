import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Cookies from 'js-cookie';


function ThreadList({ setThreadSelection, loadMessages }) {

    const [threads, setThreads] = useState(null)
    const [creatingThread, setCreatingThread] = useState(null)
    const [threadName, setThreadName] = useState('');

    const handleError = (err) => {
        console.warn(err);
    }

   useEffect(() => {
        const getThreads = async () => {
            const response = await fetch('/api/v1/threads/').catch(handleError);
            if (!response.ok) {
                throw new Error('Network response was not OK!');
            } else {
                const data = await response.json();
                setThreads(data);
            }
        }
       getThreads();
   }, [])
    
    const handleInput = (e) => {
        e.preventDefault();
        setThreadName(e.target.value)
    }

    const addThread = async e => {
        e.preventDefault();

        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({ 'name' : threadName}),
        } 

        const response = await fetch(`/api/v1/threads/`, options).catch
            (handleError);
        
        if (!response.ok) {
            throw new Error("Network response was not OK")
        }

        setThreads([...threads, { 'name': threadName }])
        setThreadName('');        
        setCreatingThread(null);
    }

    const makeNewThread = (e) => {
        e.preventDefault();
        setCreatingThread(true);
    }

    const changeThreadView = (e) => {
        e.preventDefault();
        setThreadSelection(e.target.value)
        loadMessages(e.target.value);
    }

    if (!threads) {
        return 'Fetching threads...'
    }
    const threadsHTML = threads.map((thread) => (
        <li key={thread.id}>
            <Button type='button' value={thread.id } onClick={changeThreadView} >{thread.name}</Button>
        </li>
    ))

    return (
        <div>
            <ul>
                {threadsHTML}
            </ul>
            {!creatingThread ? <Button type='button' onClick={makeNewThread}>Create new thread</Button> :
                <Form onSubmit={addThread}>
                    <Form.Label htmlFor='thread name'>Name</Form.Label>
                    <Form.Control
                        type='text'
                        id='thread name'
                        name='name'
                        value={threadName}
                        required
                        onChange={handleInput}
                    />
                    <Button type='submit'>Add</Button>
                </Form>
            }
        </div>

    )
}

export default ThreadList