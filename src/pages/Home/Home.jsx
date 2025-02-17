import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const HomePage = () => {
    const { user, logout } = useAuth();
    const currentUserEmail = user?.email; 

    const navigate = useNavigate()
    
    return (
        <div>
            <h1>Home page</h1>
            <p>Welcome, {currentUserEmail}</p>

            <button onClick={() => logout(navigate)}>Logout</button>
        </div>
    )
}