import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Header from './Header'

const NavBar = () => {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (<>
          <Header />
        <nav className="bg-blue-600 p-4">
            <ul className="flex space-x-4 text-white">
                {!token && (
                    <>
                        <li>
                            <Link
                                to="/register"
                                className="hover:text-gray-200"
                            >
                                Register
                            </Link>
                        </li>
                        <li>
                            <Link to="/login" className="hover:text-gray-200">
                                Login
                            </Link>
                        </li>
                    </>
                )}
                {token && (
                    <>
                        <li>
                            <Link to="/capture" className="hover:text-gray-200">
                                Capture Map
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/captures"
                                className="hover:text-gray-200"
                            >
                                Your Captures
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/topcaptures"
                                className="hover:text-gray-200"
                            >
                                Top Captures
                            </Link>
                        </li>                        
                        <li>
                            <button
                                onClick={handleLogout}
                                className="hover:text-gray-200"
                            >
                                Logout
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
        </>
    );
};

export default NavBar;
