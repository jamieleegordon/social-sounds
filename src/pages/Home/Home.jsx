import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUsername } from "../../hooks/getUsername";
import { useEffect, useState } from "react";
import './Home.css'
import { NavBar } from "../../components/NavBar/NavBar";

export const HomePage = () => {
    const { user, logout } = useAuth();
    const currentUserEmail = user?.email; 

    const [username, setUsername] = useState("");

    const navigate = useNavigate()
    
    useEffect(() => {
        const fetchUsername = async () => {
            if (currentUserEmail) {
                const fetchedUsername = await getUsername(currentUserEmail);
                setUsername(fetchedUsername || "User"); 
            }
        };

        fetchUsername();
    }, [currentUserEmail]);

    return (
        // Home / whats hot/ popular/ most reviewed
        // Search/Discover
        // Users/Recommended Users
        // Messaging
        // Recommend Music
        // Data Vis Page 'Listening stats'
        // Text-to-playlist
        // Profile Page/ Logout item
        <>
            <NavBar />

            <div className="Home-page">
                <h1>Home page</h1>
                <p>Welcome, {currentUserEmail}</p>
                <p>Hey {username}</p>

                <button onClick={() => logout(navigate)}>Logout</button>
            </div>
        </>
    )
}