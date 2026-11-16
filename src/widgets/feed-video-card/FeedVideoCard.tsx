import { useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { deleteElectricCarLoad, setElectricCarLoadLike, type Load } from '../../entities/electric-car-load/model/state';
import { mediaUrl } from '../../shared/api/client';
import './FeedVideoCard.css';

interface FeedVideoCardProps {
    load: Load;
    onRestart: () => void;
    onNext: () => void;
}

export default function FeedVideoCard({ load, onRestart, onNext }: FeedVideoCardProps) {
    const dispatch = useAppDispatch();
    const authenticated = useAppSelector(s => s.auth.isAuthenticated);
    const busy = useAppSelector(s => s.electricCarLoads.pending > 0);
    const [heartAnimation, setHeartAnimation] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [videoFailed, setVideoFailed] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const descriptionId = useId();
    const imageSrc = mediaUrl(load.image_url, '/default.jpg');
    const videoSrc = mediaUrl(load.video_url, '/default.mp4');

    async function toggleLike() {
        if (!authenticated || busy) return;
        const like = load.is_liked ? 0 : 1;
        // The thunk updates Redux from the server. Animation never changes the count.
        const result = await dispatch(setElectricCarLoadLike({ id: load.id, like }));
        if (like === 1 && setElectricCarLoadLike.fulfilled.match(result)) setHeartAnimation(true);
    }

    async function togglePlayback() {
        const video = videoRef.current;
        if (!video) return;
        if (!video.paused) video.pause();
        else {
            try { await video.play(); }
            catch { setVideoFailed(true); }
        }
    }

    return (
        <article className="feed-page" aria-labelledby={`feed-title-${load.id}`}>
            <video
                ref={videoRef}
                className="feed-video"
                src={videoSrc}
                poster={imageSrc}
                autoPlay muted loop playsInline preload="metadata"
                aria-label={`Видео: ${load.name}`}
                onPlay={() => { setPlaying(true); setVideoFailed(false); }}
                onPause={() => setPlaying(false)}
                onError={() => setVideoFailed(true)}
            />
            <div className="feed-gradient" aria-hidden="true" />
            <button type="button" className="feed-playback" onClick={togglePlayback} disabled={videoFailed}
                aria-label={playing ? 'Приостановить видео' : 'Воспроизвести видео'}>
                {playing ? 'Ⅱ' : '▶'}
            </button>
            {videoFailed && <p className="feed-media-error" role="status">Видео недоступно или его формат не поддерживается браузером.</p>}
            <img className="feed-thumbnail" src={imageSrc} alt={load.name}
                onError={event => {
                    const image = event.currentTarget;
                    if (image.getAttribute('src') !== '/default.jpg') image.src = '/default.jpg';
                }} />

            <div className="feed-like">
                {authenticated ? (
                    <button type="button" className={`feed-heart${load.is_liked ? ' is-liked' : ''}`}
                        disabled={busy} aria-pressed={Boolean(load.is_liked)}
                        aria-label={load.is_liked ? 'Убрать лайк' : 'Нравится'} onClick={toggleLike}>
                        {load.is_liked ? '♥' : '♡'}
                    </button>
                ) : (
                    <Link to="/auth" className="feed-heart" aria-label="Войти, чтобы поставить лайк">♡</Link>
                )}
                <span aria-label={`Нравится: ${load.like_count}`} aria-live="polite">{load.like_count}</span>
            </div>
            {heartAnimation && <span className="feed-heart-burst" aria-hidden="true"
                onAnimationEnd={() => setHeartAnimation(false)}>♥</span>}

            <section className="feed-content">
                <span className="category-badge">{load.category}</span>
                <h1 className="feed-title" id={`feed-title-${load.id}`}>{load.name}</h1>
                <div className="feed-description">
                    <p id={descriptionId} className={`description-text${expanded ? ' is-expanded' : ''}`}>{load.description}</p>
                    {load.description && <button type="button" className="description-toggle-label"
                        aria-expanded={expanded} aria-controls={descriptionId} onClick={() => setExpanded(!expanded)}>
                        {expanded ? 'Скрыть' : 'Ещё'}
                    </button>}
                </div>
                {authenticated && load.is_creator === 1 && (
                    <button type="button" className="feed-delete" disabled={busy}
                        onClick={() => dispatch(deleteElectricCarLoad(load.id))}>Удалить</button>
                )}
            </section>

            <div className="feed-metrics">
                <div className="feed-metric">
                    <div className="metric-icon" aria-hidden="true">⚡</div>
                    <div className="metric-label">Мощность</div>
                    <p className="metric-value">{load.power_draw_w} Вт</p>
                </div>
                <div className="feed-metric">
                    <div className="metric-icon" aria-hidden="true">!</div>
                    <div className="metric-label">Приоритет</div>
                    <p className="metric-priority">{load.priority}</p>
                </div>
            </div>

            <button type="button" className="feed-restart" disabled={busy} onClick={onRestart}>В начало ленты</button>
            <button type="button" className="next-link" disabled={busy || !load.has_next} onClick={onNext}
                aria-label="Следующая нагрузка">Далее <span className="next-arrow" aria-hidden="true">→</span></button>
        </article>
    );
}
