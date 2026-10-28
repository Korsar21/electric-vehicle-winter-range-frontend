
import { Col, Container, Row } from 'react-bootstrap';
import { mockLoads } from '../../shared/data/mockLoads';
import LoadCard from '../../widgets/load-card/LoadCard';

export default function FeedPage() {
  return (
    <Container className="page-container py-4">
      <div className="mb-4">
        <h1>Электрические нагрузки автомобиля</h1>
        <p className="text-secondary">
          Лента устройств и систем для эксплуатации электромобиля зимой
        </p>
      </div>

      <Row className="g-4">
        {mockLoads.map((load) => (
          <Col key={load.id} xs={12} md={6} lg={4}>
            <LoadCard load={load} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
