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

const port = Number(Deno.args[0]);

if (Deno.args[0].indexOf(443) === -1) {
	app.listen(port, () => console.log(`server has started on http://localhost:${port} 🚀`));
} else {
	const pathToCertificates = '/etc/letsencrypt/live/cultmagazine.org';

	console.log(`reading certificates from ${pathToCertificates}`);

	const cert = await Deno.readTextFile(`/etc/letsencrypt/live/cultmagazine.org/fullchain.pem`);
	const key = await Deno.readTextFile(`/etc/letsencrypt/live/cultmagazine.org/privkey.pem`);
	console.log(cert.length);
	console.log(key.length);

	const options = {
		port,
		certFile: '/etc/letsencrypt/live/cultmagazine.org/fullchain.pem',
		keyFile: '/etc/letsencrypt/live/cultmagazine.org/privkey.pem'
	};

	try {
		await app.listen(options);
		console.log(`server has started on https://localhost:${port} 🚀`);
	} catch (error) {
		console.log(`shit happened: ${error}`);
	}
}
