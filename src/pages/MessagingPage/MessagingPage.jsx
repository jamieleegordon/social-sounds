import { useLocation } from "react-router-dom";
import { NavBar } from "../../components/NavBar/NavBar"

export const MessagingPage = () => {
    const location = useLocation(); 

    const { friendUsername } = location.state || {};

    return (
        <>
            <NavBar />
            
            {/* include a SHARED MUSIC section on right */}
            <div className="MessagingPage">
                <h1>Messaging page</h1>
                <h2>{friendUsername}</h2>
            </div>
        </>
    )
}

