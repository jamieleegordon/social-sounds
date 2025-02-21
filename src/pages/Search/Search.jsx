import { NavBar } from "../../components/NavBar/NavBar"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'
import './Search.css'
import { useEffect, useState } from "react"

export const SearchPage = () => {
    //spotify api
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
    const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET

    const [searchArtistInput, setSearchArtistInput] = useState("")
    const [accessToken, setAccessToken] = useState("")
    const [albums, setAlbums] = useState([])

    useEffect(() => {
        var authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }, 
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
        }

        fetch('https://accounts.spotify.com/api/token', authParameters)
            .then(result => {
                if (!result.ok) {
                    throw new Error(`HTTP error! Status: ${result.status}`);
                }
                return result.json();
            })
            .then(data => {
                if (data.access_token) {
                    setAccessToken(data.access_token);
                } else {
                    throw new Error('Access token not found in response');
                }
            })
            .catch(error => {
                console.error('Error fetching access token:', error);
                alert('There was an error fetching the access token. Please try again.');
            });
    }, [])

    const searchArtist = async () => {
        console.log("Searching for " + searchArtistInput)

        // GET request for Artist ID
        var searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }

        }
        var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchArtistInput + '&type=artist', searchParameters)
            .then(response => response.json())
            .then(data => {return data.artists.items[0].id})

            console.log("artist id is " + artistID)

        // GET request with artist ID and grab all albums for artist
        var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setAlbums(data.items)
            })
        console.log(albums)
    }

    return (
        <div className="search-page-wrapper">  
            <NavBar />

            <div className="Search-page">
                <Container>
                    <InputGroup className="mb-3" size="lg">
                        <FormControl
                            placeholder="Search For Artist"
                            type="input"
                            onKeyDown={event => {
                                if (event.key === "Enter") {
                                    searchArtist()
                                }
                            }}
                            onChange={event => setSearchArtistInput(event.target.value)}
                        >
                        </FormControl>
                        <Button onClick={searchArtist}>
                            Search
                        </Button>
                    </InputGroup>
                </Container>
                <Container>
                    <Row className="mx-2 row row-cols-4">
                        {albums.map((album, i) => {
                            console.log(album)
                            return (
                                <Card>
                                    <Card.Img src = {album.images[0].url} />
                                    <Card.Body>
                                        <Card.Title>{album.name}</Card.Title>
                                    </Card.Body>
                                </Card>
                            )
                            
                        })}
                         
                    </Row>
                    
                </Container>
            </div>
        </div>
    )
}

