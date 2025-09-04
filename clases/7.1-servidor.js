const http = require('http');

const PORT = 3000;

agenda = [
    {nombre: "Juan",  apellido: "Pérez",    telefono: "(381) 555-0001"},
    {nombre: "María", apellido: "Gómez",    telefono: "(381) 555-0002"},
    {nombre: "Luis",  apellido: "Martínez", telefono: "(381) 555-0003"}
]

function renderAgendaPage(contactos) {
	let lista = contactos.map(c => `<li><b>${c.apellido}, ${c.nombre}</b><br>📱 ${c.telefono}</li>`).join('\n');
	return `
		<!DOCTYPE html>
		<html lang="es">
		<head>
			<meta charset="UTF-8">
			<title>Agenda</title>
		</head>
		<body>
			<h1>Agenda de Contactos</h1>
			<ul>
				${lista}
			</ul>
		</body>
		</html>
	`;
}

const server = http.createServer((req, res) => {
	if (req.url === '/agenda') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(renderAgendaPage(agenda));
	} else {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('No encontrado');
	}
});

server.listen(PORT, () => {
	console.log(`Servidor escuchando en http://localhost:${PORT}/agenda`);
});
