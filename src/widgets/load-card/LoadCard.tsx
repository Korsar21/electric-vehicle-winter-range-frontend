import { Badge, Card, Button } from 'react-bootstrap';
import { deleteElectricCarLoad, setElectricCarLoadLike, type Load } from '../../entities/electric-car-load/model/state';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { mediaUrl } from '../../shared/api/client';
interface LoadCardProps {
    load: Load;
}
export default function LoadCard({ load }: LoadCardProps) {
    const dispatch = useAppDispatch();
    const authenticated = useAppSelector(s => s.auth.isAuthenticated);
    const busy = useAppSelector(s => s.electricCarLoads.pending > 0);
    const imageSrc = mediaUrl(load.image_url, '/default.jpg');
    const videoSrc = mediaUrl(load.video_url, '/default.mp4');
    return (<Card className="load-card h-100 shadow-sm">
      <Card.Img variant="top" src={imageSrc} alt={load.name} className="load-card-image" onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/default.jpg';
        }}/>

      <Card.Body className="d-flex flex-column">
        <Card.Title>{load.name}</Card.Title>

        <Card.Text>{load.description}</Card.Text>

        <div className="mb-2">
          <Badge bg="primary" className="me-2">
            {load.category}
          </Badge>

          <Badge bg={load.priority === 'Высокий' ? 'danger' : 'secondary'}>
            {load.priority}
          </Badge>
        </div>

        <p className="mb-2">
          <strong>Мощность:</strong> {load.power_draw_w} Вт
        </p>

        <p className="mb-3">
          <strong>Нравится:</strong> {load.like_count}
        </p>

        {authenticated && <div className="d-flex gap-2 mb-3">
          <Button disabled={busy} variant={load.is_liked ? 'primary' : 'outline-primary'} onClick={() => dispatch(setElectricCarLoadLike({ id: load.id, like: load.is_liked ? 0 : 1 }))}>{load.is_liked ? 'Убрать лайк' : 'Нравится'}</Button>
          {load.is_creator === 1 && <Button disabled={busy} variant="outline-danger" onClick={() => dispatch(deleteElectricCarLoad(load.id))}>Удалить</Button>}
        </div>}
        <video className="load-card-video mt-auto" controls preload="metadata" src={videoSrc}>
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
      </Card.Body>
    </Card>);
}
