import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MapCapture from "./MapCapture.jsx";
import Render3D from "./Render3d.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MapCapture />} />
                <Route path="/render3d" element={<Render3D />} />
            </Routes>
        </Router>
    );
}

export default App;
