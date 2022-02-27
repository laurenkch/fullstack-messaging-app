import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faX, faPencil } from '@fortawesome/free-solid-svg-icons';

function ThreadList({ threadSelection, setThreadSelection}) {

    const INITIAL_STATE = {
        'id': '',
        'name': '',
    }

    const [threads, setThreads] = useState(null)
    const [isCreatingThread, setIsCreatingThread] = useState(false)
    const [threadToEdit, setThreadToEdit] = useState(INITIAL_STATE);
    const [isEditing, setIsEditing] = useState(false);

    const handleError = (err) => {
        console.warn(err);
    }

//////////////////////////////////////////////////////////////////////////////// GET THREADS

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
        setThreadToEdit(() => ({
            ...threadToEdit,
            'name': e.target.value,
        }));
    }

//////////////////////////////////////////////////////////////////////////////// ADD NEW THREAD

    const addThread = async e => {
        e.preventDefault();

        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({ 'name' : threadToEdit.name}),
        } 
        const response = await fetch(`/api/v1/threads/`, options).catch
            (handleError);
        
        if (!response.ok) {
            throw new Error("Network response was not OK")
        }
        let data = await response.json();
        setThreads([...threads, data])
        setThreadToEdit(INITIAL_STATE);        
        setIsCreatingThread(false);
        setThreadSelection(data);
    }

    // const makeNewThread = (e) => {
    //     e.preventDefault();
    //     setIsCreatingThread(true);
    // }

//////////////////////////////////////////////////////////////////////////////// EDIT PRE-EXISTING THREAD

    const clickEditThread = (thread) => {
        setIsEditing(true);
        setThreadToEdit(thread)
    }

    const editThreadName = async e => {
        e.preventDefault();
            const options = {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
                body: JSON.stringify({...threadToEdit}),
            }

            const response = await fetch(`/api/v1/threads/${threadToEdit.id}/`, options).catch
                (handleError);

            if (!response.ok) {
                throw new Error("Network response was not OK")
            }
        const newthread = await response.json();
        
        const item = threads.find((item) => item.id == newthread.id);
        const index = threads.indexOf(item);
        const copy = threads.slice()
        copy.splice(index, 1, newthread)
        setThreads(copy);
        setIsEditing(false);
    }

//////////////////////////////////////////////////////////////////////////////// DELETE THREAD
    
    const deleteThread = (thread) => {
        const id = thread.id;

        const pushDelete = async () => {

            const options = {
                method: "DELETE",
                headers: {
                    'content-type': "application/json",
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            }

            const response = await fetch(`/api/v1/threads/${id}/`, options).catch(handleError)
            if (!response.ok) {
                throw new Error('Network was not ok');
            }
        }
        pushDelete();
        const item = threads.find((item) => item.id == id);
        const index = threads.indexOf(item);
        const data = threads.slice()  
        data.splice(index, 1)
        setThreads(data);

        setThreadSelection('');

        // only added slice to this to make a new copy of the array, wouldn't re-render otherwise since the arrays were exactly equal. 
    };

 //////////////////////////////////////////////////////////////////////////////// THREAD NAVIGATION

    const changeThreadView = (thread) => {
        setThreadSelection(thread);

    }

 //////////////////////////////////////////////////////////////////////////////// DISPLAY LOGIC


    if (!threads) {
        return 'Fetching threads...'
    }

    let editForm = '';
    if (isEditing) {
         editForm =
            < li className='edit-form' key={threadToEdit.id}>
                <Form onSubmit={editThreadName}>
                    <Form.Label htmlFor='thread name'></Form.Label>
                    <Form.Control
                        type='text'
                        id='thread name'
                        name='name'
                        value={threadToEdit.name}
                        required
                        onChange={handleInput}
                    />
                    <Button type='submit'>Edit</Button>
                </Form>
            </li>
    }

    const threadForm = (self) => 
        <li key={self.id}>
        <Button type='button' value={self.id} disabled>{self.name}</Button>
    </li>

    let threadsHTML = '';
    if (isEditing) {

        threadsHTML = threads.map((thread) => thread.id == threadToEdit.id ? editForm : threadForm(thread))

    } else {

        threadsHTML = threads.map((thread) => (
            <li key={thread.id} className='thread'>
                <div>
                <Button type='button' className="delete-thread-name" id='delete thread' onClick={() => deleteThread(thread)}>
                    <FontAwesomeIcon icon={faX} />
                    </Button>
                </div>
                <div>
                <Button type='button' className="thread-name" onClick={() => changeThreadView(thread)} >{thread.name}</Button>
                <Button type='button' className="edit-thread-name" id='edit name' onClick={()=>clickEditThread(thread)}>
                    <FontAwesomeIcon icon={faPencil}/>
                </Button>
                </div>
            </li>
        ))
    }

    return (
        <div className='thread-list'>
            <ul>
                {threadsHTML}
            </ul>
            {!isCreatingThread ? <Button type='button' onClick={() => setIsCreatingThread(true)}><FontAwesomeIcon icon={faPlus}/></Button> :
                <Form onSubmit={addThread} className="new-thread-form">
                    <Form.Label htmlFor='thread name'>Name</Form.Label>
                    <Form.Control
                        type='text'
                        id='thread name'
                        name='name'
                        value={threadToEdit.name}
                        required
                        onChange={handleInput}
                    />
                    <div className='new-thread-buttons'>
                    <Button type='button' onClick={()=>setIsCreatingThread(false)}>Cancel</Button>
                    <Button type='submit'>Add</Button>
                    </div>
                </Form>
            }
        </div>

    )
}

export default ThreadList