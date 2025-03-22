import { useEffect, useState } from "react";
import { NavBar } from "../../components/NavBar/NavBar"
import '../ProfilePage/ProfilePage.css'
import { useLocation, useNavigate } from "react-router-dom";
import { checkAlreadyHasFavAlbums } from "../../hooks/addFavouriteAlbums";
import { getAccessToken } from "../../api/SearchArtist";
import { searchAlbums } from "../../api/SearchAlbum";
import { getFavAlbums } from "../../hooks/getFavAlbums";
import { getFavArtist } from "../../hooks/getFavArtist";
import { getFavGenre } from "../../hooks/getFavGenre";

export const FriendProfile = () => {
    const location = useLocation();
    const { friendUsername } = location.state || {};

    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

    const [alreadyHasFavAlbums, setAlreadyHasFavAlbums] = useState(false)
    const [accessToken, setAccessToken] = useState("");

    const [mostListenedToGenre, setMostListenedToGenre] = useState("")
    const [mostListenedToArtist, setMostListenedToArtist] = useState("")
    
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


    const collectFavAlbums = async (query, token = accessToken) => {
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
        const checkFavAlbums = async () => {
            if (friendUsername) {
                const hasFavAlbums = await checkAlreadyHasFavAlbums(friendUsername);
                setAlreadyHasFavAlbums(hasFavAlbums);
    
                if (hasFavAlbums) {
                    const albumNames = await getFavAlbums(friendUsername);  // Assuming this returns an array of album names
    
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
    }, [friendUsername, accessToken]);

    useEffect(() => {
            const fetchFavGenre = async () => {
                const favGenre = await getFavGenre(friendUsername)
                setMostListenedToGenre(favGenre)
                console.log(favGenre)
            }
        
            fetchFavGenre()
        }, [friendUsername])
        
        useEffect(() => {
            const fetchFavArtist = async () => {
                const favArtist = await getFavArtist(friendUsername)
                setMostListenedToArtist(favArtist)
                console.log(favArtist)
            }
        
            fetchFavArtist()
        }, [friendUsername]) 

    return (
        <>
            <NavBar />

            <div className="ProfilePage">
                
                
                

                <div className="ProfilePage-top-section">

                    
                    
                    <div className="Profile-picture">
                        <h1 className="Profile-picture-text">{friendUsername.charAt(0)}</h1>
                    </div>

                    <div className="User-info">
                        <h3 className="Profile-tag">Profile</h3>
                        <h1 className="Username">{friendUsername}</h1>  
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
                          <h4>This user hasn't posted their fav albums yet! </h4>  

                            <div className="Search-album-wrapper">
                                
                            </div>

                                       
                            
                        </div>
                    )}
                </div>

                <div className="Recent-reviews-section">
                    <h1 className="Section-titles">Recent Reviews</h1>
                </div>
                
                <div className="Most-listened-to-artists-section">
                    <h1 className="Section-titles">Most listened to artist</h1>
                    <h3>{mostListenedToArtist}</h3>
                </div>

                <div className="Most-listened-to-genres-section">
                    <h1 className="Section-titles">Most listened to genre</h1>
                    <h3>{mostListenedToGenre}</h3>
                </div>

            </div>
        </>
    )
}

