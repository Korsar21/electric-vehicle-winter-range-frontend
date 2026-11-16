import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';
import { signedIn, clearLoads } from '../../entities/electric-car-load/model/state';
import { authApi, errorMessage, setApiToken } from '../../shared/api/client';
export default function AuthPage() {
    useEffect(() => { document.title = 'Аутентификация'; }, []);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    return <Container className="page-container py-4"><h1>Аутентификация</h1><Form style={{ maxWidth: 480 }} onSubmit={async (e) => { e.preventDefault(); if (busy)
        return; setBusy(true); setError(''); try {
        const { data } = await authApi.post('/users/auth', { name, password });
        localStorage.setItem('jwt', data.access_token);
        setApiToken(data.access_token);
        dispatch(clearLoads());
        dispatch(signedIn(data));
        navigate('/tile');
    }
    catch (err) {
        setError(errorMessage(err));
    }
    finally {
        setBusy(false);
    } }}>{error && <Alert variant="danger">{error}</Alert>}<Form.Label htmlFor="username">Имя пользователя</Form.Label><Form.Control id="username" autoComplete="username" value={name} onChange={e => setName(e.target.value)} required disabled={busy}/><Form.Label htmlFor="password" className="mt-3">Пароль</Form.Label><Form.Control id="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required disabled={busy}/><Button type="submit" className="mt-3" disabled={busy}>{busy && <Spinner size="sm"/>} Войти</Button></Form></Container>;
}
