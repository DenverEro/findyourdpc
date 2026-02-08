
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Directory from './pages/Directory';
import Blog from './pages/Blog';
import PracticeDetails from './pages/PracticeDetails';
import BlogPostView from './pages/BlogPostView';
import ClaimSuccess from './pages/ClaimSuccess';
import ClaimFailed from './pages/ClaimFailed';
import ProviderPortal from './pages/ProviderPortal';
import ProviderLogin from './pages/ProviderLogin';
import ResetPassword from './pages/ResetPassword';
import Contact from './pages/Contact';
import { MOCK_BLOGS } from './constants';
import { loadMichiganPractices } from './data/dataLoader';
import { initGA, logPageView } from './src/analytics';
import { isZipCode, getCoordinatesFromZip, calculateDistance } from './src/utils/geocode';

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [practices] = useState(() => loadMichiganPractices());
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [maxDistance, setMaxDistance] = useState<number>(100);

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    logPageView();
  }, [location]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Get user coordinates from location filter (if it's a zip code)
  const userCoords = useMemo(() => {
    if (locationFilter && isZipCode(locationFilter)) {
      return getCoordinatesFromZip(locationFilter);
    }
    return null;
  }, [locationFilter]);

  const filteredPractices = useMemo(() => {
    // First filter practices
    let filtered = practices.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.doctor.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesLocation = true;
      
      if (locationFilter) {
        // Check if location filter is a zip code
        if (isZipCode(locationFilter)) {
          const userCoordsLocal = getCoordinatesFromZip(locationFilter);
          if (userCoordsLocal && p.lat && p.lng) {
            // Calculate distance and check if within maxDistance
            const distance = calculateDistance(userCoordsLocal.lat, userCoordsLocal.lng, p.lat, p.lng);
            matchesLocation = distance <= maxDistance;
          } else {
            // Fallback: exact zip match if no coordinates available
            matchesLocation = p.zip === locationFilter;
          }
        } else {
          // City/state text search
          matchesLocation = p.city.toLowerCase().includes(locationFilter.toLowerCase()) ||
            p.state.toLowerCase().includes(locationFilter.toLowerCase()) ||
            p.zip.includes(locationFilter);
        }
      }
      
      return matchesSearch && matchesLocation;
    });

    // Sort by distance if user has entered a zip code
    if (userCoords) {
      filtered = filtered
        .map(p => ({
          ...p,
          distance: (p.lat && p.lng) 
            ? calculateDistance(userCoords.lat, userCoords.lng, p.lat, p.lng)
            : Infinity
        }))
        .sort((a, b) => (a as any).distance - (b as any).distance);
    }

    return filtered;
  }, [practices, searchQuery, locationFilter, maxDistance, userCoords]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <Home
              practices={practices}
              blogs={MOCK_BLOGS}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              setSearchQuery={setSearchQuery}
              setLocationFilter={setLocationFilter}
            />
          } />
          <Route path="/directory" element={
            <Directory
              practices={filteredPractices}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              maxDistance={maxDistance}
              setMaxDistance={setMaxDistance}
              userCoords={userCoords}
            />
          } />
          <Route path="/blog" element={<Blog blogs={MOCK_BLOGS} />} />
          <Route path="/:state/:city/:clinicSlug" element={
            <PracticeDetails
              practices={practices}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          } />
          <Route path="/blog/:slug" element={<BlogPostView blogs={MOCK_BLOGS} />} />
          <Route path="/claim-success" element={<ClaimSuccess />} />
          <Route path="/claim-failed" element={<ClaimFailed />} />
          <Route path="/claim-failed" element={<ClaimFailed />} />
          <Route path="/provider/portal" element={<ProviderPortal />} />
          <Route path="/provider/login" element={<ProviderLogin />} />
          <Route path="/provider/reset-password" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />
          {/* Legacy route support */}
          <Route path="/practice/:id" element={
            <PracticeDetails
              practices={practices}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
