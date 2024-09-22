import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Appointments from './pages/Appointments';
import Bill from './pages/Bill';
import DoctorDashbaord from './pages/doctor_dashbaord';


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
            <Route extact path="/appointments" element={<Appointments />} />
            <Route extact path="/bill" element={<Bill />} />
            <Route extact path="/doctor_dashbaord" element={<DoctorDashbaord />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;