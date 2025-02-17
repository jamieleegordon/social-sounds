import { useState } from 'react'
import { auth, googleProvider } from '../../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { addNewUser } from '../../hooks/newUser'
import { checkUserExists } from '../../hooks/checkUserExists'

export const RegisterPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")

    const navigate = useNavigate()

    // console.log(auth?.currentUser?.photoURL)

    const registerUser = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)

            addNewUser(email, username)
            navigate("/home") 
        } catch (err) {
            console.log("user already exists with this email") // display in html
            console.error(err)
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

    // const logout = async() => {
    //     try {
    //         await signOut(auth)
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }

    return (
        <div>
            <h1>Register Page</h1>
            <input 
                placeholder="Email..."
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                placeholder="Username..."
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type='password' 
                placeholder="Password..." 
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={registerUser}>Register</button>

            <button onClick={signInWithGoogle}>Sign in with Google</button>

            
        </div>
    )
}
