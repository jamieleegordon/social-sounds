import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WelcomePage } from './pages/Welcome/Welcome';
import { LoginPage } from './pages/Login/Login';
import { RegisterPage } from './pages/Register/Register';
import { HomePage } from './pages/Home/Home';

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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
