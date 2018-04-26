import * as express from 'express';
import * as path from 'path';
import * as util from 'util';
import * as http from 'http';

function startApp(app: express.Express): Promise<http.Server> {
    return new Promise<http.Server>(
        (resolve, reject) => {
            const server = http.createServer(app);
            server.listen(0, () => {
                resolve(server);
            });
        }
    );
}
export async function createStaticServer(): Promise<http.Server> {
    const app = express();
    const staticDir = path.join(__dirname, '..', '..', 'test-files');
    app.use(express.static(staticDir));
    const server = await startApp(app);
    return server;
}
