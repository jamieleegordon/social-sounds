import IconButton from "@mui/material/IconButton";
import { AccountBox, AutoGraph, Chat, Group, Home, LibraryMusic, MenuSharp, PlaylistPlay, Search } from "@mui/icons-material";
import smallLogo from '../../media/ss-logo-small.png'
import './NavBar.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate()

    // Toggle menu visibility on mobile
    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    const gotoHomePage = () => {
        navigate("/home")
    }
    const gotoSearchPage = () => {
        navigate("/search")
    }
    const gotoProfilePage = () => {
        navigate("/profile")
    }
    const gotoFriendsPage = () => {
        navigate('/friends')
    }
    const gotoAIplaylistPage = () => {
        navigate('/ai-playlist')
    }

    return (
        <>
            {/* Desktop Header - Visible only on large screens */}
            <header className="Header">
                <nav className="Desktop-Nav-bar">
                    <ul className="Nav-bar">
                        <li>
                            <IconButton onClick={gotoHomePage}>
                                <Home className="Nav-bar-icon" />
                            </IconButton>
                        </li>
                        <li>
                            <IconButton onClick={gotoSearchPage}>
                                <Search className="Nav-bar-icon" />
                            </IconButton>
                        </li>
                        <li>
                            <IconButton>
                                <Group className="Nav-bar-icon" />
                            </IconButton>
                        </li>
                        <li>
                            <IconButton onClick={gotoFriendsPage}>
                                <Chat className="Nav-bar-icon" />
                            </IconButton>
                        </li> 

                        <img 
                            className="Nav-bar-desktop-logo"
                            src={smallLogo} 
                            alt="Logo"
                        />

                        <li>
                            <IconButton>
                                <LibraryMusic className="Nav-bar-icon" />
                            </IconButton>
                        </li>  
                        <li>
                            <IconButton>
                                <AutoGraph className="Nav-bar-icon" />
                            </IconButton>
                        </li> 
                        <li>
                            <IconButton>
                                <PlaylistPlay className="Nav-bar-icon" onClick = {gotoAIplaylistPage}/>
                            </IconButton>
                        </li> 
                        <li>
                            <IconButton>
                                <AccountBox className="Nav-bar-icon" onClick={gotoProfilePage}/>
                            </IconButton>
                        </li>     
                    </ul>
                </nav>
            </header>

            {/* Mobile Header - Visible only on mobile screens */}
            <header className="Header-mobile">
                <nav className="Mobile-Nav-bar">
                    <IconButton onClick={toggleMenu}>
                        <MenuSharp className="Nav-bar-icon MenuSharp" />
                    </IconButton>

                    {/* Mobile Logo */}
                    <img 
                        className="Nav-bar-mobile-logo" 
                        src={smallLogo}
                        alt="Logo"
                    />

                    {/* Full-Screen Mobile Menu */}
                    <div className={`Mobile-menu ${menuOpen ? 'open' : ''}`}>
                        <IconButton className="Close-menu" onClick={toggleMenu}>
                            <MenuSharp className="Nav-bar-icon" />
                        </IconButton>
                        <ul>
                            <li>
                                <IconButton onClick={gotoHomePage}>
                                    <Home className="Nav-bar-icon" />
                                </IconButton>
                            </li>
                            <li>
                                <IconButton onClick={gotoSearchPage}>
                                    <Search className="Nav-bar-icon" />
                                </IconButton>
                            </li>
                            <li>
                                <IconButton>
                                    <Group className="Nav-bar-icon" />
                                </IconButton>
                            </li>
                            <li>
                                <IconButton onClick={gotoFriendsPage}>
                                    <Chat className="Nav-bar-icon" />
                                </IconButton>
                            </li>
                            <li>
                                <IconButton>
                                    <LibraryMusic className="Nav-bar-icon" />
                                </IconButton>
                            </li>  
                            <li>
                                <IconButton>
                                    <AutoGraph className="Nav-bar-icon" />
                                </IconButton>
                            </li> 
                            <li>
                                <IconButton>
                                    <PlaylistPlay className="Nav-bar-icon" onClick = {gotoAIplaylistPage}/>
                                </IconButton></li> 
                            <li>
                                <IconButton>
                                    <AccountBox className="Nav-bar-icon" onClick={gotoProfilePage}/>
                                </IconButton>
                            </li>  
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    )
}

