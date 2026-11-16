import AuthPage from './pages/auth/AuthPage';
import AddPage from './pages/add/AddPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import BottomNavbar from './widgets/navbar/BottomNavbar';
import FeedPage from './pages/feed/FeedPage';
import TilePage from './pages/tile/TilePage';
export default function App() {
    return (<BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />}/>
        <Route path="/add" element={<AddPage />}/>
        <Route path="/" element={<FeedPage />}/>
        <Route path="/tile" element={<TilePage />}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>

      <BottomNavbar />
    </BrowserRouter>);
}
