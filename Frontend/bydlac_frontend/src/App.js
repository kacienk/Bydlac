import {
    BrowserRouter as Router,
    Route,
    Routes} from "react-router-dom";
import {UserProvider} from "./context/UserContext";

import './App.css';
import MainPageTEMP from './pages/MainPageTEMP'
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import LogOutPage from "./pages/LogOutPage";

function App() {
    return (
        <Router>
            <UserProvider>
                <Routes>
                    <Route path="/mainview" element={<MainPageTEMP />}/>
                    <Route path="/login" element={<LogInPage />}/>
                    <Route path="/signup" element={<SignUpPage />}/>
                    <Route path="/logout" element={<LogOutPage />}/>
                </Routes>
            </UserProvider>
        </Router>
    );
}

export default App;