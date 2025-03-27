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
import { getAverageEnergy } from '../../hooks/getEnergyStats'
import { getAverageDanceability } from '../../hooks/getDanceabilityStats'
import { getAverageAcousticness } from '../../hooks/getAcousticnessStats'
import { getAverageInstrumentalness } from '../../hooks/getInstrumentalnessStats'
import { KeyStats } from '../../components/ListeningStatsDataVis/KeyStats'
import { getAverageKey } from '../../hooks/getKeyStats'
import { KeyChangesStats } from '../../components/ListeningStatsDataVis/KeyChanges'
import { getAverageKeyChanges } from '../../hooks/getKeyChangesStats'
import { LivenessStats } from '../../components/ListeningStatsDataVis/LivenessStats'
import { getAverageLiveness } from '../../hooks/getLivenessStats'
import { LoudnessStats } from '../../components/ListeningStatsDataVis/LoudnessStats'
import { getAverageLoudness } from '../../hooks/getLoudnessStats'
import { ModeStats } from '../../components/ListeningStatsDataVis/ModeStats'
import { getAverageMode } from '../../hooks/getModeStats'
import { PitchStats } from '../../components/ListeningStatsDataVis/PitchStats'
import { getAveragePitch } from '../../hooks/getPitchStats'
import { SpeechinessStats } from '../../components/ListeningStatsDataVis/SpeechinessStats'
import { getAverageSpeechiness } from '../../hooks/getSpeechinessStats'
import { TempoStats } from '../../components/ListeningStatsDataVis/TempoStats'
import { getAverageTempo } from '../../hooks/getTempoStats'
import { TimeSignatureStats } from '../../components/ListeningStatsDataVis/TimeSignatureStats'
import { getAverageTimeSignature } from '../../hooks/getTimeSignature'
import { ValenceStats } from '../../components/ListeningStatsDataVis/ValenceStats'
import { getAverageValence } from '../../hooks/getValenceStats'

