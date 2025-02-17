import { useState } from 'react'
import { auth, googleProvider } from '../../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'

export const RegisterPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")

    // console.log(auth?.currentUser?.photoURL)

    const registerUser = async() => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            // add to database with email, username, friendslist
        } catch (err) {
            console.error(err)
        }
    }

    const signInWithGoogle = async() => {
        try {
            await signInWithPopup(auth, googleProvider)
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
