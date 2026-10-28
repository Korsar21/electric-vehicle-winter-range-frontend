
import type { ElectricCarLoad } from '../../entities/electric-car-load/model/types';

export const mockLoads: ElectricCarLoad[] = [
  {
    id: 1,
    name: 'Обогреватель салона',
    description:
      'Поддерживает комфортную температуру внутри автомобиля в зимних условиях.',
    category: 'Отопление',
    power_draw_w: 4500,
    priority: 'Высокий',
    image_url: '/default.jpg',
    video_url: '/default.mp4',
    like_count: 12,
  },
  {
    id: 2,
    name: 'Обогрев передних сидений',
    description:
      'Обеспечивает быстрый подогрев сидений в холодную погоду.',
    category: 'Отопление',
    power_draw_w: 120,
    priority: 'Средний',
    image_url: null,
    video_url: null,
    like_count: 8,
  },
  {
    id: 3,
    name: 'Обогрев рулевого колеса',
    description:
      'Снижает дискомфорт при управлении автомобилем зимой.',
    category: 'Отопление',
    power_draw_w: 80,
    priority: 'Средний',
    image_url: null,
    video_url: null,
    like_count: 6,
  },
  {
    id: 4,
    name: 'Обогрев заднего стекла',
    description:
      'Помогает удалить запотевание и наледь с заднего стекла.',
    category: 'Видимость',
    power_draw_w: 300,
    priority: 'Высокий',
    image_url: null,
    video_url: null,
    like_count: 10,
  },
  {
    id: 5,
    name: 'Обогрев зеркал',
    description:
      'Улучшает обзорность за счёт удаления влаги и наледи с зеркал.',
    category: 'Видимость',
    power_draw_w: 100,
    priority: 'Средний',
    image_url: null,
    video_url: null,
    like_count: 4,
  },
  {
    id: 6,
    name: 'Терморегуляция аккумулятора',
    description:
      'Поддерживает подходящий температурный режим тяговой батареи.',
    category: 'Аккумулятор',
    power_draw_w: 600,
    priority: 'Высокий',
    image_url: null,
    video_url: null,
    like_count: 15,
  },
];
