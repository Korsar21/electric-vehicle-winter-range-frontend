import { useEffect } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { getElectricCarLoads, setFilters, resetFilters as resetFiltersAction } from '../../entities/electric-car-load/model/state';
import LoadStatus from '../../widgets/load-card/LoadStatus';
import { Link } from 'react-router-dom';
import LoadCard from '../../widgets/load-card/LoadCard';
export default function TilePage() {
    const dispatch = useAppDispatch();
    const { search, category, maxPower } = useAppSelector(s => s.filters);
    const authenticated = useAppSelector(s => s.auth.isAuthenticated);
    const { items: filteredLoads, pending } = useAppSelector(s => s.electricCarLoads);
    useEffect(() => { document.title = 'Плитка электрических нагрузок'; dispatch(getElectricCarLoads()); }, [dispatch, authenticated]);
    const categories = Array.from(new Set(['Отопление', 'Обзорность', 'Терморегулирование батареи', ...filteredLoads.map(x => x.category), category])).filter(Boolean);
    function resetFilters() { dispatch(resetFiltersAction()); dispatch(getElectricCarLoads()); }
    return (<Container className="page-container py-4">
      <h1>Плитка электрических нагрузок</h1>

      <p className="text-secondary">
        Просмотр и фильтрация систем электромобиля для зимней эксплуатации
      </p>

      <LoadStatus /><Form className="filter-panel p-3 mb-4" onSubmit={e => { e.preventDefault(); dispatch(getElectricCarLoads()); }}>
        <Row className="g-3">
          <Col xs={12} md={4}>
            <Form.Label htmlFor="load-search">
              Поиск по названию
            </Form.Label>

            <Form.Control id="load-search" type="text" placeholder="Например, обогреватель" value={search} onChange={(event) => dispatch(setFilters({ search: event.target.value }))}/>
          </Col>

          <Col xs={12} md={4}>
            <Form.Label htmlFor="load-category">
              Категория
            </Form.Label>

            <Form.Select id="load-category" value={category} onChange={(event) => dispatch(setFilters({ category: event.target.value }))}>
              <option value="">Все категории</option>

              {categories.map((item) => (<option key={item} value={item}>
                  {item}
                </option>))}
            </Form.Select>
          </Col>

          <Col xs={12} md={4}>
            <Form.Label htmlFor="load-max-power">
              Максимальная мощность, Вт
            </Form.Label>

            <Form.Control id="load-max-power" type="number" min="0" max="10000" placeholder="Например, 500" value={maxPower} onChange={(event) => dispatch(setFilters({ maxPower: event.target.value }))}/>
          </Col>
        </Row>

        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3">
          <span>
            Найдено нагрузок: <strong>{filteredLoads.length}</strong>
          </span>

          <Button type="submit" disabled={pending > 0}>Найти</Button>
          <Button disabled={pending > 0} variant="outline-secondary" type="button" onClick={resetFilters}>
            Сбросить фильтры
          </Button>
        </div>
      </Form>

      {filteredLoads.length > 0 ? (<Row className="g-4">
          {filteredLoads.map((load) => (<Col key={load.id} xs={12} md={6} lg={4}>
              <LoadCard load={load}/><Link to={`/?id=${load.id}`} className="btn btn-link">Открыть в ленте</Link>
            </Col>))}
        </Row>) : (<p className="text-secondary">
          По заданным условиям нагрузки не найдены.
        </p>)}
    </Container>);
}
