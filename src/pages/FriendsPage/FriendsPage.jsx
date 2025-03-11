import { useEffect, useState } from "react"
import { NavBar } from "../../components/NavBar/NavBar"
import { useAuth } from "../../context/AuthContext";
import { getUsername } from "../../hooks/getUsername";
import { getFriends } from "../../hooks/getFriends";
import 'bootstrap/dist/css/bootstrap.min.css';
import './FriendsPage.css'
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import { Chat, Person } from "@mui/icons-material";

export const FriendsPage = () => {

    const { user } = useAuth();
    const currentUserEmail = user?.email; 

    const [username, setUsername] = useState("");
    const [friends, setFriends] = useState([])
    const [searchFriendInput, setSearchFriendInput] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUsername = async () => {
            if (currentUserEmail) {
                const fetchedUsername = await getUsername(currentUserEmail);
                setUsername(fetchedUsername || "User"); 
            }
        }
    
        fetchUsername();
    }, [currentUserEmail]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const fetchedFriends = await getFriends(username)
                setFriends(fetchedFriends)
            } catch (err) {
                console.error(err)
            }
        }

        fetchFriends()
    }, [username])

    const searchFriend = () => {
        // Filter the friends based on the search input and put the matching friend at the top
        const filteredFriends = friends.filter(friend => 
            friend.toLowerCase().includes(searchFriendInput.toLowerCase())
        );
        
        // Sorting so that the searched friend appears first
        const sortedFriends = [
            ...filteredFriends, 
            ...friends.filter(friend => 
                !friend.toLowerCase().includes(searchFriendInput.toLowerCase())
            )
        ];

        setFriends(sortedFriends);
    }

    const handleFriendClick = async (friendUsername) => {
        navigate(`/friends/${friendUsername}`, {
            state: {
                friendUsername
            }
        });
    };

    const gotoFriendProfile = (friendUsername) => {
        navigate(`/friendProfile/${friendUsername}`, {
            state: {
                friendUsername
            }
        });
    }

    return (
        <>
            <NavBar />

            <div className="FriendsPage">
                <div className="FriendsPage-overlay">
                    <div className="Friends-column">
                        <div className="Friends-list-top-section">
                            <h1>Friends</h1>

                            <InputGroup className="mb-3 Search-friend-input" size="lg" sx={{ 
                                marginTop: '100px', 
                                marginBottom: '20px' 
                                }}
                            >
                                <FormControl
                                    placeholder="Search For Friend"
                                    type="input"
                                    onKeyDown={event => {
                                        if (event.key === "Enter") {
                                            searchFriend();
                                        }
                                    }}
                                    onChange={event => setSearchFriendInput(event.target.value)}
                                />
                                <Button onClick={searchFriend}>Search</Button>
                            </InputGroup>
                        </div>

                        <div className="Friends-list">
                            {friends.length === 0 ? (
                                <p>You don't have friends</p>
                            ) : (
                                friends.map((friend, index) => (
                                    <div key={index} className="Friend-card">
                                        <div className="Friend-Profile-picture">
                                            <h1 className="Friend-Profile-picture-text">{friend.charAt(0)}</h1>
                                        </div>
                                        <h2>{friend}</h2>
                                        <Tooltip title="Chat" arrow>
                                            <IconButton 
                                                onClick={(event) => {
                                                    event.stopPropagation(); 
                                                    handleFriendClick(friend);
                                                }}
                                            >
                                                <Chat sx = {{
                                                    background: "grey", 
                                                    borderRadius: "50%", 
                                                    minWidth: "40px", 
                                                    height: "auto", 
                                                    padding: "3px"
                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                        
                                        <Tooltip title="View Profile" arrow>
                                           <IconButton 
                                                onClick={(event) => {
                                                    event.stopPropagation(); 
                                                    gotoFriendProfile(friend);
                                                }}
                                            >
                                                <Person sx = {{
                                                    background: "grey", 
                                                    borderRadius: "50%", 
                                                    minWidth: "40px", 
                                                    height: "auto", 
                                                    padding: "3px"
                                                    }}
                                                />
                                            </IconButton> 
                                        </Tooltip>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="Select-chat">
                        <h1>
                            Select a friend to chat! 
                            Why not share some of your favorite songs and albums 😊
                        </h1>
                    </div>
                </div>
            </div>

        </>
    )
}



