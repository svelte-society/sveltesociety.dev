// @ts-check

import { entrySchema } from '../src/lib/schema.js';
import components from '../src/routes/components/components.json' assert { type: 'json' };
import templates from '../src/routes/templates/templates.json' assert { type: 'json' };
import tools from '../src/routes/tools/tools.json' assert { type: 'json' };

Object.entries({ components, templates, tools }).forEach(([name, data]) => {
	console.log(`Validating ${name}.json...`);
	entrySchema.parse(data);
});
