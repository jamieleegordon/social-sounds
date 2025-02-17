import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUsername } from "../../hooks/getUsername";
import { useEffect, useState } from "react";

export const HomePage = () => {
    const { user, logout } = useAuth();
    const currentUserEmail = user?.email; 

    const [username, setUsername] = useState("");

    const navigate = useNavigate()
    
    useEffect(() => {
        const fetchUsername = async () => {
            if (currentUserEmail) {
                const fetchedUsername = await getUsername(currentUserEmail);
                setUsername(fetchedUsername || "User"); // Fallback if username is null
            }
        };

        fetchUsername();
    }, [currentUserEmail]);

    return (
        <div>
            <h1>Home page</h1>
            <p>Welcome, {currentUserEmail}</p>
            <p>Hey {username}</p>

            <button onClick={() => logout(navigate)}>Logout</button>
        </div>
    )
}