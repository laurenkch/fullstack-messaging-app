import NewMessageField from './NewMessageField';
import Button from 'react-bootstrap/Button';

function ThreadDetailView({ messages }) {

    if (!messages) {
        return <div>Fetching messages...</div>
    }

    console.log(messages);
    const messageHTML = messages.map((message) => <div>{message.text}<Button type='button' value={message.id}>Edit</Button><Button type='button' value={message.id}>Delete</Button></div>)

    return (
        <div>{messageHTML}<NewMessageField/></div>
    )
}

export default ThreadDetailView