import ThreadView from './components/ThreadView';
import Login from './components/LoginScreen';
import Register from './components/RegisterScreen';

import { useState } from 'react';

import './App.css';

function App() {

  const [view, setView] = useState('')

  return (
    <div className="App">
      <ThreadView/>
      <Login />
      <Register />
    </div>
  );
}

export default App;
