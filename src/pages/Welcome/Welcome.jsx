import { useNavigate } from "react-router-dom"

export const WelcomePage = () => {

    const navigate = useNavigate()

    const goToLoginPage = () => {
        navigate("/login")
    }
    const goToRegisterPage = () => {
        navigate("/register")
    }

    return (
        <div>
            <h1>Welcome to Social Sounds</h1>
            
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
    )
}