
export type LoadPriority = 'Низкий' | 'Средний' | 'Высокий';

export interface ElectricCarLoad {
  id: number;
  name: string;
  description: string;
  category: string;
  power_draw_w: number;
  priority: LoadPriority;
  image_url: string | null;
  video_url: string | null;
  like_count: number;
}
