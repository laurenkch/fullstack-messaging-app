import ThreadView from './components/ThreadPageOutline';
import LoginAndRegister from './components/LoginAndRegisterView';
import Cookies from 'js-cookie';

import { useState } from 'react';

import './App.css';

function App() {

  const [authorization, setAuthoriation] = useState(!!Cookies.get('Authorization'))

  return (
    <div className="App">
      {authorization ? <ThreadView /> : <LoginAndRegister setAuthoriation={setAuthoriation}/>}
    </div>
  );
}

export default App;
