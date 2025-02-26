import { NavBar } from "../../components/NavBar/NavBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import './Search.css';
import { useEffect, useState } from "react";
import { getAccessToken, getAlbumsByArtistId, searchArtistById } from "../../api/SearchArtist";
import { selectRandomArtist } from "../../helper/artists";
import { useNavigate } from "react-router-dom";

export const SearchPage = () => {
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

    const [searchArtistInput, setSearchArtistInput] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [albums, setAlbums] = useState([]);

    const randomArtist = selectRandomArtist();
    const navigate = useNavigate();

    useEffect(() => {
        getAccessToken(CLIENT_ID, CLIENT_SECRET)
            .then(token => {
                console.log("Access Token:", token);
                setAccessToken(token);
                setSearchArtistInput(randomArtist);
                searchArtist(randomArtist, token);
            })
            .catch(error => {
                console.error('Error fetching access token:', error);
                alert('There was an error fetching the access token. Please try again.');
            });
    }, []);

    const searchArtist = async (query = searchArtistInput, token = accessToken) => {
        if (!query || !token) return;

        console.log("Searching for artist:", query);

        try {
            const artistID = await searchArtistById(token, query);
            console.log("Artist ID:", artistID);

            const artistAlbums = await getAlbumsByArtistId(token, artistID);
            setAlbums(artistAlbums);
        } catch (error) {
            console.error("Error fetching artist data:", error);
        }
    };

    const handleAlbumClick = async (album) => {
        if (!album.id) return;
    
        navigate(`/album/${album.name}`, {
            state: {
                albumName: album.name,
                artistName: album.artists?.[0]?.name || 'Unknown Artist',
                albumLink: album.external_urls?.spotify,
                albumDate: album.release_date,
                albumImage: album.images?.[0]?.url || 'default-image-url',
                accessToken, 
                albumID: album.id,
                artistID: album.artists?.[0]?.id || 'Unknown Artist ID'
            }
        });
    };

    const gotoAlbumsPage = () => {
        navigate("/search-album");
    };

    return (
        <>  
            <NavBar />

            <div className="Search-page">
                <div className="Artist-album-buttons-container">
                    <Button className="Filter-button Artists-button">Artists</Button>
                    <Button className="Filter-button Albums-button" onClick={gotoAlbumsPage}>Albums</Button>
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
                    <Button onClick={searchArtist}>Search</Button>
                </InputGroup>

                <div className="Album-list">
                    {albums.map((album, i) => (
                        <div key={i} className="Album-card" onClick={() => handleAlbumClick(album)}>
                            <img 
                                className="Album-card-image"
                                src={album.images[0]?.url || 'default-image-url'} 
                                alt={album.name}
                            />
                            <div>
                                <h1 className="Album-card-title">{album.name}</h1>
                                <p className="Album-card-info">
                                    {album.release_date?.substring(0, 4)} · {album.artists[0]?.name || 'Unknown Artist'}
                                </p>
                            </div>
                        </div>
                    ))}                
                </div>
            </div>
        </>
    );
};
