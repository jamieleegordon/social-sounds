export const getTracksFromAlbum = async (accessToken, albumID) => {
    const searchParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    };

    try {
        const response = await fetch(
            `https://api.spotify.com/v1/albums/${albumID}/tracks`, 
            searchParameters
        );
        const data = await response.json();
        return data.items; // Array of tracks
    } catch (error) {
        console.error('Error fetching tracks:', error);
        throw error;
    }
};

