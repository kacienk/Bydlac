import {
    BrowserRouter as Router,
    Route,
    Routes} from "react-router-dom";

import './App.css';
import MainPageTEMP from './pages/MainPageTEMP'
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPageTEMP />}/>
                <Route path="/login" element={<LogInPage />}/>
                <Route path="/signup" element={<SignUpPage />}/>
            </Routes>
        </Router>
    );
}

export default App;