import { useState } from 'react'
import { auth, googleProvider } from '../../config/firebase'
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

export const LoginPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const gotoHomePage = () => {
        navigate("/home")
    }

    // console.log(auth?.currentUser?.photoURL)

    const signIn = async() => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user; 
            console.log('User logged in:', user);
            gotoHomePage()
          } catch (error) {
            // This will catch any errors, including incorrect email/password
            console.error('Error logging in:', error.message);
        
            // Handling specific errors
            if (error.code === 'auth/wrong-password') {
              console.error('Incorrect password!');
            } else if (error.code === 'auth/user-not-found') {
              console.error('No user found with this email!');
            }
          }
    }

    const signInWithGoogle = async() => {
        try {
            await signInWithPopup(auth, googleProvider)
        } catch (err) {
            console.error(err)
        }
    }

    const logout = async() => {
        try {
            await signOut(auth)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            <h1>Login Page</h1>
            <input 
                placeholder="Email..."
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type='password' 
                placeholder="Password..." 
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={signIn}>Login</button>

            <button onClick={signInWithGoogle}>Sign in with Google</button>

            <button onClick={logout}>Logout</button>
        </div>
    )
}
