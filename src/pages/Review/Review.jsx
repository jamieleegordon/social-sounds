import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { NavBar } from "../../components/NavBar/NavBar";
import { getTracksFromAlbum } from "../../api/GetAlbumTracks"; 
import './Review.css';
import { ArrowBackIos, PlayCircle } from '@mui/icons-material';
import { formatDate } from '../../helper/formatDate';
import { IconButton, Tooltip } from '@mui/material';

export const ReviewPage = () => {
    const location = useLocation(); 

    const { 
        albumName, 
        artistName, 
        albumLink, 
        albumDate, 
        albumImage, 
        accessToken, 
        albumID 
    } = location.state || {};

    const [albumTracks, setAlbumTracks] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        if (accessToken && albumID) {
            const fetchTracks = async () => {
                try {
                    setLoading(true); 
                    const tracks = await getTracksFromAlbum(accessToken, albumID);
                    setAlbumTracks(tracks); 
                    setLoading(false); 
                } catch (err) {
                    console.error('Error fetching tracks:', err);
                    setError('Error fetching tracks.');
                    setLoading(false); 
                }
            };

            fetchTracks();
        }
    }, [accessToken, albumID]); 

    const goBack = () => {
        navigate("/search")
    }

    return (
        <>
            <NavBar />

            <div className="ReviewPage">

                <div className="Top-section">

                    <Tooltip title="Back" arrow>
                        <IconButton onClick={goBack} className="Back-button">
                            <ArrowBackIos />
                        </IconButton>
                    </Tooltip>

                    <div className="Album-info-container">
                        <div className="Album-image-container">
                            <img id="Album-image" src={albumImage} alt={albumName} />
                        </div>

                        <div className="Album-info">
                            <h3>Album</h3>
                            <h1>{albumName}</h1>
                            <h3 id="Artist-name">{artistName}</h3>
                            <p>{formatDate(albumDate)}</p>

                            <a href={albumLink} target="_blank" rel="noopener noreferrer">
                                <Tooltip title="Play on Spotify" arrow>
                                    <PlayCircle className="PlayCircle" />
                                </Tooltip>
                            </a>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <p>Loading tracks...</p> 
                ) : error ? (
                    <p>{error}</p> 
                ) : (
                    <ol>
                        {albumTracks.map((track, index) => (
                            <Tooltip title="Play on Spotify" arrow>
                                <li key={index}>
                                    <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                        <div className="Track">
                                            <div className="Track-number">{index + 1}</div>  
                                            <div className="Track-details">
                                                <div className="Track-name">{track.name}</div>
                                                <div className="Artist-name">{artistName}</div>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </Tooltip>
                        ))}
                    </ol>
                )}

                <div className='Bottom-section'>
                    <div className='Reviews-container'>
                        <h1>Reviews</h1>
                    </div>

                    <div classname = "More-albums-container">
                        <h1>More from {artistName}</h1>
                    </div>

                    <div classname = "Recommended-albums-container">
                        <h1>Recommended Albums</h1>
                    </div>
                </div>
                
            </div>
        </>
    );
};
