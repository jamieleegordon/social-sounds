import { useState } from 'react'
import { auth, googleProvider } from '../../config/firebase'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { checkUserExists } from '../../hooks/checkUserExists'
import smallLogo from '../../media/ss-logo-small.png'
import logo from '../../media/ss-logo-background.png'
import './Login.css'
import { Google } from '@mui/icons-material'

export const LoginPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [incorrect, setIncorrect] = useState(false)

    const navigate = useNavigate()

    const gotoHomePage = () => {
        navigate("/home")
    }

    const goToRegisterPage = () => {
        navigate("/register")
    }

    const signIn = async(e) => {
        e.preventDefault()

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user; 
            console.log('User logged in:', user);
            setIncorrect(false)
            gotoHomePage()
          } catch (error) {
            // This will catch any errors, including incorrect email/password
            setIncorrect(true)
            console.error('Error logging in:', error.message);
        
            // Handling specific errors
            if (error.code === 'auth/wrong-password') {
              console.error('Incorrect password!');
            } else if (error.code === 'auth/user-not-found') {
              console.error('No user found with this email!');
            }
          }
    }

    const signInWithGoogle = async () => {
            try {
                await signInWithPopup(auth, googleProvider)
                const userExists = await checkUserExists(auth?.currentUser?.email);
                
                if (userExists) {
                    gotoHomePage()
                } else {
                    navigate("/create-username")
                }
                
            } catch (err) {
                console.error(err)
            }
    }

    return (
        <>
            <header className="Login-page-header">
                <img src = {smallLogo} alt = "Logo"/>
            </header>

            <div className='Login-page'>    
                <form className='Login-form' onSubmit={signIn}>
                    <img src = {logo} alt = "logo" />
                    <h1>Log In</h1>

                    <input 
                        required
                        className='Login-input'
                        placeholder="Email..."
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        required
                        className='Login-input'
                        type='password' 
                        placeholder="Password..." 
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {incorrect && (
                        <p className='Error-message'>
                            Incorrect email or password, please try again :(
                        </p>
                    )}

                    <button
                        type='submit'
                        className='Login-button'
                    >
                        Login
                    </button>
                    <button 
                        className='Login-button-google'
                        onClick={signInWithGoogle}
                    >
                        <span className="google-button-content">
                            <Google className="google-icon" />
                            Sign in with Google
                        </span>
                    </button>

                    <p 
                        className='Already-have-an-account-button'
                        onClick={goToRegisterPage}
                    >
                        Already have an account?
                    </p>
                    
                    

                </form>
               
                
            </div>
        </>
    )
}

