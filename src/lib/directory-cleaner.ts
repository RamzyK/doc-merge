import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';

const exist = util.promisify(fs.exists);
const stat = util.promisify(fs.stat);
const readDir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
export interface IDirectoryCleanerOptions {
    path: string;
    interval: number;

    delay: number;
}
export class DirectoryCleaner {
    public static async emptyFolder(folderPath: string, atDate: Date): Promise<void> {
        atDate = atDate || new Date();

        if (await exist(folderPath)) {
            const dir = (await readDir(folderPath))
                .map((s) => path.join(folderPath, s));
            for (const fileName of dir) {
                // array[array.length] = file.item();
                let fileStat = await stat(fileName);
                const mTime = fileStat.mtime;
                if (atDate.getTime() > mTime.getTime()) {
                    await unlink(fileName);
                }
            }
        } else {
            throw new Error(`The path ${folderPath} does not exist`);
        }
    }

    private timer: NodeJS.Timer;
    public constructor(private readonly options: IDirectoryCleanerOptions) {
    }
    public start() {
        if (this.timer) {
            return;
        }
        const f = () => {
            const atDate = new Date(new Date().getTime() - this.options.delay);
            DirectoryCleaner.emptyFolder(this.options.path, atDate).catch((e) => { /*TODO log err*/ });
        };
        f();
        this.timer = setInterval(f, this.options.interval);
        this.timer.unref();
    }
    public stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}
