import {
    BrowserRouter as Router,
    Route,
    Routes} from "react-router-dom";

import './App.css';
import MainPageTEMP from './pages/MainPageTEMP'
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import LogOutPage from "./pages/LogOutPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPageTEMP />}/>
                <Route path="/login" element={<LogInPage />}/>
                <Route path="/signup" element={<SignUpPage />}/>
                <Route path="/logout" element={<LogOutPage />}/>
            </Routes>
        </Router>
    );
}

export default App;