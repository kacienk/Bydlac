import './App.css';
import User from "./components/User";
import InputMessage from "./components/InputMessage"

function App() {
  return (
      <div>
          <User name='Nick' surname='Rozmowcy' status='Status'/>
          <User name='Twoj' surname='Nick' status='Status'/>

          <InputMessage/>
      </div>
  );
}

export default App;
