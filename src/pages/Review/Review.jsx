import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { NavBar } from "../../components/NavBar/NavBar";
import { getTracksFromAlbum } from "../../api/GetAlbumTracks"; 
import './Review.css';
import { ArrowBackIos, PlayCircle } from '@mui/icons-material';
import { formatDate } from '../../helper/formatDate';
import { IconButton, Tooltip } from '@mui/material';
import { getAlbumsByArtistId } from '../../api/SearchArtist';
import { ReviewsBarChart } from '../../components/ReviewDataVis/ReviewsBarChart';
import { ReviewsRadarChart } from '../../components/ReviewDataVis/ReviewsRadarChart';
import { ReviewsPieChart } from '../../components/ReviewDataVis/ReviewsPieChart';
import { ReviewAreaChart } from '../../components/ReviewDataVis/ReviewsAreaChart';
import { ReviewLineBar } from '../../components/ReviewDataVis/ReviewLineBar';
import { ReviewForm } from '../../components/ReviewForm/ReviewForm';
import { useAlbumReviews } from '../../hooks/getAlbumReviews';
import { useAuth } from '../../context/AuthContext';
import { getUsername } from '../../hooks/getUsername';

export const ReviewPage = () => {
    const location = useLocation(); 

    const { 
        albumName, 
        artistName, 
        albumLink, 
        albumDate, 
        albumImage, 
        accessToken, 
        albumID,
        artistID
    } = location.state || {};

    const { user } = useAuth();
    const currentUserEmail = user?.email; 

    const [username, setUsername] = useState("");

    const [albumTracks, setAlbumTracks] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    const [moreAlbums, setMoreAlbums] = useState([]);

    const navigate = useNavigate()

    const { reviews } = useAlbumReviews(albumName, artistName);

    const [averageRating, setAverageRating] = useState(0)

    const generateAverageRating = () => {
        if (reviews.length === 0) {
            setAverageRating(0);  
            return;
        }
    
        let ratingsSum = 0;
    
        reviews.forEach((review) => {
            ratingsSum += Number(review.rating);  
        });
    
        const average = ratingsSum / reviews.length;
        setAverageRating(average.toFixed(1));  
    };
    
    useEffect(() => {
        generateAverageRating();
    }, [reviews]); 

    const [ratingDistribution, setRatingDistribution] = useState({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0
    });
    
    useEffect(() => {
        const countRatings = () => {
            const distribution = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0
            };
    
            reviews.forEach((review) => {
                const rating = review.rating;
                if (rating >= 1 && rating <= 10) {
                    distribution[rating]++;
                }
            });
    
            setRatingDistribution(distribution);
        };
    
        countRatings();
    }, [reviews]); // Re-run when reviews change
    
    // some sort of artwork consisting of words people have described the album ??

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

    useEffect(() => {
        if (accessToken && artistID) {
            const fetchMoreAlbums = async () => {
                try {
                    const albums = await getAlbumsByArtistId(accessToken, artistID);
                    setMoreAlbums(albums);
                } catch (error) {
                    console.error('Error fetching more albums:', error);
                }
            };

            fetchMoreAlbums();
        }
    }, [accessToken, artistID]);

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

        scrollToTop()
    };

    const goBack = () => {
        navigate("/search")
    }

    const scrollToTop = () => {
        window.scrollTo(0, 0);
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
                            <h1 id = "Album-name">{albumName}</h1>
                            <h3 id="Artist-name">{artistName}</h3>
                            <p>{formatDate(albumDate)}</p>

                            <a href={albumLink} target="_blank" rel="noopener noreferrer">
                                <Tooltip title="Play on Spotify" arrow>
                                    <IconButton
                                        className="PlayCircle"
                                        sx={{
                                            width: 80, 
                                            height: 80, 
                                            display: 'flex', 
                                            justifyContent: 'center', 
                                            alignItems: 'center', 
                                            borderRadius: '50%',
                                            padding: 0
                                        }}
                                    >
                                        <PlayCircle
                                            sx={{
                                                color: '#F70B2C', 
                                                fontSize: '60px',
                                                marginLeft: '-15px'
                                            }}
                                        />
                                    </IconButton>
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
                            <Tooltip title="Play on Spotify" arrow key = {track.id}>
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

                    <h1 className='Header-titles'>Rate and review</h1>

                    <ReviewForm 
                        albumName={albumName} 
                        artistName={artistName} 
                        username={username} 
                        tracks={albumTracks}
                    />
                    
                    <h1 className='Header-titles'>Reviews for {albumName}</h1>
                    
                    <div>
                        {reviews.length > 0 ? (
                            reviews
                                .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)  // Sort by createdAt, newest first
                                .map((review) => (
                                    <div key={new Date(review.createdAt.seconds * 1000).toLocaleString()}>
                                        <p><strong>{review.username}:</strong> {review.review}</p>
                                        <p>Rating: {review.rating}</p>
                                        <p>Favorite Song: {review.favSong}</p>
                                        <p>{new Date(review.createdAt.seconds * 1000).toLocaleString()}</p>
                                    </div>
                                ))
                        ) : (
                            <p>No reviews have been made for this album, be the first!.</p>
                        )}
                    </div>

                    <h1 className='Header-titles'>Ratings for {albumName}</h1>
                    
                    <div className='Average-rating'>
                        <h1>{averageRating}</h1>
                        
                    </div>

                    <div className='Ratings-container'>
                        <h3>Rating Distribution:</h3>
                        <ul>
                            {Object.keys(ratingDistribution).map((rating) => (
                                <li key={rating}>
                                    {rating} Star: {ratingDistribution[rating]} vote{ratingDistribution[rating] !== 1 && 's'}
                                </li>
                            ))}
                        </ul>
                        
                        <ReviewsBarChart />

                        <div className='Area-Line-Graph-section'>
                            <ReviewAreaChart /> 

                            <ReviewLineBar />
                        </div>

                        <div className='Radar-Pie-Chart-section'>
                            <ReviewsRadarChart />

                            <ReviewsPieChart />   
                        </div>
                        
                    </div>

                    <h1 className='Header-titles'>{albumName} Stats and Breakdown</h1>

                    <h1 className='Header-titles'>More from {artistName}</h1>
                    <div className="More-albums-wrapper">
                        <div className="More-albums-container">
                            <div className="More-albums-grid">
                                {moreAlbums
                                    .filter((album) => album.name !== albumName) 
                                    .map((album) => (
                                        <div 
                                            key={album.id} 
                                            className="Album-card" 
                                            onClick={() => handleAlbumClick(album)}
                                        >
                                            <img 
                                                className="Album-card-image"
                                                src={album.images[0]?.url || 'default-image-url'} 
                                                alt={album.name}
                                            />
                                            <div>
                                                <h1 className="Album-card-title">{album.name}</h1>
                                                <p className="Album-card-info">
                                                    {album.release_date?.substring(0, 4)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    <div className = "Recommended-albums-container">
                        <h1 className='Header-titles'>Recommended Albums</h1>
                    </div>
                </div>
                
            </div>
        </>
    );
};
