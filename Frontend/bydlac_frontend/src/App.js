import {
    BrowserRouter as Router,
    Route,
    Routes} from "react-router-dom";
import {UserProvider} from "./context/UserContext";

import './App.css';
import MainPageTEMP from './pages/MainPageTEMP';
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import LogOutPage from "./pages/LogOutPage";
import NewGroupPage from "./pages/NewGroupPage";
import NewEventPage from "./pages/NewEventPage";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";

function App() {
    return (
        <Router>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <UserProvider>
                    <Routes>
                        <Route path="/chat/:groupId" element={<MainPageTEMP />}/>
                        <Route path="/login" element={<LogInPage />}/>
                        <Route path="/signup" element={<SignUpPage />}/>
                        <Route path="/logout" element={<LogOutPage />}/>
                        <Route path="/new/group" element={<NewGroupPage />}/>
                        <Route path="/new/event" element={<NewEventPage />}/>
                    </Routes>
                </UserProvider>
            </LocalizationProvider>
        </Router>
    );
}

export default App;