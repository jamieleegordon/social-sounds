import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { addNewUser } from "../../hooks/newUser";

export const UsernamePage = () => {

    const { user } = useAuth();
    const currentUserEmail = user?.email; 

    const [username, setUsername] = useState("")

    const navigate = useNavigate()

    const createUsername = async () => {
        addNewUser(currentUserEmail, username)
        navigate("/home")
    }

    // add to database with email, username, friendslist

    return (
        <div className="Username-page">
            <h2>Create a username</h2>

            <input 
                type = "text" 
                placeholder = "Enter Username ..."
                onChange={(e) => setUsername(e.target.value)}
            />

            <button onClick={createUsername}>Create Username</button>
        </div>
    )
}