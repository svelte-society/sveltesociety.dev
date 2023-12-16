// @ts-check

import { componentsSchema, templatesSchema, toolsSchema } from '../src/lib/schemas.js';
import components from '../src/routes/components/components.json' assert { type: 'json' };
import templates from '../src/routes/templates/templates.json' assert { type: 'json' };
import tools from '../src/routes/tools/tools.json' assert { type: 'json' };

componentsSchema.parse(components);
console.log('Validated components.json');

templatesSchema.parse(templates);
console.log('Validated templates.json');

toolsSchema.parse(tools);
console.log('Validated tools.json');
