import ThreadView from './components/ThreadPageOutline';
import LoginAndRegister from './components/LoginAndRegisterView';
import Cookies from 'js-cookie';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';

import './App.css';

function App() {

  const [auth, setAuth] = useState(!!Cookies.get('Authorization'))

  const handleError = (err) => {
    console.warn(err);
  }

  const handleLogout = async e => {
    e.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      }
    };

      const response = await fetch("/rest-auth/logout/", options).catch(
        handleError
      );

      if (!response.ok) {
        throw new Error("Network response not ok");
      } else {
        Cookies.remove("Authorization");
        setAuth(false);
      }

    }

  return (
    <div className="App">
      {auth &&
        <div className='header'>
        <Button className='logout-button' onClick={handleLogout}>Logout
          </Button>
        </div>
      }
      {auth ? <ThreadView/> : <LoginAndRegister setAuth={setAuth}/>}
    </div>
  );
}

export default App;
