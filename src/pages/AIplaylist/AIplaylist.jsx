import { useState } from "react";
import { NavBar } from "../../components/NavBar/NavBar";
import './AIplaylist.css';
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { AutoAwesome, ContentCopy } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export const AIplaylist = () => {

    const [promt, setPromt] = useState("");
    const [playlistList, setPlaylistList] = useState([]);  // Ensure this is initialized as an empty array

    const generatePlaylist = async () => {
        try {
            // Call backend API 
            const response = await fetch('https://ss-server-tan.vercel.app/api/playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: promt }), 
            });
    
            const data = await response.json();
            if (data.playlist) {
                // Extract playlist name and song list from the returned string
                const playlistString = data.playlist.trim();
                const playlistNameEndIndex = playlistString.indexOf('1.'); // Find the start of song list
                const playlistName = playlistString.slice(0, playlistNameEndIndex).trim();
                const songListString = playlistString.slice(playlistNameEndIndex).trim();

                // Split the song list into individual songs
                const songs = songListString.split(/\d+\.\s+/).filter(Boolean); // Split based on numbering pattern "1. "

                // Update the playlist list
                setPlaylistList(prevItems => [...prevItems, { playlistName, songs }]);
                console.log({ playlistName, songs });
            } else {
                console.error("No suggestion received:", data);
            }
        } catch (err) {
            console.error("Error getting GPT suggestion:", err);
        }

        // Clear the prompt after generating the playlist
        setPromt('');
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    }

    return (
        <>
            <NavBar />

            <div className="AIplaylistPage">
                <div className="AIplaylistPage-top-section">
                    <h1>What do fancy listening to?</h1>
                    <p>Let's make a playlist together, with the power of AI! ✨</p>
                    <p>Please note, playlist may take a few seconds to generate</p>
                </div>

                <div className="AIplaylistPage-mid-section">
                    {playlistList.length > 0 ? (
                        playlistList.map((playlist, index) => (
                            <div className="Playlist-card" key={index}>
                                <h3>{playlist.playlistName.replace(/^Playlist Name:?(\s+)?/i, '')}</h3>
                                {playlist.songs.map((song, songIndex) => (
                                    <p key={songIndex}>{song.trim()}</p> 
                                ))}
                            </div>
                        ))
                    ) : (
                        <p></p>
                    )}
                </div>
                
                <div className="AIplaylistPage-bottom-section">
                    <h1 className="Some-suggestions-header">Some suggestions</h1>
                    <div className="Playlist-suggestions">
                        <div className="Playlist-suggestion">
                            <AutoAwesome />
                            <h2>My drive to work</h2>
                            <IconButton
                                onClick={() => copyToClipboard("My drive to work")}
                                className="Copy-button"
                            >
                                <ContentCopy sx={{ fontSize: "20px", color: "grey" }} />
                            </IconButton>
                        </div>
                        <div className="Playlist-suggestion">
                            <AutoAwesome />
                            <h2>Michael Jackson's greatest songs</h2>
                            <IconButton
                                onClick={() => copyToClipboard("Michael Jackson's greatest songs")}
                                className="Copy-button"
                            >
                                <ContentCopy sx={{ fontSize: "20px", color: "grey" }} />
                            </IconButton>
                        </div>
                        <div className="Playlist-suggestion">
                            <AutoAwesome />
                            <h2>Happy hour songs for me and my friends</h2>
                            <IconButton
                                onClick={() => copyToClipboard("Happy hour songs for me and my friends")}
                                className="Copy-button"
                            >
                                <ContentCopy sx={{ fontSize: "20px", color: "grey" }} />
                            </IconButton>
                        </div>
                        <div className="Playlist-suggestion">
                            <AutoAwesome />
                            <h2>Help me get pumped for my workout</h2>
                            <IconButton
                                onClick={() => copyToClipboard("Help me get pumped for my workout")}
                                className="Copy-button"
                            >
                                <ContentCopy sx={{ fontSize: "20px", color: "grey" }} />
                            </IconButton>
                        </div>
                    </div>
                    <InputGroup className="mb-3 Playlist-promt-input" size="lg">
                        <FormControl
                            placeholder="Generate a playlist for ..."
                            type="input"
                            value={promt}
                            onKeyDown={event => {
                                if (event.key === "Enter") {
                                    generatePlaylist();
                                }
                            }}
                            onChange={event => setPromt(event.target.value)}
                        />
                        <Button onClick={() => generatePlaylist()}>Generate</Button>
                    </InputGroup>
                </div>
            </div>
        </>
    )
}
