import { useState } from 'react'
import { auth, googleProvider } from '../../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { addNewUser } from '../../hooks/newUser'
import { checkUserExists } from '../../hooks/checkUserExists'
import smallLogo from '../../media/ss-logo-small.png'
import logo from '../../media/ss-logo-background.png'
import { Google } from '@mui/icons-material'
import './Register.css'
import { checkUsernameTaken } from '../../hooks/checkUsernameTaken'
import { checkBadWords } from '../../regex/checkBadWords'

export const RegisterPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [reEnteredPassword, setReEnteredPassword] = useState("")

    const [userExists, setUserExists] = useState(false)
    const [accountExists, setAccountExists] = useState(false)
    const [passwordsDontMatch, setPasswordsDontMatch] = useState(false)
    const [weakPassword, setWeakPassword] = useState(false)
    const [innappropriateUsername, setInnappropriateUsername] = useState(false)

    const navigate = useNavigate()

    const goToLoginPage = () => {
        navigate("/login")
    }

    const registerUser = async (e) => {
        e.preventDefault()

        // Reset error states
        setPasswordsDontMatch(false);
        setUserExists(false);
        setAccountExists(false);
        setWeakPassword(false);
        setInnappropriateUsername(false)

        if (checkBadWords(username)) {
            setInnappropriateUsername(true)
            return
        }
        
        if (password !== reEnteredPassword) {
            setPasswordsDontMatch(true)
            return
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password)
            const usernameIsTaken = await checkUsernameTaken(username);

            if (usernameIsTaken) {
                setUserExists(true)
            } else {
                setUserExists(false)
                addNewUser(email, username)
                navigate("/home") 
            }
        } catch (err) {
            if (err.code === "auth/weak-password") {
                setWeakPassword(true);
                console.log("Weak password: Password should be at least 6 characters.");
            } else if (err.code === "auth/email-already-in-use") {
                setAccountExists(true);
                console.log("User already exists with this email.");
            } else {
                console.error(err);
            }
        }
    }

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            const userExists = await checkUserExists(auth?.currentUser?.email);
            
            if (userExists) {
                navigate("/home")
            } else {
                navigate("/create-username")
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <header className="Register-page-header">
                <img src = {smallLogo} alt = "Logo"/>
            </header>

            <div className='Register-page'>    
                <form className='Register-form' onSubmit={registerUser}>
                    <img src = {logo} alt = "logo" />
                    <h1>Register</h1>

                    <input 
                        required
                        className='Register-input'
                        placeholder="Email..."
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        required
                        className='Register-input'
                        placeholder="Username..."
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        required
                        className='Register-input'
                        type='password' 
                        placeholder="Password..." 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        required
                        className='Register-input'
                        type='password' 
                        placeholder="Password..." 
                        onChange={(e) => setReEnteredPassword(e.target.value)}
                    />                    

                    {userExists && (
                        <p className='Error-message'>
                            Username is already taken :(
                        </p>
                    )}

                    {accountExists && (
                        <p className='Error-message'>
                            An account with this email already exists
                        </p>
                    )}

                    {passwordsDontMatch && (
                        <p className='Error-message'>
                            Passwords don't match
                        </p>
                    )}

                    {weakPassword && (
                        <p className='Error-message'>
                            Password is too weak, should be at least 6 characters
                        </p>
                    )}

                    {innappropriateUsername && (
                        <p className='Error-message'>
                            Username is innapropriate and goes against our community guidelines
                        </p>
                    )}

                    <button
                        type='submit'
                        className='Register-button'
                    >
                        Register
                    </button>
                    <button 
                        className='Register-button-google'
                        onClick={signInWithGoogle}
                    >
                        <span className="google-button-content">
                            <Google className="google-icon" />
                            Sign in with Google
                        </span>
                    </button>

                    <p 
                        className='Already-have-an-account-button'
                        onClick={goToLoginPage}
                    >
                        Already have an account?
                    </p>
                </form>
            </div>
        </>
    )
}
