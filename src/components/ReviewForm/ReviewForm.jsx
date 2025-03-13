import { useState } from "react";
import { addAlbumReview } from "../../hooks/addAlbumReview";

export const ReviewForm = ({ albumName, artistName, username, tracks }) => {
    // Declare state variables for form inputs
    const [rating, setRating] = useState(null);
    const [review, setReview] = useState("");
    const [favSong, setFavSong] = useState("");

    // Handles adding a review
    const addReview = async (event) => {
        event.preventDefault(); // Prevent form submission from reloading the page

        if (rating === null || review === "" || favSong === "") {
            alert("Please fill in all fields before submitting.");
            return;
        }

        try {
            await addAlbumReview(rating, review, favSong, username, artistName, albumName);
            setRating(null);
            setReview("");
            setFavSong("");
        } catch (err) {
            console.error("Error adding review", err);
        }
    };

    return (
        <div className='Rate-and-Review-container'>
            <form 
                className="p-3 border rounded" 
                style={{ marginTop: '20px', marginBottom: '20px' }} 
                onSubmit={addReview} // Use onSubmit here to trigger the addReview function
            >
                <div className="mb-3">
                    <label htmlFor="rating" className="form-label" style={{ color: 'rgb(134, 134, 134)' }}>
                        Rate the Album (1-10)
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="rating"
                        value={rating || ""}
                        min="1"
                        max="10"
                        onChange={(e) => setRating(e.target.value)}
                        style={{
                            backgroundColor: 'rgb(21, 21, 26)',
                            color: 'rgb(134, 134, 134)',
                            border: '1px solid rgb(134, 134, 134)'
                        }}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="review" className="form-label" style={{ color: 'rgb(134, 134, 134)' }}>
                        Write Your Review
                    </label>
                    <textarea
                        className="form-control"
                        id="review"
                        rows="3"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        style={{
                            backgroundColor: 'rgb(21, 21, 26)',
                            color: 'rgb(134, 134, 134)',
                            border: '1px solid rgb(134, 134, 134)'
                        }}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="fav-song" className="form-label" style={{ color: 'rgb(134, 134, 134)' }}>
                        Select Favourite Song
                    </label>
                    <select
                        className="form-select"
                        id="fav-song"
                        value={favSong}
                        onChange={(e) => setFavSong(e.target.value)}
                        style={{
                            backgroundColor: 'rgb(21, 21, 26)',
                            color: 'rgb(134, 134, 134)',
                            border: '1px solid rgb(134, 134, 134)'
                        }}
                        required
                    >
                        <option value="" disabled>Choose a song...</option>
                        {tracks && tracks.length > 0 ? (
                            tracks.map((track, index) => (
                                <option key={index} value={track.name}>{track.name}</option>
                            ))
                        ) : (
                            <option>No songs available</option>
                        )}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">Post Review</button>
            </form>
        </div>
    );
};
