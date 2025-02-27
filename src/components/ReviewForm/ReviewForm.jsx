export const ReviewForm = () => {
    return (
        <div className='Rate-and-Review-container'>
            <form className="p-3 border rounded" style = {{marginTop: '20px', marginBottom: '20px'}}>
                <div className="mb-3">
                    <label htmlFor="rating" className="form-label" style={{ color: 'rgb(134, 134, 134)' }}>Rate the Album (1-10)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="rating"
                        min="1"
                        max="10"
                        style={{
                            backgroundColor: 'rgb(21, 21, 26)',
                            color: 'rgb(134, 134, 134)',
                            border: '1px solid rgb(134, 134, 134)' 
                        }}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="review" className="form-label" style={{ color: 'rgb(134, 134, 134)' }}>Write Your Review</label>
                    <textarea
                        className="form-control"
                        id="review"
                        rows="3"
                        style={{
                            backgroundColor: 'rgb(21, 21, 26)',
                            color: 'rgb(134, 134, 134)',
                            border: '1px solid rgb(134, 134, 134)' 
                        }}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="fav-song" className="form-label" style={{ color: 'rgb(134, 134, 134)' }}>Select Favourite Song</label>
                    <select
                        className="form-select"
                        id="fav-song"
                        style={{
                            backgroundColor: 'rgb(21, 21, 26)',
                            color: 'rgb(134, 134, 134)',
                            border: '1px solid rgb(134, 134, 134)' 
                        }}
                        required
                    >
                        <option value="" disabled>Choose a song...</option>
                        <option value="song1">Song 1</option>
                        <option value="song2">Song 2</option>
                        <option value="song3">Song 3</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">Post</button>
            </form>
        </div>
    );
};
