import { opine, serveStatic } from 'https://deno.land/x/opine@2.3.3/mod.ts';
import { opineCors } from 'https://deno.land/x/cors/mod.ts';

const pathToIndexHTML = `${Deno.cwd()}/docs`;
const app = opine();
app.use(opineCors());
app.use(serveStatic(pathToIndexHTML));

app.get('/', function (req, res) {
	console.log(`serving index html from ${pathToIndexHTML}`);
	res.sendFile(`${pathToIndexHTML}/index.html`);
});

let port = 0;

if (Deno.args[0].indexOf(443) === -1) {
	port = Number(Deno.args[0]);

	app.listen(port, () => console.log(`server has started on http://localhost:${port} 🚀`));
} else {
	const pathToCertificates = '/etc/letsencrypt/live/cultmagazine.org';

	console.log(`reading certificates from ${pathToCertificates}`);

	const cert = `${pathToCertificates}/fullchain.pem`;
	const key = `${pathToCertificates}/privkey.pem`;

	const options = {
		cert,
		key
		// ca: fs.readFileSync('/path/to/ca.pem')
	};

	app.listen(port, options, () =>
		console.log(`server has started on https://localhost:${port} 🚀`)
	);
}
