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

export const searchAlbums = async (query, token) => {
    if (!token) {
        console.error("No access token available");
        return;
    }

    const searchParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
        },
    };

    try {
        console.log("Searching for albums:", query);
        
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album`,
            searchParameters
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        console.log("Spotify API Response:", data);

        return data.albums?.items || [];
    } catch (error) {
        console.error("Error fetching albums:", error);
        return [];
    }
};

