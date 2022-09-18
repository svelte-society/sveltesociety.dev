import { opine, serveStatic } from 'https://deno.land/x/opine@2.3.3/mod.ts';

const port = Number(Deno.args[0]);
const pathToIndexHTML = `${Deno.cwd()}/docs`;
const app = opine();
app.use(serveStatic(pathToIndexHTML));

app.get('/', function (req, res) {
	console.log(`serving index html from ${pathToIndexHTML}`);
	res.sendFile(`${pathToIndexHTML}/index.html`);
});

app.listen(port, () => console.log(`server has started on http://localhost:${port} 🚀`));
