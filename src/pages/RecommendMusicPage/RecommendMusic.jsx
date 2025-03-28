import { useEffect, useState } from "react";
import { NavBar } from "../../components/NavBar/NavBar";
import './RecommendMusic.css';
import { useAuth } from "../../context/AuthContext";
import { getUsername } from "../../hooks/getUsername";
import { checkFiveReviews } from "../../hooks/checkFiveReviews";
import { getAccessToken, searchAlbums } from "../../api/SearchAlbum";
import { getAverageEnergy } from "../../hooks/getEnergyStats";
import { getAverageDanceability } from "../../hooks/getDanceabilityStats";
import { getAverageTempo } from "../../hooks/getTempoStats";
import { getAverageValence } from "../../hooks/getValenceStats";
import { getAverageAcousticness } from "../../hooks/getAcousticnessStats";
import { getAverageInstrumentalness } from "../../hooks/getInstrumentalnessStats";
import { getAverageKey } from "../../hooks/getKeyStats";
import { getAverageKeyChanges } from "../../hooks/getKeyChangesStats";
import { getAverageLiveness } from "../../hooks/getLivenessStats";
import { getAverageLoudness } from "../../hooks/getLoudnessStats";
import { getAverageMode } from "../../hooks/getModeStats";
import { getAveragePitch } from "../../hooks/getPitchStats";
import { getAverageSpeechiness } from "../../hooks/getSpeechinessStats";
import { getAverageTimeSignature } from "../../hooks/getTimeSignature";
import { useNavigate } from "react-router-dom";
import { getFavGenre } from "../../hooks/getFavGenre";

