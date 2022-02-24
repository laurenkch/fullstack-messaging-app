import ThreadList from './ThreadList';
import ThreadDetailView from './ThreadDetailView';
import { useState, useRef } from 'react';

function ThreadView({ username }) {
    
    const [threadSelection, setThreadSelection] = useState(null)

             
    return (
        <div>
            <ThreadList setThreadSelection={setThreadSelection}/>
            {threadSelection && <ThreadDetailView threadSelection={threadSelection} username={username} /> }
        </div>
    )
}

export default ThreadView