
import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { mockLoads } from '../../shared/data/mockLoads';
import LoadCard from '../../widgets/load-card/LoadCard';

export default function TilePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [maxPower, setMaxPower] = useState('');

  useEffect(() => {
    document.title = 'Плитка электрических нагрузок';
  }, []);

  const categories = Array.from(
    new Set(mockLoads.map((load) => load.category)),
  );

  const filteredLoads = mockLoads.filter((load) => {
    const matchesName = load.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === '' || load.category === category;

    const matchesPower =
      maxPower === '' || load.power_draw_w <= Number(maxPower);

    return matchesName && matchesCategory && matchesPower;
  });

  function resetFilters() {
    setSearch('');
    setCategory('');
    setMaxPower('');
  }

  return (
    <Container className="page-container py-4">
      <h1>Плитка электрических нагрузок</h1>

      <p className="text-secondary">
        Просмотр и фильтрация систем электромобиля для зимней эксплуатации
      </p>

      <Form className="filter-panel p-3 mb-4">
        <Row className="g-3">
          <Col xs={12} md={4}>
            <Form.Label htmlFor="load-search">
              Поиск по названию
            </Form.Label>

            <Form.Control
              id="load-search"
              type="text"
              placeholder="Например, обогреватель"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Col>

          <Col xs={12} md={4}>
            <Form.Label htmlFor="load-category">
              Категория
            </Form.Label>

            <Form.Select
              id="load-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Все категории</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col xs={12} md={4}>
            <Form.Label htmlFor="load-max-power">
              Максимальная мощность, Вт
            </Form.Label>

            <Form.Control
              id="load-max-power"
              type="number"
              min="0"
              placeholder="Например, 500"
              value={maxPower}
              onChange={(event) => setMaxPower(event.target.value)}
            />
          </Col>
        </Row>

        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3">
          <span>
            Найдено нагрузок: <strong>{filteredLoads.length}</strong>
          </span>

          <Button
            variant="outline-secondary"
            type="button"
            onClick={resetFilters}
          >
            Сбросить фильтры
          </Button>
        </div>
      </Form>

      {filteredLoads.length > 0 ? (
        <Row className="g-4">
          {filteredLoads.map((load) => (
            <Col key={load.id} xs={12} md={6} lg={4}>
              <LoadCard load={load} />
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-secondary">
          По заданным условиям нагрузки не найдены.
        </p>
      )}
    </Container>
  );
}
