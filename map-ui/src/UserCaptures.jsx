import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import { AuthContext } from "./AuthContext";

const UserCaptures = () => {
    const [captures, setCaptures] = useState([]);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCaptures = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/captures",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCaptures(response.data);
            } catch (error) {
                console.error("Error fetching captures:", error);
            }
        };
        if (token) {
            fetchCaptures();
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="w-full max-w-5xl p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">Your Captures</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {captures.map(capture => (
                <div key={capture._id} className="border rounded-lg overflow-hidden shadow-sm bg-gray-50">
                  <img src={capture.imageUrl} alt={`Capture at ${capture.latitude}, ${capture.longitude}`} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <p className="text-sm text-gray-600">Lat: {capture.latitude}</p>
                    <p className="text-sm text-gray-600">Lng: {capture.longitude}</p>
                    <p className="text-sm text-gray-600">Zoom: {capture.zoom}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
};

export default UserCaptures;