export const ListeningStatsPage = () => {

    const { user } = useAuth();
    const currentUserEmail = user?.email; 
    const [username, setUsername] = useState("")

    const [mostListenedToGenre, setMostListenedToGenre] = useState("")
    const [mostListenedToArtist, setMostListenedToArtist] = useState("")

    const [averageEnergy, setAverageEnergy] = useState(null)
    const [averageDanceability, setAverageDanceability] = useState(null)
    const [averageTempo, setAverageTempo] = useState(null)
    const [averageValence, setAverageValence] = useState(null)
    const [averageAcousticness, setAverageAcousticness] = useState(null)
    const [averageInstrumentalness, setAverageInstrumentalness] = useState(null)
    const [averageKey, setAverageKey] = useState(null)
    const [averageKeyChange, setAverageKeyChange] = useState(null)
    const [averageLiveness, setAverageLiveness] = useState(null)
    const [averageLoudness, setAverageLoudness] = useState(null)
    const [averageMode, setAverageMode] = useState(null)
    const [averagePitch, setAveragePitch] = useState(null)
    const [averageSpeechiness, setAverageSpeechiness] = useState(null)
    const [averageTimeSignature, setAverageTimeSignature] = useState(null)

    useEffect(() => {
        const fetchAverages = async () => {
          const avgEnergy = await getAverageEnergy(username)
          setAverageEnergy(avgEnergy)

          const avgDanceability = await getAverageDanceability(username)
          setAverageDanceability(avgDanceability)

          const avgTempo = await getAverageTempo(username)
          setAverageTempo(avgTempo)

          const avgValence = await getAverageValence(username)
          setAverageValence(avgValence)  

          const avgAcousticness = await getAverageAcousticness(username)
          setAverageAcousticness(avgAcousticness)

          const avgInstrumentalness = await getAverageInstrumentalness(username)
          setAverageInstrumentalness(avgInstrumentalness)

          const avgKey = await getAverageKey(username)
          setAverageKey(avgKey)

          const avgKeyChange = await getAverageKeyChanges(username)
          setAverageKeyChange(avgKeyChange)

          const avgLiveness = await getAverageLiveness(username)
          setAverageLiveness(avgLiveness)

          const avgLoudness = await getAverageLoudness(username)
          setAverageLoudness(avgLoudness)

          const avgMode = await getAverageMode(username)
          setAverageMode(avgMode)

          const avgPitch = await getAveragePitch(username)
          setAveragePitch(avgPitch)  

          const avgSpeechiness = await getAverageSpeechiness(username)
          setAverageSpeechiness(avgSpeechiness)

          const avgTimeSignature = await getAverageTimeSignature(username)
          setAverageTimeSignature(avgTimeSignature)
        }
    
        fetchAverages();
      }, [username]);

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
                        <h4>Your average = {averageEnergy}</h4>
                        {averageEnergy > 0.5 ? (
                            <h5 className='Analysis-explanation'>You prefer high energy music! Music which is high paced and intense! 🔋</h5>
                        ): (
                            <h5 className='Analysis-explanation'>You prefer lower energy music! Music which is more relaxing! 🪫</h5>
                        )}
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
                        <h4>Your average = {averageDanceability}</h4>
                        {averageDanceability > 0.5 ? (
                            <h5 className='Analysis-explanation'>You like very dancable music! Music which makes you want to get up and dance! 🕺💃🪩</h5>
                        ): (
                            <h5 className='Analysis-explanation'>You prefer less dancable music! Music which is steadier and calm! 😌</h5>
                        )}
                        <p>
                            <strong>0:</strong> The track is not suitable for dancing at all. It may have slow tempos, irregular beats, or a lack of rhythm, making it harder to dance to. <br />
                            <strong>1:</strong> The track is highly suitable for dancing. It has a strong, consistent rhythm, a steady tempo, and clear beats, making it easy to groove and move along with the music.
                        </p>
                    </div>
                    <DanceabilityStats username = {username}/>
                </div>

                <div className='Stats-block'>
                    <div className='Explanation'>
                        <h3>Tempo</h3>  
                        <h4>Your average = {averageTempo} BPM</h4>
                        {averageTempo > 100 ? (
                            <h5 className='Analysis-explanation'>You like high tempo music! fast and energetic! 🏃</h5>
                        ): (
                            <h5 className='Analysis-explanation'>You prefer lower tempo music! Music which is slower and steady! 😶‍🌫️</h5>
                        )}
                        <p>
                            <strong>60 BPM:</strong> A slow track, often mellow or introspective. <br />
                            <strong>200 BPM:</strong> A fast-paced track, often energetic or intense.
                        </p>
                    </div>
                    <TempoStats username = {username}/>
                </div>

                <div className='Stats-block'>
                    <div className='Explanation'>
                        <h3>Valence</h3>  
                        <h4>Your average = {averageValence}</h4>
                        {averageValence > 0.5 ? (
                            <h5 className='Analysis-explanation'>You like very positive and happy music! Music which makes you smile and has that feel good factor 😊😊😊</h5>
                        ): (
                            <h5 className='Analysis-explanation'>You prefer sadder music! Music which is deep and emotional! 😥</h5>
                        )}
                        <p>
                            <strong>0:</strong> Very negative or sad track. <br />
                            <strong>1:</strong> Very positive or happy track.
                        </p>
                    </div>
                    <ValenceStats username = {username}/>
                </div>

                <div className='Stats-block'>
                    <div className='Explanation'>
                        <h3>Acousticness</h3>  
                        <h4>Your average = {averageAcousticness}</h4>
                        {averageAcousticness > 0.5 ? (
                            <h5 className='Analysis-explanation'>
                                You enjoy more acoustic music! Music that is raw, authentic, and grounded 🎶🎸
                            </h5>
                        ) : (
                            <h5 className='Analysis-explanation'>
                                You prefer music with more electronic elements! Music with a fuller, more polished sound 🎧🔊
                            </h5>
                        )}
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
                        <h4>Your average = {averageInstrumentalness}</h4>
                        {averageInstrumentalness > 0.5 ? (
                            <h5 className='Analysis-explanation'>
                                You enjoy instrumental music! Music that focuses on melody and sound without vocals 🎶🎧
                            </h5>
                        ) : (
                            <h5 className='Analysis-explanation'>
                                You prefer music with vocals! Songs that tell a story with lyrics and voice 🎤🎵
                            </h5>
                        )}
                        <p>
                            <strong>0:</strong> The track has vocals and is not purely instrumental. <br />
                            <strong>1:</strong> The track is entirely instrumental, with no vocals present.
                        </p>
                    </div>
                    <InstrumentalnessStats username = {username}/>
                </div>

                <div className='Stats-block'>
                    <div className='Explanation'>
                        <h3>Key</h3>  
                        <h4>Your average = {averageKey}</h4>
                        {averageKey > 5.5 ? (
                            <h5 className='Analysis-explanation'>
                                You enjoy music with more complex key changes! Songs that explore multiple keys, adding richness and variety 🎶🎵
                            </h5>
                        ) : (
                            <h5 className='Analysis-explanation'>
                                You prefer music in a single key! Songs with a stable and consistent tonal center, giving a more straightforward feel 🎧🎶
                            </h5>
                        )}
                        <p>
                        <strong>0-11:</strong> Represents the 12 different keys in Western music, with 0 typically corresponding to C, 1 to C#, and so on.
                        </p>
                    </div>
                    <KeyStats username = {username}/>
                </div>

                <div className='Stats-block'>
                    <div className='Explanation'>
                        <h3>Key Changes</h3>  
                        <h4>Your average = {averageKeyChange}</h4>
                        {averageKeyChange > 4 ? (
                            <h5 className='Analysis-explanation'>
                                You enjoy songs with key changes! Music that shifts between different tonal centers, adding excitement and surprise 🎶🔀
                            </h5>
                        ) : (
                            <h5 className='Analysis-explanation'>
                                You prefer songs without key changes! Music that stays in one key, offering a consistent and stable sound 🎧🎵
                            </h5>
                        )}
                        <p>
                            <strong>0:</strong> No key changes, the song remains in a single key. <br />
                            <strong>1+</strong> There are multiple key changes, adding complexity to the song.
                        </p>
                    </div>
                    <KeyChangesStats username = {username}/>
                </div>

                <div className='Stats-block'>
                    <div className='Explanation'>
                        <h3>Liveness</h3>  
                        <h4>Your average = {averageLiveness}</h4>
                        {averageLiveness > 0.5 ? (
                            <h5 className='Analysis-explanation'>
                                You enjoy live-sounding music! Tracks with a sense of energy and the feeling of being performed live, with crowd interaction and raw sound 🎤🎶
                            </h5>
                        ) : (
                            <h5 className='Analysis-explanation'>
                                You prefer studio-recorded music! Songs that are polished, with more controlled production and less crowd influence 🎧🎵
                            </h5>
                        )}
                        <p>
                            <strong>0:</strong> No live audience or performance. <br />
                            <strong>1:</strong> The track has a high degree of live performance quality.
                        </p>
                    </div>
                    <LivenessStats username = {username}/>
                </div>

                <div className='Stats-block'>
                    <div className='Explanation'>
                        <h3>Loudness</h3>  
                        <h4>Your average = {averageLoudness}</h4>
                        {averageLoudness > -5 ? (
                            <h5 className='Analysis-explanation'>
                                You enjoy loud and energetic music! Tracks that are intense, dynamic, and impactful with a high level of sound volume 🔊💥
                            </h5>
                        ) : (
                            <h5 className='Analysis-explanation'>
                                You prefer softer and more subtle music! Songs that are gentle and calming, with a more relaxed and quiet feel 🎶🌙
                            </h5>
                        )}
                        <p>
                            <strong>Negative values:</strong> Indicates that the track is quieter than the reference level. <br />
                            <strong>0 dB:</strong> Indicates the maximum loudness level without distortion.
                        </p>
                    </div>
                    <LoudnessStats username = {username}/>
                </div>

                <div className='Stats-block'>
                    <div className='Explanation'>
                        <h3>Mode</h3>  
                        <h4>Your average = {averageMode}</h4>
                        {averageMode > 0.5 ? (
                            <h5 className='Analysis-explanation'>
                                You enjoy major key music! Tracks that are uplifting, happy, and feel bright and positive 🎶✨
                            </h5>
                        ) : (
                            <h5 className='Analysis-explanation'>
                                You prefer minor key music! Songs that are darker, more emotional, and often have a melancholic or mysterious feel 🎶🌙
                            </h5>
                        )}
                        <p>
                            <strong>0:</strong> Represents a minor key (often more melancholic). <br />
                            <strong>1:</strong> Represents a major key (often more upbeat and happy).
                        </p>
                    </div>
                    <ModeStats username = {username}/>
                </div>

                <div className='Stats-block'>
                    <div className='Explanation'>
                        <h3>Pitch</h3>  
                        <h4>Your average = {averagePitch}</h4>
                        {averagePitch > 0.5 ? (
                            <h5 className='Analysis-explanation'>
                                You enjoy higher-pitched music! Tracks that have a brighter, lighter sound, often more energetic 🎶🎤
                            </h5>
                        ) : (
                            <h5 className='Analysis-explanation'>
                                You prefer lower-pitched music! Songs that have a deeper, richer sound with more resonance 🎶🎧
                            </h5>
                        )}
                        <p>
                            Higher pitch values mean the track is in a higher register, while lower values mean it is deeper.
                        </p>
                    </div>
                    <PitchStats username = {username}/>
                </div>

                <div className='Stats-block'>
                    <div className='Explanation'>
                        <h3>Speechiness</h3>  
                        <h4>Your average = {averageSpeechiness}</h4>
                        {averageSpeechiness > 0.5 ? (
                            <h5 className='Analysis-explanation'>
                                You enjoy tracks with more speech! These songs may have spoken word, rap, or heavy vocalization 🎤🗣️
                            </h5>
                        ) : (
                            <h5 className='Analysis-explanation'>
                                You prefer music with less speech! Songs that focus more on melody and instrumental sounds 🎶🎧
                            </h5>
                        )}
                        <p>
                            <strong>0:</strong> No speech-like content. <br />
                            <strong>1:</strong> The track is entirely made up of speech or spoken words.
                        </p>
                    </div>
                    <SpeechinessStats username = {username}/>
                </div>

                <div className='Stats-block'>
                    <div className='Explanation'>
                        <h3>Time Signature</h3>  
                        <h4>Your average = {averageTimeSignature}</h4>
                        {averageTimeSignature > 3.5 ? (
                            <h5 className='Analysis-explanation'>
                                You enjoy music with a more complex rhythm! These songs often have irregular or varied time signatures ⏱️🎶
                            </h5>
                        ) : (
                            <h5 className='Analysis-explanation'>
                                You prefer music with a steady, simple rhythm! Songs that follow a common 4/4 time signature 🥁🎵
                            </h5>
                        )}
                        <p>
                            <strong>4:</strong> Common time signature (4/4), often used in pop and rock. <br />
                            <strong>3:</strong> 3/4 time, commonly used for waltzes.
                        </p>
                    </div>
                    <TimeSignatureStats username = {username}/>
                </div>

            </div>

            </div>
        </>
    )
}

