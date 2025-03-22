import { useEffect, useState } from 'react'
import { NavBar } from '../../components/NavBar/NavBar'
import './ListeningStats.css'
import { getFavGenre } from '../../hooks/getFavGenre'
import { useAuth } from '../../context/AuthContext'
import { getUsername } from '../../hooks/getUsername'
import { getFavArtist } from '../../hooks/getFavArtist'
import { EnergyStats } from '../../components/ListeningStatsDataVis/EnergyStats'
import { DanceabilityStats } from '../../components/ListeningStatsDataVis/DanceabilityStats'
import AcousticnessStats from '../../components/ListeningStatsDataVis/AcousticnessStats'
import InstrumentalnessStats from '../../components/ListeningStatsDataVis/InstrumentalnessStats'

export const ListeningStatsPage = () => {

    const { user } = useAuth();
    const currentUserEmail = user?.email; 
    const [username, setUsername] = useState("")

    const [mostListenedToGenre, setMostListenedToGenre] = useState("")
    const [mostListenedToArtist, setMostListenedToArtist] = useState("")

    useEffect(() => {
        const fetchUsername = async () => {
            if (currentUserEmail) {
                const fetchedUsername = await getUsername(currentUserEmail);
                setUsername(fetchedUsername || "User"); 
            }
        };
    
        fetchUsername()
    }, [currentUserEmail])

    useEffect(() => {
        const fetchFavGenre = async () => {
            const favGenre = await getFavGenre(username)
            setMostListenedToGenre(favGenre)
            console.log(favGenre)
        }

        fetchFavGenre()
    }, [username])

    useEffect(() => {
        const fetchFavArtist = async () => {
            const favArtist = await getFavArtist(username)
            setMostListenedToArtist(favArtist)
            console.log(favArtist)
        }

        fetchFavArtist()
    }, [username])    

    // recommend based on genre, energy, dance etc
    return (
        <>
            <NavBar />

            <div className='ListeningStatsPage'>
                <h1 className='ListeningStatsPage-header'>Listening Stats</h1>
                <p>Here, you can find your personalised listening stats, breaking down all your habits! 🎸</p>
            
            <div className='ListeningStatsPage-stats-section'>
                <div className='Stats-block-top'>
                    <div>
                      <h2>Most listened to genre</h2>
                      <h3>{mostListenedToGenre}</h3>  
                    </div>
                    <div>
                        <h2>Most listened to artist</h2>
                        <h3>{mostListenedToArtist}</h3>
                    </div>
                </div>

                <h5>Below you will find your personalised stats and breakdowns on your listening habits! these are based on all the albums you have been listening to!</h5>

                <div className='Stats-block'>
                    <div className='Explanation'>
                        <h3>Energy</h3>  
                        <p>
                            <strong>0:</strong> The track is very calm and relaxing, with slow tempos, minimal instrumentation, and little to no aggression or intensity. <br />
                            <strong>1:</strong> The track is high-energy, fast-paced, and intense, with a lot of dynamic elements, strong beats, and often an upbeat or aggressive feel.
                        </p>
                    </div>
                    <EnergyStats username = {username}/>
                </div>

                <div className='Stats-block'>
                    <div className='Explanation'>
                        <h3>Danceability</h3>  
                        <p>
                            <strong>0:</strong> The track is not suitable for dancing at all. It may have slow tempos, irregular beats, or a lack of rhythm, making it harder to dance to. <br />
                            <strong>1:</strong> The track is highly suitable for dancing. It has a strong, consistent rhythm, a steady tempo, and clear beats, making it easy to groove and move along with the music.
                        </p>
                    </div>
                    <DanceabilityStats username = {username}/>
                </div>

                <div className='Stats-block'>
                    <div className='Explanation'>
                        <h3>Acousticness</h3>  
                        <p>
                            <strong>0:</strong> The track is completely electronic. <br />
                            <strong>1:</strong> The track is fully acoustic, without any electronic production.
                        </p>
                    </div>
                    <AcousticnessStats username = {username}/>
                </div>

                <div className='Stats-block'>
                    <div className='Explanation'>
                        <h3>Instrumentalness</h3>  
                        <p>
                            <strong>0:</strong> The track has vocals and is not purely instrumental. <br />
                            <strong>1:</strong> The track is entirely instrumental, with no vocals present.
                        </p>
                    </div>
                    <InstrumentalnessStats username = {username}/>
                </div>
            </div>

            </div>
        </>
    )
}