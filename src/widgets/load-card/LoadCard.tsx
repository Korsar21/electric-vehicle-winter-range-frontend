
import { Badge, Card } from 'react-bootstrap';
import type { ElectricCarLoad } from '../../entities/electric-car-load/model/types';

interface LoadCardProps {
  load: ElectricCarLoad;
}

export default function LoadCard({ load }: LoadCardProps) {
  const imageSrc = load.image_url || '/default.jpg';
  const videoSrc = load.video_url || '/default.mp4';

  return (
    <Card className="load-card h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={imageSrc}
        alt={load.name}
        className="load-card-image"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = '/default.jpg';
        }}
      />

      <Card.Body className="d-flex flex-column">
        <Card.Title>{load.name}</Card.Title>

        <Card.Text>{load.description}</Card.Text>

        <div className="mb-2">
          <Badge bg="primary" className="me-2">
            {load.category}
          </Badge>

          <Badge
            bg={load.priority === 'Высокий' ? 'danger' : 'secondary'}
          >
            {load.priority}
          </Badge>
        </div>

        <p className="mb-2">
          <strong>Мощность:</strong> {load.power_draw_w} Вт
        </p>

        <p className="mb-3">
          <strong>Нравится:</strong> {load.like_count}
        </p>

        <video
          className="load-card-video mt-auto"
          controls
          preload="metadata"
          src={videoSrc}
        >
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
      </Card.Body>
    </Card>
  );
}
