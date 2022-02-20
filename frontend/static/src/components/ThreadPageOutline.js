import ThreadList from './ThreadList';
import ThreadDetailView from './ThreadDetailView';
import { useState } from 'react';


function ThreadView({ username}) {
    
    const [threadSelection, setThreadSelection] = useState(null)
    const [messages, setMessages] = useState(null)

    const handleError = (err) => {
        console.warn(err);
    }


    const loadMessages = async (id) => {
        const response = await fetch(`/api/v1/threads/${id}/messages/`).catch(handleError);

        if (!response.ok) {
            throw new Error("Network response was not OK");
        } else {
            const data = await response.json();
            setMessages(data)
        }
    };

    return (
        <div>
            <ThreadList setThreadSelection={setThreadSelection} loadMessages={loadMessages}/>
            {threadSelection && <ThreadDetailView messages={messages} setMessages={setMessages} threadSelection={threadSelection} username={username}/> }
        </div>
    )
}

export default ThreadView