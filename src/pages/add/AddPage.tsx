import { useEffect, useState } from 'react';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { getElectricCarLoadDraft, createElectricCarLoadDraft, publishElectricCarLoad, deleteElectricCarLoad } from '../../entities/electric-car-load/model/state';
import LoadStatus from '../../widgets/load-card/LoadStatus';
import { mediaUrl } from '../../shared/api/client';
export default function AddPage() {
    useEffect(() => { document.title = 'Добавление электрической нагрузки'; }, []);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const authenticated = useAppSelector(s => s.auth.isAuthenticated);
    const { draft, pending } = useAppSelector(s => s.electricCarLoads);
    const [image, setImage] = useState<File>();
    const [video, setVideo] = useState<File>();
    const [preview, setPreview] = useState('');
    const [videoPreview, setVideoPreview] = useState('');
    const [error, setError] = useState('');
    const [fields, setFields] = useState({ name: '', description: '', category: 'Отопление', power_draw_w: 100, priority: 'Средний' });
    useEffect(() => { if (authenticated)
        dispatch(getElectricCarLoadDraft()); }, [dispatch, authenticated]);
    useEffect(() => () => { if (preview)
        URL.revokeObjectURL(preview); }, [preview]);
    useEffect(() => () => { if (videoPreview)
        URL.revokeObjectURL(videoPreview); }, [videoPreview]);
    if (!authenticated)
        return <Navigate to="/auth" replace/>;
    return <Container className="page-container py-4"><h1>Добавление электрической нагрузки</h1><LoadStatus />{error && <Alert variant="danger">{error}</Alert>}{draft && <Alert variant="info">Продолжение черновика «{draft.name}». Медиафайлы уже сохранены. Для других файлов удалите этот черновик и создайте новый.</Alert>}<Form onSubmit={async (e) => { e.preventDefault(); if (pending)
        return; setError(''); try {
        let id = draft?.id;
        if (!id) {
            if (!image || !video)
                throw Error('Выберите изображение и видео');
            id = (await dispatch(createElectricCarLoadDraft({ name: fields.name, image, video })).unwrap()).id;
        }
        await dispatch(publishElectricCarLoad({ id, ...fields })).unwrap();
        navigate('/tile');
    }
    catch (err) {
        setError(typeof err === 'string' ? err : err instanceof Error ? err.message : 'Ошибка публикации');
    } }}>
 <Form.Label htmlFor="load-name">Название</Form.Label><Form.Control id="load-name" value={draft?.name ?? fields.name} disabled={!!draft || pending > 0} required onChange={e => setFields({ ...fields, name: e.target.value })}/>
 <Form.Label htmlFor="description">Описание</Form.Label><Form.Control id="description" as="textarea" value={fields.description} required disabled={pending > 0} onChange={e => setFields({ ...fields, description: e.target.value })}/>
 <Form.Label htmlFor="category">Категория</Form.Label><Form.Select id="category" value={fields.category} disabled={pending > 0} onChange={e => setFields({ ...fields, category: e.target.value })}>{['Отопление', 'Обзорность', 'Терморегулирование батареи', 'Другое'].map(x => <option key={x}>{x}</option>)}</Form.Select>
 <Form.Label htmlFor="power">Мощность, Вт</Form.Label><Form.Control id="power" type="number" min="0" max="10000" required disabled={pending > 0} value={fields.power_draw_w} onChange={e => setFields({ ...fields, power_draw_w: Number(e.target.value) })}/>
 <Form.Label htmlFor="priority">Приоритет</Form.Label><Form.Select id="priority" value={fields.priority} disabled={pending > 0} onChange={e => setFields({ ...fields, priority: e.target.value })}>{['Низкий', 'Средний', 'Высокий'].map(x => <option key={x}>{x}</option>)}</Form.Select>
 <Form.Label htmlFor="image">Изображение</Form.Label><Form.Control id="image" type="file" accept="image/*" required={!draft} disabled={!!draft || pending > 0} onChange={e => { const file = (e.target as HTMLInputElement).files?.[0]; setImage(file); setPreview(file ? URL.createObjectURL(file) : ''); }}/><img alt="Предпросмотр изображения" src={preview || mediaUrl(draft?.image_url, '/default.jpg')} className="mt-2" style={{ maxWidth: 320, maxHeight: 200 }}/>
 <Form.Label htmlFor="video" className="d-block mt-3">Видео</Form.Label><Form.Control id="video" type="file" accept="video/*" required={!draft} disabled={!!draft || pending > 0} onChange={e => { const file = (e.target as HTMLInputElement).files?.[0]; setVideo(file); setVideoPreview(file ? URL.createObjectURL(file) : ''); }}/>{(videoPreview || draft?.video_url) && <video controls src={videoPreview || mediaUrl(draft?.video_url, '/default.mp4')} style={{ maxWidth: 320 }}/>}
 <div className="d-flex gap-2 mt-3"><Button type="submit" disabled={pending > 0}>Опубликовать электрическую нагрузку</Button>{draft && <Button variant="outline-danger" disabled={pending > 0} onClick={() => dispatch(deleteElectricCarLoad(draft.id))}>Удалить черновик</Button>}</div></Form></Container>;
}
