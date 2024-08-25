import { sequence } from '@sveltejs/kit/hooks';
import { protect_routes } from './hooks/protect_routes';
import { add_user_data } from './hooks/add_user_data';

export const handle = sequence(add_user_data, protect_routes);
