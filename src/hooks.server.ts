import { sequence } from '@sveltejs/kit/hooks'
import { add_user_data } from './hooks/add_user_data'
import { protect_routes } from './hooks/protect_routes'
import { attach_services } from './hooks/attach_services'
import type { ServerInit } from '@sveltejs/kit';
import { initiate_db } from './lib/server/db/initiate';
import { run_seeds } from './lib/server/db/seeds/index';
import { dev } from '$app/environment';

export const init: ServerInit = async () => {
    console.log('Database initializing...');
    // Initialize the database structure
    initiate_db();
    
    if (dev === true) {
      console.log('Running seeds in development environment...');
      run_seeds();
    }
};

export const handle = sequence(attach_services, add_user_data, protect_routes)
