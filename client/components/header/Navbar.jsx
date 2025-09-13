import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';
import Vaanilogo from '../../src/assets/vaanilogo1.png';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false); // track login by token presence
  const [role, setRole] = useState(null); // optional, set role if known
  const navigate = useNavigate();

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);

      // Optional: Decode role from token if JWT or fetch from API
      // Example: setRole('department'); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // remove token only
    setLoggedIn(false);
    setRole(null);
    navigate('/'); // redirect to home
  };

  const handleLogin = () => {
    navigate('/login'); // navigate to login page
  };

  // Determine dashboard title if logged in
  const getTitle = () => {
    if (!loggedIn) return 'Vaani Civic Portal';
    if (role === 'department') return 'Department Dashboard';
    if (role === 'head') return 'Head Dashboard';
    return 'Dashboard';
  };

  const getSubtitle = () => {
    if (!loggedIn) return '';
    if (role === 'head') return 'Administrative Control Panel';
    return '';
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-2xl">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <img src={Vaanilogo} alt="Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-xl font-bold">{getTitle()}</h1>
            {getSubtitle() && <p className="text-sm text-muted-foreground">{getSubtitle()}</p>}
          </div>
        </div>

        {/* Login / Logout Button */}
        <div className="flex gap-2">
          {loggedIn ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleLogin}>
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
