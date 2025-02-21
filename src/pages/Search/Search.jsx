import { NavBar } from "../../components/NavBar/NavBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap';
import './Search.css';
import { useEffect, useState } from "react";
import { getAccessToken, getAlbumsByArtistId, searchArtistById } from "../../api/SearchArtist";
import { getTracksFromAlbum } from "../../api/GetAlbumTracks";

export const SearchPage = () => {
    
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

    const [searchArtistInput, setSearchArtistInput] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [albums, setAlbums] = useState([]);

    const [albumTracks, setAlbumTracks] = useState({}); 

    useEffect(() => {
        // Fetch the access token when the component mounts
        getAccessToken(CLIENT_ID, CLIENT_SECRET)
            .then(token => setAccessToken(token))
            .catch(error => {
                console.error('Error fetching access token:', error);
                alert('There was an error fetching the access token. Please try again.');
            });
    }, []);

    const searchArtist = async () => {
        console.log("Searching for " + searchArtistInput);
        
        try {
            // Get the artist ID
            const artistID = await searchArtistById(accessToken, searchArtistInput);
            console.log("Artist ID is " + artistID);

            // Fetch albums for the artist
            const artistAlbums = await getAlbumsByArtistId(accessToken, artistID);
            setAlbums(artistAlbums);

            // Fetch tracks for each album
            artistAlbums.forEach(async (album) => {
                const tracks = await getTracksFromAlbum(accessToken, album.id);
                setAlbumTracks(prevTracks => ({
                    ...prevTracks,
                    [album.id]: tracks,
                }));
            });
        } catch (error) {
            console.error("Error fetching artist data:", error);
        }
    };

    return (
        <>  
            <NavBar />

            <div className="Search-page">

                <div className="Artist-album-buttons-container">
                    <Button 
                        className="Filter-button Artists-button"
                    >
                        Artists
                    </Button>
                    <Button 
                        className="Filter-button Albums-button"
                    >
                        Albums
                    </Button>
                </div>
                
                <InputGroup className="mb-3 Search-artist-input" size="lg">
                    <FormControl
                        placeholder="Search For Artist"
                        type="input"
                        onKeyDown={event => {
                            if (event.key === "Enter") {
                                searchArtist();
                            }
                        }}
                        onChange={event => setSearchArtistInput(event.target.value)}
                    />
                    <Button onClick={searchArtist}>
                        Search
                    </Button>
                </InputGroup>

                <div className="Album-list">
                    {albums.map((album, i) => {
                        console.log(album);

                        // This gives back all tracks in the album, which is also a spotify link to the song
                        const tracks = albumTracks[album.id]

                        return (
                            <div key={i} className="Album-card">
                                <img 
                                    className="Album-card-image"
                                    src={album.images[0].url} 
                                    alt={album.name}
                                />
                                <div>
                                    <h1 className="Album-card-title">{album.name}</h1>

                                    {/* Album link */}
                                    {/* <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                        Listen to album here
                                    </a> */}

                                    {/* Show tracks */}
                                    {/* <ul>
                                        {tracks && tracks.map((track, index) => (
                                            <li key={index}>
                                                <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                                    {track.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul> */}

                                </div>
                            </div>
                        );
                    })}                
                </div>
            </div>
        </>
    );
};