export const RecommendMusicPage = () => {

    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

    const [accessToken, setAccessToken] = useState("");

    const [generalRecommendations, setGeneralRecommendations] = useState([])
    const [energyRecommendations, setEnergyRecommendations] = useState([])
    const [tempoRecommendations, setTempoRecommendations] = useState([])
    const [valenceRecommendations, setValenceRecommendations] = useState([])
    const [genreRecommendations, setGenreRecommendations] = useState([])

    const [mostListenedToGenre, setMostListenedToGenre] = useState("")

    const [recommendationsFetched, setRecommendationsFetched] = useState(false);
    const [hasFiveReviews, setHasFiveReviews] = useState(false);
    const { user } = useAuth();
    const currentUserEmail = user?.email;
    const [username, setUsername] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        getAccessToken(CLIENT_ID, CLIENT_SECRET)
            .then(token => {
                if (token) setAccessToken(token);
            })
            .catch(error => console.error('Error fetching access token:', error));
    }, []);

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
        const fetchFavGenre = async () => {
            const favGenre = await getFavGenre(username)
            setMostListenedToGenre(favGenre)
        }
        
        fetchFavGenre()
    }, [username])

    useEffect(() => {
        const checkUserHasFiveReviews = async () => {
            if (username) {
                const hasFive = await checkFiveReviews(username);
                setHasFiveReviews(hasFive);
            }
        };
        if (username) {
            checkUserHasFiveReviews();
        }
    }, [username]);

    // Fetch both general and energy-based recommendations when user has 5 reviews and recommendations haven't been fetched yet
    useEffect(() => {
        if (hasFiveReviews && !recommendationsFetched) {
            fetchGeneralRecommendations(); 
            fetchEnergyRecommendations(); 
            fetchTempoRecommendations();
            fetchValenceRecommendations();
            fetchGenreRecommendations();
        }
    }, [hasFiveReviews, recommendationsFetched]);

    const fetchGeneralRecommendations = async () => {
        const avgEnergy = await getAverageEnergy(username);
        const avgDanceability = await getAverageDanceability(username);
        const avgTempo = await getAverageTempo(username);
        const avgValence = await getAverageValence(username);
        const avgAcousticness = await getAverageAcousticness(username);
        const avgInstrumentalness = await getAverageInstrumentalness(username);
        const avgKey = await getAverageKey(username);
        const avgKeyChange = await getAverageKeyChanges(username);
        const avgLiveness = await getAverageLiveness(username);
        const avgLoudness = await getAverageLoudness(username);
        const avgMode = await getAverageMode(username);
        const avgPitch = await getAveragePitch(username);
        const avgSpeechiness = await getAverageSpeechiness(username);
        const avgTimeSignature = await getAverageTimeSignature(username);

        const averages = `Energy: ${avgEnergy}
            Danceability: ${avgDanceability}
            Tempo: ${avgTempo}
            Valence: ${avgValence}
            Acousticness: ${avgAcousticness}
            Instrumentalness: ${avgInstrumentalness}
            Key: ${avgKey}
            Key changes: ${avgKeyChange}
            Liveness: ${avgLiveness}
            Loudness: ${avgLoudness}
            Mode: ${avgMode}
            Pitch: ${avgPitch}
            Speechiness: ${avgSpeechiness}
            Time Signature: ${avgTimeSignature}`;

        try {
            const response = await fetch('https://ss-server-tan.vercel.app/api/recommendAlbumsGeneral', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: averages }),
            });

            const data = await response.json();

            if (data.recommendations) {
                const parsedRecommendations = JSON.parse(data.recommendations);
                console.log(parsedRecommendations);
                const albumExplanations = parsedRecommendations.albums.map((album) => album.explanation);
                const albumNames = parsedRecommendations.albums.map((album) => album.albumName);
                fetchSpotifyAlbums(albumNames, albumExplanations, setGeneralRecommendations);
            } else {
                console.error("No recommendations received:", data);
            }
        } catch (err) {
            console.error("Error getting GPT recommendations:", err);
        }
    };

    const fetchEnergyRecommendations = async () => {
        const avgEnergy = await getAverageEnergy(username);
        
        // Create the text to pass to the API, only including avgEnergy
        const energyText = `Energy: ${avgEnergy}, but recommend more unknown/less popular artists, albums with low streams`;

        try {
            const response = await fetch('https://ss-server-tan.vercel.app/api/recommendAlbumsGeneral', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: energyText }), // Pass only the avgEnergy
            });

            const data = await response.json();

            if (data.recommendations) {
                const parsedRecommendations = JSON.parse(data.recommendations);
                console.log(parsedRecommendations);
                const albumExplanations = parsedRecommendations.albums.map((album) => album.explanation);
                const albumNames = parsedRecommendations.albums.map((album) => album.albumName);
                fetchSpotifyAlbums(albumNames, albumExplanations, setEnergyRecommendations);
            } else {
                console.error("No recommendations received:", data);
            }
        } catch (err) {
            console.error("Error getting energy-based recommendations:", err);
        }
    };

    const fetchTempoRecommendations = async () => {
        const avgTempo = await getAverageTempo(username);
        
        // Create the text to pass to the API, only including avgEnergy
        const tempoText = `Tempo: ${avgTempo}, but recommend more unknown/less popular artists, albums with low streams`;

        try {
            const response = await fetch('https://ss-server-tan.vercel.app/api/recommendAlbumsGeneral', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: tempoText }), // Pass only the avgEnergy
            });

            const data = await response.json();

            if (data.recommendations) {
                const parsedRecommendations = JSON.parse(data.recommendations);
                console.log(parsedRecommendations);
                const albumExplanations = parsedRecommendations.albums.map((album) => album.explanation);
                const albumNames = parsedRecommendations.albums.map((album) => album.albumName);
                fetchSpotifyAlbums(albumNames, albumExplanations, setTempoRecommendations);
            } else {
                console.error("No recommendations received:", data);
            }
        } catch (err) {
            console.error("Error getting tempo-based recommendations:", err);
        }
    };

    const fetchValenceRecommendations = async () => {
        const avgValence = await getAverageTempo(username);
        
        // Create the text to pass to the API, only including avgEnergy
        const ValenceText = `Valence: ${avgValence}, but recommend more unknown/less popular artists, albums with low streams`;

        try {
            const response = await fetch('https://ss-server-tan.vercel.app/api/recommendAlbumsGeneral', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: ValenceText }), // Pass only the avgEnergy
            });

            const data = await response.json();

            if (data.recommendations) {
                const parsedRecommendations = JSON.parse(data.recommendations);
                console.log(parsedRecommendations);
                const albumExplanations = parsedRecommendations.albums.map((album) => album.explanation);
                const albumNames = parsedRecommendations.albums.map((album) => album.albumName);
                fetchSpotifyAlbums(albumNames, albumExplanations, setValenceRecommendations);
            } else {
                console.error("No recommendations received:", data);
            }
        } catch (err) {
            console.error("Error getting Valence-based recommendations:", err);
        }
    };

    const fetchGenreRecommendations = async () => {
        const genreText = `Fav Genre: ${mostListenedToGenre}, but recommend more unknown/less popular artists, albums with low streams`;

        try {
            const response = await fetch('https://ss-server-tan.vercel.app/api/recommendAlbumsGeneral', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: genreText }), // Pass only the avgEnergy
            });

            const data = await response.json();

            if (data.recommendations) {
                const parsedRecommendations = JSON.parse(data.recommendations);
                console.log(parsedRecommendations);
                const albumExplanations = parsedRecommendations.albums.map((album) => album.explanation);
                const albumNames = parsedRecommendations.albums.map((album) => album.albumName);
                fetchSpotifyAlbums(albumNames, albumExplanations, setGenreRecommendations);
            } else {
                console.error("No recommendations received:", data);
            }
        } catch (err) {
            console.error("Error getting Valence-based recommendations:", err);
        }
    };

    const fetchSpotifyAlbums = async (albumNames, albumExplanations, setRecommendations) => {
        const albums = [];
        for (let i = 0; i < albumNames.length; i++) {
            const albumName = albumNames[i];
            const albumData = await searchAlbums(albumName, accessToken);
            if (albumData.length > 0) {
                const album = albumData[0]; // Assuming we get the first result as the most relevant
                const explanation = albumExplanations[i] || `Recommended because of your music preferences in energy, danceability, and other factors.`;

                albums.push({
                    albumName: album.name,
                    artistName: album.artists[0].name,
                    releaseDate: album.release_date,
                    imageUrl: album.images[0]?.url,
                    albumLink: album.external_urls?.spotify,
                    id: album.id,
                    artistID: album.artists[0]?.id,
                    explanation: explanation,
                });
            }
        }

        setRecommendations(albums);
        setRecommendationsFetched(true);
    };

    const handleAlbumClick = async (album) => {
        if (!album.id) return;

        navigate(`/album/${album.albumName}`, {
            state: {
                albumName: album.albumName,
                artistName: album.artistName,
                albumLink: album.albumLink,
                albumDate: album.releaseDate,
                albumImage: album.imageUrl,
                accessToken,
                albumID: album.id,
                artistID: album.artistID,
            }
        });
    };

    return (
        <>
            <NavBar />
            <div className="RecommendMusicPage">
                <h1>Your recommended music</h1>
                <p>Here you can find all your personalised music recommendations! Made with the power of AI! ✨🎵</p>

                {hasFiveReviews ? (
                    <div>
                        <p>It may take a while to load all recommendations. Please wait.</p>
                        <h1 className="Recommendation-title">Recommended for you (Based on all your stats!)</h1>
                        <div className="Album-list">
                            {generalRecommendations.length > 0 ? (
                                generalRecommendations.map((recommendation, index) => (
                                    <div key={index} className="Album-card" onClick={() => handleAlbumClick(recommendation)}>
                                        <img className="Album-card-image" src={recommendation.imageUrl} alt={recommendation.albumName} />
                                        <div className="Album-card-bottom">
                                            <h2 className="Album-card-title">{recommendation.albumName}</h2>
                                            <h3 className="Album-card-info">{recommendation.releaseDate?.substring(0, 4)} · {recommendation.artistName}</h3>
                                            <p className="Album-card-info">{recommendation.explanation}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Loading general recommendations...</p>
                            )}
                        </div>

                        <h1 className="Recommendation-title">Recommended for you (Energy-based)</h1>
                        <div className="Album-list">
                            {energyRecommendations.length > 0 ? (
                                energyRecommendations.map((recommendation, index) => (
                                    <div key={index} className="Album-card" onClick={() => handleAlbumClick(recommendation)}>
                                        <img className="Album-card-image" src={recommendation.imageUrl} alt={recommendation.albumName} />
                                        <div className="Album-card-bottom">
                                            <h2 className="Album-card-title">{recommendation.albumName}</h2>
                                            <h3 className="Album-card-info">{recommendation.releaseDate?.substring(0, 4)} · {recommendation.artistName}</h3>
                                            <p className="Album-card-info">{recommendation.explanation}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Loading energy-based recommendations...</p>
                            )}
                        </div>

                        <h1 className="Recommendation-title">Recommended for you (Tempo-based)</h1>
                        <div className="Album-list">
                            {tempoRecommendations.length > 0 ? (
                                tempoRecommendations.map((recommendation, index) => (
                                    <div key={index} className="Album-card" onClick={() => handleAlbumClick(recommendation)}>
                                        <img className="Album-card-image" src={recommendation.imageUrl} alt={recommendation.albumName} />
                                        <div className="Album-card-bottom">
                                            <h2 className="Album-card-title">{recommendation.albumName}</h2>
                                            <h3 className="Album-card-info">{recommendation.releaseDate?.substring(0, 4)} · {recommendation.artistName}</h3>
                                            <p className="Album-card-info">{recommendation.explanation}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Loading tempo-based recommendations...</p>
                            )}
                        </div>

                        <h1 className="Recommendation-title">Recommended for you (Valence-based)</h1>
                        <div className="Album-list">
                            {valenceRecommendations.length > 0 ? (
                                valenceRecommendations.map((recommendation, index) => (
                                    <div key={index} className="Album-card" onClick={() => handleAlbumClick(recommendation)}>
                                        <img className="Album-card-image" src={recommendation.imageUrl} alt={recommendation.albumName} />
                                        <div className="Album-card-bottom">
                                            <h2 className="Album-card-title">{recommendation.albumName}</h2>
                                            <h3 className="Album-card-info">{recommendation.releaseDate?.substring(0, 4)} · {recommendation.artistName}</h3>
                                            <p className="Album-card-info">{recommendation.explanation}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Loading Valence-based recommendations...</p>
                            )}
                        </div>

                        <h1 className="Recommendation-title">Recommended for you (Genre-based)</h1>
                        <div className="Album-list">
                            {genreRecommendations.length > 0 ? (
                                genreRecommendations.map((recommendation, index) => (
                                    <div key={index} className="Album-card" onClick={() => handleAlbumClick(recommendation)}>
                                        <img className="Album-card-image" src={recommendation.imageUrl} alt={recommendation.albumName} />
                                        <div className="Album-card-bottom">
                                            <h2 className="Album-card-title">{recommendation.albumName}</h2>
                                            <h3 className="Album-card-info">{recommendation.releaseDate?.substring(0, 4)} · {recommendation.artistName}</h3>
                                            <p className="Album-card-info">{recommendation.explanation}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Loading Genre-based recommendations...</p>
                            )}
                        </div>    

                    </div>
                ) : (
                    <p>Review 5 albums first</p>
                )}
            </div>
        </>
    );
};
