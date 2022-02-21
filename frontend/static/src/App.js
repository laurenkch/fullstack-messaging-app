import ThreadView from './components/ThreadPageOutline';
import LoginAndRegister from './components/LoginAndRegisterView';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';

import './App.css';

function App() {

  const [auth, setAuth] = useState(!!Cookies.get('Authorization'))
  const [username, setUsername] = useState('');

  const handleError = (err) => {
    console.warn(err);
  }

  useEffect(() => {
    const getUsername = async () => {
      const response = await fetch('/api/v1/threads/user/').catch(handleError);
      if (!response.ok) {
        throw new Error('Network response was not OK!');
      } else {
        const data = await response.text();
        setUsername(data);
      }
    }
    getUsername();
  }, [auth])

  const handleLogout = (e) => {
    e.preventDefault();


  }

  return (
    <div className="App">
      {auth &&
        <Button onClick={handleLogout}>Logout
        </Button>
      }
      {auth ? <ThreadView username={username}/> : <LoginAndRegister setAuth={setAuth} setUsername={setUsername}/>}
    </div>
  );
}

export default App;
