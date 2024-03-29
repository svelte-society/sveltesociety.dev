// @ts-check

import { packagesSchema, templatesSchema } from '../src/lib/schemas.js';
import packages from '../src/routes/packages/packages.json' assert { type: 'json' };
import templates from '../src/routes/templates/templates.json' assert { type: 'json' };

packagesSchema.parse(packages);
console.log('Validated packages.json');

templatesSchema.parse(templates);
console.log('Validated templates.json');
