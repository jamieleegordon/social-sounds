import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WelcomePage } from './pages/Welcome/Welcome';
import { LoginPage } from './pages/Login/Login';
import { RegisterPage } from './pages/Register/Register';
import { HomePage } from './pages/Home/Home';
import { UsernamePage } from './pages/Username/Username';
import { SearchPage } from './pages/Search/Search';
import { SearchAlbumPage } from './pages/SearchAlbum/SearchAlbum';
import { ReviewPage } from './pages/Review/Review';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { FriendsPage } from './pages/FriendsPage/FriendsPage';
import { MessagingPage } from './pages/MessagingPage/MessagingPage';
import { AIplaylist } from './pages/AIplaylist/AIplaylist';
import { FriendProfile } from './pages/FriendProfile/FriendProfile';
import { ListeningStatsPage } from './pages/ListeningStats/ListeningStats';
import { RecommendMusicPage } from './pages/RecommendMusicPage/RecommendMusic';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path = "/" element = {<WelcomePage />}/>
          <Route path = "/social-sounds" element = {<WelcomePage />}/>
          <Route path = "/register" element = {<RegisterPage />}/>
          <Route path = "/login" element = {<LoginPage />}/>
          <Route path = "/home" element = {<HomePage />}/>
          <Route path = "/create-username" element = {<UsernamePage />}/>
          <Route path = "/search" element = {<SearchPage />}/>
          <Route path = "/search-album" element = {<SearchAlbumPage />}/>
          <Route path = "/album/:albumName" element = {<ReviewPage />}/>
          <Route path = "/profile" element = {<ProfilePage />}/>
          <Route path = "/friends" element = {<FriendsPage />}/>
          <Route path = "/friends/:friend" element = {<MessagingPage />}/>
          <Route path = "/ai-playlist" element = {<AIplaylist />}/>
          <Route path = "/friendProfile/:friend" element = {<FriendProfile />}/>
          <Route path = "/listeningStats" element = {<ListeningStatsPage />}/>
          <Route path = "/recommendMusic" element = {<RecommendMusicPage />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
