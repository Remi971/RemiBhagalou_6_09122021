const http = require('http'); // Import du package http natif de Node pour créer un serveur
const app = require('./app'); // Import de l'appli (fonctions middleware)

const normalizePort = val => { // Renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); // set de l'appli sur un port

const errorHandler = error => { // Recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée sur le serveur
    if (error.syscall !== 'listen') {
        throw error;
    }
    const adress = server.adress();
    const bind = typeof adress === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADRRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;

    }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port); // configure le serveur pour qu'il écoute soit la variable process.env.PORT, soit le port 3000