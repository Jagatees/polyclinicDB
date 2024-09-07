import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <Navbar /> */}
        <div className="content">
          <Routes>
            <Route extact path="/" element={<Home />} />
            <Route extact path="/login" element={<Login />} />
            <Route extact path="/registration" element={<Registration />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;