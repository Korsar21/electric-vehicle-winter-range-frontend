import { Alert, Spinner } from 'react-bootstrap';
import { useAppSelector } from '../../app/store';
export default function LoadStatus() { const { pending, error, mock } = useAppSelector(s => s.electricCarLoads); return <div aria-live="polite">{pending > 0 && <p role="status"><Spinner size="sm"/> Загрузка…</p>}{error && <Alert variant="danger">{error}</Alert>}{mock && <Alert variant="info">Сервер недоступен. Просмотр демонстрационных электрических нагрузок.</Alert>}</div>; }
