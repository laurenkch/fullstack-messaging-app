import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Cookies from 'js-cookie';


function ThreadList() {

    const [threads, setThreads] = useState(null)
    const [newThread, setNewThread] = useState(null)
    const [threadName, setThreadName] = useState('');

    const handleError = (err) => {
        console.warn(err);
    }

   useEffect(() => {
        const getThreads = async () => {
            const response = await fetch('/api/v1/threads').catch(handleError);
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
        setNewThread(null);
    }

    const showNewThreadView = (e) => {
        e.preventDefault();
        setNewThread(true);
    }

    if (!threads) {
        return 'Fetching threads...'
    }
    const threadsHTML = threads.map((thread, index) => (
        <li key={thread.id}>
            {thread.name}
        </li>
    ))

    return (
        <div>
            <ul>
                {threadsHTML}
            </ul>
            {!newThread ? <Button type='button' onClick={showNewThreadView}>New thread</Button> :
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