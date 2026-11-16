import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { getElectricCarLoadFeed } from '../../entities/electric-car-load/model/state';
import FeedVideoCard from '../../widgets/feed-video-card/FeedVideoCard';
import LoadStatus from '../../widgets/load-card/LoadStatus';
import './FeedPage.css';

export default function FeedPage() {
    const dispatch = useAppDispatch();
    const [params] = useSearchParams();
    const id = Number(params.get('id')) || undefined;
    const { feed, pending } = useAppSelector(s => s.electricCarLoads);
    const authenticated = useAppSelector(s => s.auth.isAuthenticated);

    useEffect(() => {
        document.title = 'Лента электрических нагрузок';
        dispatch(getElectricCarLoadFeed({ id }));
    }, [dispatch, id, authenticated]);

    const restartFeed = () => { dispatch(getElectricCarLoadFeed({})); };

    return (
        <main className="feed-screen" aria-label="Лента электрических нагрузок">
            <div className="feed-status"><LoadStatus /></div>
            {feed ? (
                <FeedVideoCard
                    key={feed.id}
                    load={feed}
                    onRestart={restartFeed}
                    onNext={() => dispatch(getElectricCarLoadFeed({ id: feed.id, next: true }))}
                />
            ) : (
                <section className="feed-empty">
                    <h1>Лента электрических нагрузок</h1>
                    {!pending && <p>Электрические нагрузки не найдены.</p>}
                    <button type="button" disabled={pending > 0} onClick={restartFeed}>В начало ленты</button>
                </section>
            )}
        </main>
    );
}
