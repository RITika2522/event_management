import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Navbar({ setUserRole, userRole }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
            localStorage.removeItem("role");
            setUserRole(null);
            navigate("/login");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
            <h1 className="font-bold text-lg">Event Management</h1>
            <div className="flex items-center space-x-4">
                {userRole ? (
                    <>
                        <span className="capitalize">{userRole}</span>
                        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate("/login")} className="hover:underline">
                            Login
                        </button>
                        <button onClick={() => navigate("/register")} className="hover:underline">
                            Register
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}