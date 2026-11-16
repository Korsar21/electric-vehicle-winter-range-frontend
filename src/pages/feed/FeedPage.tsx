import { useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { getElectricCarLoadFeed } from '../../entities/electric-car-load/model/state';
import LoadCard from '../../widgets/load-card/LoadCard';
import LoadStatus from '../../widgets/load-card/LoadStatus';
export default function FeedPage() {
    const dispatch = useAppDispatch();
    const [params] = useSearchParams();
    const id = Number(params.get('id')) || undefined;
    const { feed, pending } = useAppSelector(s => s.electricCarLoads);
    const authenticated = useAppSelector(s => s.auth.isAuthenticated);
    useEffect(() => { document.title = 'Лента электрических нагрузок'; dispatch(getElectricCarLoadFeed({ id })); }, [dispatch, id, authenticated]);
    return <Container className="page-container py-4"><h1>Электрические нагрузки автомобиля</h1><p className="text-secondary">Лента устройств и систем для эксплуатации электромобиля зимой</p><LoadStatus /><Row className="g-4">{feed && <Col xs={12} md={8} lg={6}><LoadCard load={feed}/></Col>}</Row>{!feed && !pending && <p>Электрические нагрузки не найдены.</p>}<div className="d-flex gap-2 mt-3"><Button disabled={pending > 0} onClick={() => dispatch(getElectricCarLoadFeed({}))}>В начало ленты</Button><Button disabled={pending > 0 || !feed?.has_next} onClick={() => feed && dispatch(getElectricCarLoadFeed({ id: feed.id, next: true }))}>Следующая нагрузка</Button></div></Container>;
}
