import { Routes,Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/Chat';
import SetAvatar from './pages/SetAvatar';
function App() {
  return (
    <Routes>
      <Route path='/' element={<Chat/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/setavatar' element={<SetAvatar/>}/>
    </Routes>
  );
}

export default App;
