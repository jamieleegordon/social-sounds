import { useNavigate } from "react-router-dom"
import logo from '../../media/ss-logo-background.png'
import smallLogo from '../../media/ss-logo-small.png'
import './Welcome.css'

export const WelcomePage = () => {

    const navigate = useNavigate()

    const goToLoginPage = () => {
        navigate("/login")
    }

    const goToRegisterPage = () => {
        navigate("/register")
    }

    return (
        <>
        <header className="Welcome-page-header">
            <img src = {smallLogo} alt = "Logo"/>
        </header>
        <div className = "Welcome-page">
            <div className="Logo-container">
                <img src = {logo} alt = "Logo"/>
                <h1 id = "slogan" >Social network for music enthusiasts</h1>
                
                <div className="buttons-container">
                    <button
                        onClick={goToLoginPage}
                        id = "Login-btn"
                    >
                        Login
                    </button>
                    <button 
                        onClick={goToRegisterPage}
                        id = "SignUp-btn"
                    >
                        Sign Up
                    </button>
                </div>
                
            </div>
            
        </div>
        </>
    )
}