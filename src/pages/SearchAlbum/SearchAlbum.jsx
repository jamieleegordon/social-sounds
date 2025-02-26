import { NavBar } from "../../components/NavBar/NavBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import './SearchAlbum.css';
import { useEffect, useState } from "react";
import { getAccessToken, searchAlbums } from "../../api/SearchAlbum";
import { useNavigate } from "react-router-dom";
import { selectRandomAlbum } from "../../helper/albums";

export const SearchAlbumPage = () => {
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

    const [searchAlbumInput, setSearchAlbumInput] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [albums, setAlbums] = useState([]);

    const randomAlbum = selectRandomAlbum();
    const navigate = useNavigate();

    useEffect(() => {
        getAccessToken(CLIENT_ID, CLIENT_SECRET)
            .then(token => {
                console.log("Access Token:", token);
                if (!token) {
                    throw new Error("Failed to retrieve access token");
                }
                setAccessToken(token);
                setSearchAlbumInput(randomAlbum);
                searchForAlbums(randomAlbum, token); 
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
    
    return (
        <>
            <NavBar />

            <div className="Search-page-two">
                <div className="Artist-album-buttons-container">
                    <Button
                        className="Filter-button Artists-button-two"
                        onClick={() => navigate("/search")}
                    >
                        Artists
                    </Button>
                    <Button className="Filter-button Albums-button-two">
                        Albums
                    </Button>
                </div>

                <InputGroup className="mb-3 Search-artist-input" size="lg">
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

                <div className="Album-list">
                    {albums.map((album, i) => (
                        <div key={i} className="Album-card" onClick={() => handleAlbumClick(album)}>
                            <img
                                className="Album-card-image"
                                src={album.images?.[0]?.url || 'default-image-url'}
                                alt={album.name}
                            />
                            <div>
                                <h1 className="Album-card-title">{album.name}</h1>
                                <p className="Album-card-info">
                                    {album.release_date?.substring(0, 4)} · {album.artists?.[0]?.name || 'Unknown Artist'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
