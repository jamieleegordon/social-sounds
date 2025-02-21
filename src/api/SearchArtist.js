export const getAccessToken = async (CLIENT_ID, CLIENT_SECRET) => {
    const authParameters = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', authParameters);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.access_token) {
            return data.access_token;
        } else {
            throw new Error('Access token not found in response');
        }
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
};

export const searchArtistById = async (accessToken, searchArtistInput) => {
    const searchParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    };

    try {
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${searchArtistInput}&type=artist`, 
            searchParameters
        );
        const data = await response.json();
        const artistID = data.artists.items[0]?.id;
        return artistID;
    } catch (error) {
        console.error('Error fetching artist ID:', error);
        throw error;
    }
};

export const getAlbumsByArtistId = async (accessToken, artistID) => {
    const searchParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    };

    try {
        const response = await fetch(
            `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`, 
            searchParameters
        );
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching albums:', error);
        throw error;
    }
};

