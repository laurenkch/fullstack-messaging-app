import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Cookies from 'js-cookie';


function ThreadList({ threadSelection, setThreadSelection, startLoading}) {

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
    }

    const makeNewThread = (e) => {
        e.preventDefault();
        setIsCreatingThread(true);
    }

//////////////////////////////////////////////////////////////////////////////// EDIT PRE-EXISTING THREAD

    const clickEditThread = (e) => {
        setIsEditing(true);
        let pk = e.target.value
        const thread = threads.find((thread) => (thread.id == pk))
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
        const newThreadDetails = await response.json();
        const index = threads.indexOf((thread) => thread.id === newThreadDetails.id);
        const newthreadlist =threads.splice(index, 1, newThreadDetails)
        console.log(newthreadlist)
        setIsEditing(false);
    }

//////////////////////////////////////////////////////////////////////////////// DELETE THREAD
    
    const deleteThread = (e) => {
        e.preventDefault();
        const id = e.target.value;

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
        const index = threads.indexOf((item) => item.id === id)
        const newThreadList = threads
        newThreadList.splice(index, 1)
        setThreads(newThreadList)

        // this works, but doesn't seem to update the display. not sure why setThreads isn't re-rendering the components at the moment. 
    }

 //////////////////////////////////////////////////////////////////////////////// THREAD NAVIGATION

    const changeThreadView = (e) => {
        e.preventDefault();
        setThreadSelection(e.target.value)
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
                    <Form.Label htmlFor='thread name'>Name</Form.Label>
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
        <Button type='button' value={self.id} onClick={changeThreadView} >{self.name}</Button>
        <Button type='button' value={self.id} id='edit name' onClick={clickEditThread}>
            Edit Thread Name
        </Button>
        <Button type='button' value={self.id} id='delete thread'>
            Delete Thread
        </Button>
    </li>

    let threadsHTML = '';
    if (isEditing) {

        threadsHTML = threads.map((thread) => thread.id == threadToEdit.id ? editForm : threadForm(thread))

    } else {

        threadsHTML = threads.map((thread) => (
            <li key={thread.id}>
                <Button type='button' value={thread.id} onClick={changeThreadView} >{thread.name}</Button>
                <Button type='button' value={thread.id} id='edit name' onClick={clickEditThread}>
                    Edit Thread Name
                </Button>
                <Button type='button' value={thread.id} id='delete thread' onClick={deleteThread}>
                    Delete Thread
                </Button>
            </li>
        ))
    }

    return (
        <div>
            <ul>
                {threadsHTML}
            </ul>
            {!isCreatingThread ? <Button type='button' onClick={makeNewThread}>Create new thread</Button> :
                <Form onSubmit={addThread}>
                    <Form.Label htmlFor='thread name'>Name</Form.Label>
                    <Form.Control
                        type='text'
                        id='thread name'
                        name='name'
                        value={threadToEdit.name}
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