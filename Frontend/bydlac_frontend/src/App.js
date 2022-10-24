import './App.css';
import User from "./components/User";
import InputMessage from "./components/InputMessage";
import Conversation from "./components/Conversation";

function App() {
  return (
      <div>
          <div className='usersHeader'>
              <User className='otherPerson' name='Nick' surname='Rozmowcy' status='Status' favorite={true}/>
              <User className='you' name='Twoj' surname='Nick' status='Status' favorite={null}/>
          </div>

          <Conversation/>

          <InputMessage/>
      </div>
  );
}

export default App;
