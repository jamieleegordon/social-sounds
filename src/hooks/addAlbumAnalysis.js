import { addDoc, collection, Timestamp } from "firebase/firestore"
import { db } from "../config/firebase"

export const addAlbumAnalysis = async (albumName, artistName, albumAnalysis) => {

    const albumCollectionRef = collection(db, "albumStats")

    try {
        await addDoc(albumCollectionRef, {
            albumName,
            artistName,
            genre: albumAnalysis.genre,
            danceability: albumAnalysis.danceability,
            energy: albumAnalysis.energy,
            key: albumAnalysis.key,
            loudness: albumAnalysis.loudness,
            mode: albumAnalysis.mode,
            speechiness: albumAnalysis.speechiness,
            acousticness: albumAnalysis.acousticness,
            instrumentalness: albumAnalysis.instrumentalness,
            liveness: albumAnalysis.liveness,
            valence: albumAnalysis.valence,
            tempo: albumAnalysis.tempo,
            keyChanges: albumAnalysis.key_changes,
            timeSignature: albumAnalysis.time_signature,
            features: albumAnalysis.featured_artists,
            themes: albumAnalysis.song_themes,
            peakEmotion: albumAnalysis.peak_emotion,
            commonInstrument: albumAnalysis.most_common_instrument,
            pitch: albumAnalysis.pitch,
            pace: albumAnalysis.pace,
            createdAt: Timestamp.fromDate(new Date()) 
        })

    } catch (err) {
        console.error("Erorr adding analysis", err)
    }
}