import './App.css';
import { Routes, Route } from 'react-router-dom'; // Don't import BrowserRouter here
import HomePage from './pages/Home';
import Navbar from '../components/header/Navbar';
import Footer from '../components/footer/Footer';
import LoginPage from './pages/LoginPage';
import DepartmentDashboard from './pages/dashboard/Department';
import HeadDashboard from './pages/dashboard/Head';


function App() {
  return (
    <div className='font-sans'>
      
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Home page route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/department" element={<DepartmentDashboard />} />
        <Route path="/dashboard/head" element={<HeadDashboard />} />
      </Routes>
      <Footer />
      
    </div>
  );
}

export default App;
