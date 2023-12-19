// @ts-check

import { packagesSchema, templatesSchema, resourcesSchema } from '../src/lib/schemas.js';
import packages from '../src/routes/packages/packages.json' assert { type: 'json' };
import templates from '../src/routes/templates/templates.json' assert { type: 'json' };
import books from '../src/routes/resources/books.json' assert { type: 'json' };
import extensions from '../src/routes/resources/extensions.json' assert { type: 'json' };
import misc from '../src/routes/resources/misc.json' assert { type: 'json' };
import videos from '../src/routes/resources/videos.json' assert { type: 'json' };

packagesSchema.parse(packages);
console.log('Validated packages.json');

templatesSchema.parse(templates);
console.log('Validated templates.json');

resourcesSchema.parse(books);
console.log('Validated books.json');

resourcesSchema.parse(extensions);
console.log('Validated extensions.json');

resourcesSchema.parse(misc);
console.log('Validated misc.json');

resourcesSchema.parse(videos);
console.log('Validated videos.json');
