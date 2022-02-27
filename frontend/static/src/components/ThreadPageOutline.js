import ThreadList from './ThreadList';
import ThreadDetailView from './ThreadDetailView';
import { useState, useRef } from 'react';

function ThreadView() {
    
    const [threadSelection, setThreadSelection] = useState(null)

             
    return (
        <div className = 'wrapper'>
            <ThreadList setThreadSelection={setThreadSelection}/>
            {threadSelection && <ThreadDetailView threadSelection={threadSelection} /> }
        </div>
    )
}

export default ThreadView