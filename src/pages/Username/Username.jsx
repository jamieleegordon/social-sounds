import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { addNewUser } from "../../hooks/newUser";
import smallLogo from '../../media/ss-logo-small.png'
import './Username.css'
import { checkUsernameTaken } from "../../hooks/checkUsernameTaken";
import { checkBadWords } from "../../regex/checkBadWords";

export const UsernamePage = () => {

    const { user } = useAuth();
    const currentUserEmail = user?.email; 

    const [username, setUsername] = useState("")
    const [userExists, setUserExists] = useState(false)
    const [innappropriateUsername, setInnappropriateUsername] = useState(false)

    const navigate = useNavigate()

    const createUsername = async (e) => {
        e.preventDefault()

        setInnappropriateUsername(false)
        setUserExists(false);

        const usernameIsTaken = await checkUsernameTaken(username);

        if (usernameIsTaken) {
            setUserExists(true)
            return
        } 

        if (checkBadWords(username)) {
            setInnappropriateUsername(true)
            return
        }

        addNewUser(currentUserEmail, username)
        navigate("/home")
    }

    return (
        <>
            <header className="Username-page-header">
                <img src = {smallLogo} alt = "Logo"/>
            </header>

            <div className="Username-page">
                <form className= "Username-form" onSubmit={createUsername}>
                    <h2>Almost there! its now time to create a username</h2>

                    <input 
                        className="Username-input"
                        type = "text" 
                        placeholder = "Enter Username ..."
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    {userExists && (
                        <p className='Error-message'>
                            Username is already taken :(
                        </p>
                    )}

                    {innappropriateUsername && (
                        <p className='Error-message'>
                            Username is innapropriate and goes against our community guidelines
                        </p>
                    )}

                    <button 
                        className= "Username-button" 
                        type="submit"
                    >
                        Create Username
                    </button>
                </form>

                
                
            </div>
        </>
    )
}