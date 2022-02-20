import ThreadView from './components/ThreadPageOutline';
import LoginAndRegister from './components/LoginAndRegisterView';
import Cookies from 'js-cookie';

import { useState } from 'react';

import './App.css';

function App() {

  const [auth, setAuth] = useState(!!Cookies.get('Authorization'))

  return (
    <div className="App">
      {auth ? <ThreadView /> : <LoginAndRegister setAuth={setAuth}/>}
    </div>
  );
}

export default App;
