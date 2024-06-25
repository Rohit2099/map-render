import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import MapCapture from "./MapCapture.jsx";
import UserCaptures from "./UserCaptures.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import Render3D from "./Render3d.jsx";
import NavBar from "./NavBar";
import TopCaptures from './TopCaptures.jsx';
import Home from './Home.jsx'

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <NavBar />
                <div className="container mx-auto p-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/capture" element={<MapCapture />} />
                        <Route path="/captures" element={<UserCaptures />} />
                        <Route path="/topcaptures" element={<TopCaptures />} />
                        <Route path="/render3d" element={<Render3D />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
