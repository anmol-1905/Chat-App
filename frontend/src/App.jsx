import { Route, Router, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage';
import ChatsPage from './Pages/ChatsPage';
import { background } from '@chakra-ui/react';

function App() {
  return (
      <div className='App'>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/chats" element={<ChatsPage />}></Route>
        </Routes>
      </div>
  )
}

export default App;
