import { useEffect, useState } from "react";
import { NavBar } from "../../components/NavBar/NavBar"
import { useAuth } from "../../context/AuthContext";
import './ProfilePage.css'
import { getUsername } from "../../hooks/getUsername";
import { useNavigate } from "react-router-dom";
import { addFavAlbums, checkAlreadyHasFavAlbums } from "../../hooks/addFavouriteAlbums";
import { getAccessToken } from "../../api/SearchArtist";
import { searchAlbums } from "../../api/SearchAlbum";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { getFavAlbums } from "../../hooks/getFavAlbums";

export const ProfilePage = () => {

    const { user, logout } = useAuth();
    const currentUserEmail = user?.email; 

    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

    const [username, setUsername] = useState("");
    const [alreadyHasFavAlbums, setAlreadyHasFavAlbums] = useState(false)
    const [searchAlbumInput, setSearchAlbumInput] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [albums, setAlbums] = useState([]);
    const [selectedAlbumIds, setSelectedAlbumsIds] = useState([])
    const [selectedAlbumNames, setSelectedAlbumNames] = useState([])
    const [selectedThreeAlbums, setSelectedThreeAlbums] = useState(false)

    const [favAlbums, setFavAlbums] = useState([])

    const navigate = useNavigate()
    useEffect(() => {
        getAccessToken(CLIENT_ID, CLIENT_SECRET)
            .then(token => {
                console.log("Access Token:", token);
                if (!token) {
                    throw new Error("Failed to retrieve access token");
                }
                setAccessToken(token);
            })
            .catch(error => {
                console.error('Error fetching access token:', error);
                alert('There was an error fetching the access token. Please try again.');
            });
    }, []);

    const searchForAlbums = async (query = searchAlbumInput, token = accessToken) => {
        if (!query || !token) return;
    
        console.log("Searching for album: " + query);
    
        try {
            const albumResults = await searchAlbums(query, token);
            setAlbums(albumResults);
        } catch (error) {
            console.error("Error fetching album data:", error);
        }
    };

    const collectFavAlbums = async (query = searchAlbumInput, token = accessToken) => {
        if (!query || !token) return []; 
        
        console.log("Searching for album: " + query);
        
        try {
            // Fetch the album data using the searchAlbums function
            const albumResults = await searchAlbums(query, token);
            return albumResults; // Return the list of albums found
        } catch (error) {
            console.error("Error fetching album data:", error);
            return [];  
        }
    };
    
    useEffect(() => {
        const fetchUsername = async () => {
            if (currentUserEmail) {
                const fetchedUsername = await getUsername(currentUserEmail);
                setUsername(fetchedUsername || "User"); 
            }
        };

        fetchUsername();
    }, [currentUserEmail]);

    useEffect(() => {
        const checkFavAlbums = async () => {
            if (username) {
                const hasFavAlbums = await checkAlreadyHasFavAlbums(username);
                setAlreadyHasFavAlbums(hasFavAlbums);
    
                if (hasFavAlbums) {
                    const albumNames = await getFavAlbums(username);  // Assuming this returns an array of album names
    
                    // Search for each album using the album names and set them in `favAlbums`
                    const albumObjects = [];
                    
                    for (const albumName of albumNames) {
                        try {
                            const albumResults = await collectFavAlbums(albumName, accessToken);
                            if (albumResults.length > 0) {
                                albumObjects.push(albumResults[0]); // Push the first album object found
                            }
                        } catch (error) {
                            console.error("Error fetching album data for:", albumName, error);
                        }
                    }
    
                    // Set the fetched album objects to the state
                    setFavAlbums(albumObjects);
                }
            }
        };
    
        checkFavAlbums();
    }, [username, accessToken]);
    
    const handleAlbumSelection = (albumID, albumName) => {
        if (selectedAlbumIds.length >= 2 || selectedAlbumNames.length >= 2) {
            setSelectedThreeAlbums(true)
        }
        
        if (selectedAlbumIds.includes(albumID) || selectedAlbumNames.includes(albumName)) {
            return;  
        }

        if (selectedAlbumIds.length >= 3) {
            console.log("You can only select up to 3 albums.");
            return;
        }
    
        console.log("selected album", albumName, albumID);
    
        setSelectedAlbumsIds(prevAlbumIds => {
            if (prevAlbumIds.length < 3) {
                return [...prevAlbumIds, albumID];
            } else {
                return prevAlbumIds; 
            }
        });
    
        setSelectedAlbumNames(prevAlbumNames => {
            if (prevAlbumNames.length < 3) {
                return [...prevAlbumNames, albumName];
            } else {
                return prevAlbumNames; 
            }
        });
    };
    
    const removeAlbum = (albumName) => {
        setSelectedThreeAlbums(false)
        const indexToRemove = selectedAlbumNames.indexOf(albumName);
    
        if (indexToRemove === -1) { 
            return
        }  
    
        setSelectedAlbumNames(prevNames => prevNames.filter((_, index) => index !== indexToRemove));
        setSelectedAlbumsIds(prevIds => prevIds.filter((_, index) => index !== indexToRemove));
    };

    const postAlbums = async () => {
        setAlreadyHasFavAlbums(true)

        try {
            await addFavAlbums(username, selectedAlbumNames)

            const albumNames = await getFavAlbums(username);  // Assuming this returns an array of album names
    
            // Search for each album using the album names and set them in `favAlbums`
            const albumObjects = [];
                    
            for (const albumName of albumNames) {
                try {
                    const albumResults = await collectFavAlbums(albumName, accessToken);
                    if (albumResults.length > 0) {
                        albumObjects.push(albumResults[0]); // Push the first album object found
                    }
                } catch (error) {
                        console.error("Error fetching album data for:", albumName, error);
                    }
                }
                // Set the fetched album objects to the state
                setFavAlbums(albumObjects);
        } catch (err) {
            console.error(err)
        }
    }
    
    return (
        <>
            <NavBar />

            <div className="ProfilePage">

                <div className="ProfilePage-top-section">
                    <div className="Profile-picture">
                        <h1 className="Profile-picture-text">{username.charAt(0)}</h1>
                    </div>

                    <div className="User-info">
                        <h3 className="Profile-tag">Profile</h3>
                        <h1 className="Username">{username}</h1>  
                        <p>2 friends</p>
                    </div>
                </div>

                <div className="Favourite-albums-section">
                    <h1 className="Section-titles">Favourite Albums</h1>
                    {alreadyHasFavAlbums ? (
                        <div className="Fav-albums-list" >
                            {favAlbums.map((album, index) => (
                                <div key={index} className="Fav-Album-card" >
                                    <img
                                        className="Fav-Album-card-image"
                                        src={album.images?.[0]?.url || 'default-image-url'}
                                        alt={album.name}
                                    />
                                    <div>
                                        <h1 className="Fav-Album-card-title">{album.name}</h1>
                                        <p className="Fav-Album-card-info">
                                            {album.release_date?.substring(0, 4)} · {album.artists?.[0]?.name || 'Unknown Artist'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="Select-albums-container">
                          <h4>You haven't yet chosen your fav albums! please select from below: </h4>  

                            <div className="Search-album-wrapper">
                                <InputGroup className="mb-3 Search-album-input" size="lg">
                                    <FormControl
                                        placeholder="Search For Album"
                                        type="input"
                                        onKeyDown={event => {
                                            if (event.key === "Enter") {
                                                searchForAlbums();
                                            }
                                        }}
                                        onChange={event => setSearchAlbumInput(event.target.value)}
                                    />
                                    <Button onClick={searchForAlbums}>
                                        Search
                                    </Button>
                                </InputGroup>
                            </div>

                            {selectedAlbumNames.length > 0 && (
                                <div className="Chosen-albums">
                                   <p>Currently chosen albums: </p>
                                    <ul className="Chosen-albums-list">
                                        {selectedAlbumNames.map((albumName, index) => (
                                            <li 
                                                className="Chosen-album"
                                                key={index}
                                            >
                                                {albumName}
                                                <button 
                                                    className="Remove-album-button"
                                                    onClick={() => removeAlbum(albumName)}
                                                >
                                                    X
                                                </button>
                                            </li>
                                        ))}
                                    </ul> 
                                        {selectedThreeAlbums && (
                                            <button
                                                className="Post-albums-button"
                                                onClick={postAlbums}
                                            >
                                                Post
                                            </button>
                                        )}
                                </div>
                            )}            
                            
                            <div className="Select-Album-list">
                                {albums.map((album, i) => (
                                    <div key={i} className="Select-Album-card" onClick={() => handleAlbumSelection(album.id, album.name)}>
                                        <img
                                            className="Select-Album-card-image"
                                            src={album.images?.[0]?.url || 'default-image-url'}
                                            alt={album.name}
                                        />
                                        <div>
                                            <h1 className="Select-Album-card-title">{album.name}</h1>
                                            <p className="Select-Album-card-info">
                                                {album.release_date?.substring(0, 4)} · {album.artists?.[0]?.name || 'Unknown Artist'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="Recent-reviews-section">
                    <h1 className="Section-titles">Recent Reviews</h1>
                </div>
                
                <div className="Most-listened-to-artists-section">
                    <h1 className="Section-titles">Most listened to artists</h1>
                </div>

                <div className="Most-listened-to-genres-section">
                    <h1 className="Section-titles">Most listened to genres</h1>
                </div>

                <button 
                    className = "Logout-button" 
                    onClick={() => logout(navigate)}>Logout</button>
            </div>
        </>
    )
}

