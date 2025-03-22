import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
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

    const [albumAnalysis, setAlbumAnalysis] = useState([])

    const hasAnalysedRef = useRef(false); // Use ref to track if analysis has been done

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
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0
    });
    
    useEffect(() => {
        const countRatings = () => {
            const distribution = {
                1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0
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

    useEffect(() => {
        if (hasAnalysedRef.current || !albumName) return; 
    
        const analyseAlbum = async () => {
            const albumText = `${albumName} by ${artistName}`; 
    
            try {
                const response = await fetch('https://ss-server-tan.vercel.app/api/analyseAlbum', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: albumText }), // Send album name for analysis
                });
    
                const data = await response.json();  
    
                if (data.albumAnalysis) {
                    // Parse the stringified JSON to an actual object
                    const parsedAnalysis = JSON.parse(data.albumAnalysis);
                    setAlbumAnalysis(parsedAnalysis.audio_features);  // Set the parsed JSON object in the state
                    console.log(parsedAnalysis.audio_features);  // Log the parsed analysis result
                    hasAnalysedRef.current = true; // Mark as done using ref (does not trigger re-renders)
                } else {
                    console.error("No analysis received:", data);
                }
            } catch (err) {
                console.error("Error getting GPT analysis:", err);
            }
        };
    
        analyseAlbum();
    }, [albumName]);  

    const [isOpen, setIsOpen] = useState({
        genre: false,
        danceability: false,
        energy: false,
        key: false,
        loudness: false,
        mode: false,
        speechiness: false,
        acousticness: false,
        instrumentalness: false,
        liveness: false,
        valence: false,
        tempo: false,
        keyChanges: false,
        timeSignature: false,
        featuredArtists: false,
        songThemes: false,
        peakEmotion: false,
        mostCommonInstrument: false,
        pitch: false,
        pace: false,
    });

    // Function to toggle visibility of explanation for each stat
    const toggleExplanation = (stat) => {
        setIsOpen(prevState => ({
            ...prevState,
            [stat]: !prevState[stat],
        }));
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
                        albumAnalysis = {albumAnalysis}
                    />
                    
                    <h1 className='Header-titles'>Reviews for {albumName}</h1>
                    
                    <div className='UserReviews'>
                        {reviews.length > 0 ? (
                            reviews
                                .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)  // Sort by createdAt, newest first
                                .map((review) => (
                                    <div className = "Review-card" key={new Date(review.createdAt.seconds * 1000).toLocaleString()}>
                                        <div className='Review-card-image-container'>
                                            <img src = {albumImage} alt = "Album"/>
                                        </div>
                                        <div className='Review-card-review-info-container'>
                                            <p><strong>{review.username}</strong></p>
                                            <p><i>{review.review}</i></p>
                                            <p><strong>Favorite Song: </strong>{review.favSong}</p>
                                            <p>{new Date(review.createdAt.seconds * 1000).toLocaleDateString('en-GB')}</p>
                                        </div>
                                        <div className='Review-card-rating-container'>
                                            <h1>{review.rating}</h1>
                                        </div>
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

                        {/* <ul>
                            {Object.keys(ratingDistribution).map((rating) => (
                                <li key={rating}>
                                    {rating} Star: {ratingDistribution[rating]} 
                                    vote{ratingDistribution[rating] !== 1 && 's'}
                                </li>
                            ))}
                        </ul> */}
                        
                        <ReviewsBarChart ratingDistribution={ratingDistribution} />

                        <div className='Area-Line-Graph-section'>
                            <ReviewAreaChart ratingDistribution={ratingDistribution} />
                            <ReviewLineBar ratingDistribution={ratingDistribution}/>
                        </div>

                        <div className='Radar-Pie-Chart-section'>
                            <ReviewsRadarChart ratingDistribution={ratingDistribution}/>
                            <ReviewsPieChart ratingDistribution={ratingDistribution}/>   
                        </div>
                        
                    </div>

                    <h1 className='Header-titles'>{albumName} Stats and Breakdown</h1>
                    <div className='Stats-container'>
                        <h3>Generated by AI ✨</h3>
                        <div>
                            <strong>Genre:</strong> {albumAnalysis.genre}
                            <i>
                                <button className= "genre-btn" onClick={() => toggleExplanation('genre')}>What does this mean?</button>
                            </i>
                        </div>

                        <div>
                            <strong>Danceability:</strong> {albumAnalysis.danceability}
                            <i>
                                <button onClick={() => toggleExplanation('danceability')}>What does this mean?</button>
                                {isOpen.danceability && (
                                    <p>Measure of how suitable a track is for dancing, based on factors like tempo, rhythm stability, beat strength, and overall musical elements that make a track feel groove-worthy. <br />
                                        <strong>0:</strong> The track is not suitable for dancing at all. It may have slow tempos, irregular beats, or a lack of rhythm, making it harder to dance to. <br />
                                        <strong>1:</strong> The track is highly suitable for dancing. It has a strong, consistent rhythm, a steady tempo, and clear beats, making it easy to groove and move along with the music.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Energy:</strong> {albumAnalysis.energy}
                            <i>
                                <button onClick={() => toggleExplanation('energy')}>What does this mean?</button>
                                {isOpen.energy && (
                                    <p>Measure of the intensity and activity level of a track. Higher energy tracks feel more lively and upbeat, while lower energy tracks are calmer or more relaxed. <br />
                                        <strong>0:</strong> The track is very calm and relaxing, with slow tempos, minimal instrumentation, and little to no aggression or intensity. <br />
                                        <strong>1:</strong> The track is high-energy, fast-paced, and intense, with a lot of dynamic elements, strong beats, and often an upbeat or aggressive feel.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Key:</strong> {albumAnalysis.key}
                            <i>   
                                <button onClick={() => toggleExplanation('key')}>What does this mean?</button>
                                {isOpen.key && (
                                    <p>The musical key of the album, which defines the tonal center and the scale used in the music. <br />
                                        <strong>0-11:</strong> Represents the 12 different keys in Western music, with 0 typically corresponding to C, 1 to C#, and so on.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Loudness:</strong> {albumAnalysis.loudness}
                            <i>
                                <button onClick={() => toggleExplanation('loudness')}>What does this mean?</button>
                                {isOpen.loudness && (
                                    <p>The overall loudness of the album, measured in decibels (dB). A lower value means quieter, while a higher value means louder. <br />
                                        <strong>Negative values:</strong> Indicates that the track is quieter than the reference level. <br />
                                        <strong>0 dB:</strong> Indicates the maximum loudness level without distortion.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Mode:</strong> {albumAnalysis.mode}
                            <i>
                                <button onClick={() => toggleExplanation('mode')}>What does this mean?</button>
                                {isOpen.mode && (
                                    <p>Musical mode that describes the general tonality of the track. <br />
                                        <strong>0:</strong> Represents a minor key (often more melancholic). <br />
                                        <strong>1:</strong> Represents a major key (often more upbeat and happy).
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Speechiness:</strong> {albumAnalysis.speechiness}
                            <i>
                                <button onClick={() => toggleExplanation('speechiness')}>What does this mean?</button>
                                {isOpen.speechiness && (
                                    <p>Measures the presence of spoken words in a track. Higher values indicate more speech-like content. <br />
                                        <strong>0:</strong> No speech-like content. <br />
                                        <strong>1:</strong> The track is entirely made up of speech or spoken words.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Acousticness:</strong> {albumAnalysis.acousticness}
                            <i>
                                <button onClick={() => toggleExplanation('acousticness')}>What does this mean?</button>
                                {isOpen.acousticness && (
                                    <p>Measures the amount of acoustic sound in a track, as opposed to electronically produced sound. <br />
                                        <strong>0:</strong> The track is completely electronic. <br />
                                        <strong>1:</strong> The track is fully acoustic, without any electronic production.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Instrumentalness:</strong> {albumAnalysis.instrumentalness}
                            <i>  
                                <button onClick={() => toggleExplanation('instrumentalness')}>What does this mean?</button>
                                {isOpen.instrumentalness && (
                                    <p>Measures how much instrumental content is present in the track, with no vocals. <br />
                                        <strong>0:</strong> The track has vocals and is not purely instrumental. <br />
                                        <strong>1:</strong> The track is entirely instrumental, with no vocals present.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Liveness:</strong> {albumAnalysis.liveness}
                            <i>
                                <button onClick={() => toggleExplanation('liveness')}>What does this mean?</button>
                                {isOpen.liveness && (
                                    <p>Indicates how likely the track was recorded in front of a live audience. Higher values indicate more live performance feel. <br />
                                        <strong>0:</strong> No live audience or performance. <br />
                                        <strong>1:</strong> The track has a high degree of live performance quality.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Valence:</strong> {albumAnalysis.valence}
                            <i>
                                <button onClick={() => toggleExplanation('valence')}>What does this mean?</button>
                                {isOpen.valence && (
                                    <p>Measures the positivity or happiness of the track. <br />
                                        <strong>0:</strong> Very negative or sad track. <br />
                                        <strong>1:</strong> Very positive or happy track.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Tempo:</strong> {albumAnalysis.tempo}
                            <i>
                                <button onClick={() => toggleExplanation('tempo')}>What does this mean?</button>
                                {isOpen.tempo && (
                                    <p>The tempo of the track, measured in beats per minute (BPM). <br />
                                        <strong>60 BPM:</strong> A slow track, often mellow or introspective. <br />
                                        <strong>200 BPM:</strong> A fast-paced track, often energetic or intense.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Key Changes:</strong> {albumAnalysis.key_changes}
                            <i>
                                <button onClick={() => toggleExplanation('keyChanges')}>What does this mean?</button>
                                {isOpen.keyChanges && (
                                    <p>The number of times the track changes key throughout its duration. <br />
                                        <strong>0:</strong> No key changes, the song remains in a single key. <br />
                                        <strong>1+</strong> There are multiple key changes, adding complexity to the song.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Time Signature:</strong> {albumAnalysis.time_signature}
                            <i> 
                                <button onClick={() => toggleExplanation('timeSignature')}>What does this mean?</button>
                                {isOpen.timeSignature && (
                                    <p>The time signature indicates the number of beats per measure in the track. <br />
                                        <strong>4:</strong> Common time signature (4/4), often used in pop and rock. <br />
                                        <strong>3:</strong> 3/4 time, commonly used for waltzes.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                        <strong>Popular Featured Artists: </strong> 
                            {albumAnalysis.featured_artists && albumAnalysis.featured_artists.length > 0 
                                ? albumAnalysis.featured_artists.join(', ') 
                                : 'No featured artists available'}
                            <i>
                                <button onClick={() => toggleExplanation('featuredArtists')}>What does this mean?</button>
                                {isOpen.featuredArtists && (
                                    <p>Names of featured artists in the album or song. <br />
                                        These artists collaborate on specific tracks and add their own influence to the music.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                        <strong>Song Themes: </strong> 
                            {albumAnalysis.song_themes && albumAnalysis.song_themes.length > 0 
                                ? albumAnalysis.song_themes.join(', ') 
                                : 'No themes available'}
                            <i>
                                <button onClick={() => toggleExplanation('songThemes')}>What does this mean?</button>
                                {isOpen.songThemes && (
                                    <p>Common themes or subjects addressed within the song's lyrics. <br />
                                        These could include emotions, relationships, or specific life experiences.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Peak Emotion:</strong> {albumAnalysis.peak_emotion}
                            <i>
                                <button onClick={() => toggleExplanation('peakEmotion')}>What does this mean?</button>
                                {isOpen.peakEmotion && (
                                    <p>The primary emotion or feeling conveyed by the track at its peak. <br />
                                        This could range from joy to sadness, depending on the mood of the song.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Most Common Instrument:</strong> {albumAnalysis.most_common_instrument}
                            <i>
                                <button onClick={() => toggleExplanation('mostCommonInstrument')}>What does this mean?</button>
                                {isOpen.mostCommonInstrument && (
                                    <p>The instrument most commonly used throughout the song. <br />
                                        This could be a guitar, piano, synthesizer, or other instruments depending on the genre.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Pitch:</strong> {albumAnalysis.pitch}
                            <i>
                                <button onClick={() => toggleExplanation('pitch')}>What does this mean?</button>
                                {isOpen.pitch && (
                                    <p>Measures the perceptual height of the track's tone. <br />
                                        Higher pitch values mean the track is in a higher register, while lower values mean it is deeper.
                                    </p>
                                )}
                            </i>
                        </div>

                        <div>
                            <strong>Pace:</strong> {albumAnalysis.pace}
                            <i>
                                <button onClick={() => toggleExplanation('pace')}>What does this mean?</button>
                                {isOpen.pace && (
                                    <p>Measures the speed or tempo of the track. <br />
                                        A faster pace means a faster rhythm, while a slower pace indicates a more relaxed or laid-back feel.
                                    </p>
                                )}
                            </i>
                        </div>
                    </div>

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

                    {/* <div className = "Recommended-albums-container">
                        <h1 className='Header-titles'>Recommended Albums</h1>
                    </div> */}
                </div>
                
            </div>
        </>
    );
};
