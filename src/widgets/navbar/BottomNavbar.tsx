import { useState } from 'react';
import { Container, Nav, Navbar, Alert } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { signedOut, resetFilters, clearLoads } from '../../entities/electric-car-load/model/state';
import { authApi, errorMessage, setApiToken } from '../../shared/api/client';
export default function BottomNavbar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const authenticated = useAppSelector(s => s.auth.isAuthenticated);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    async function logout() { if (busy)
        return; setBusy(true); setError(''); try {
        await authApi.post('/users/logout', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } });
        localStorage.removeItem('jwt');
        setApiToken(null);
        dispatch(signedOut());
        dispatch(resetFilters());
        dispatch(clearLoads());
        navigate('/tile');
    }
    catch (e) {
        setError(errorMessage(e));
    }
    finally {
        setBusy(false);
    } }
    return <>{error && <Alert variant="danger" className="position-fixed bottom-0 mb-5">{error}</Alert>}<Navbar bg="dark" data-bs-theme="dark" fixed="bottom"><Container className="justify-content-around"><Nav.Link as={NavLink} to="/" end>Лента</Nav.Link><Nav.Link as={NavLink} to="/add" disabled={!authenticated || busy}>Добавление</Nav.Link><Nav.Link as={NavLink} to="/tile">Плитка</Nav.Link>{authenticated ? <Nav.Link as="button" disabled={busy} onClick={logout}>{busy ? 'Выход…' : 'Выход'}</Nav.Link> : <Nav.Link as={NavLink} to="/auth">Вход</Nav.Link>}</Container></Navbar></>;
}
