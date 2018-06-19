"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const fs = require("fs");
const path = require("path");
const exist = util.promisify(fs.exists);
const stat = util.promisify(fs.stat);
const readDir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
class DirectoryCleaner {
    constructor(options) {
        this.options = options;
    }
    static async emptyFolder(folderPath, atDate) {
        atDate = atDate || new Date();
        if (await exist(folderPath)) {
            const dir = (await readDir(folderPath))
                .map((s) => path.join(folderPath, s));
            for (const fileName of dir) {
                let fileStat = await stat(fileName);
                const mTime = fileStat.mtime;
                if (atDate.getTime() > mTime.getTime()) {
                    await unlink(fileName);
                }
            }
        }
        else {
            throw new Error(`The path ${folderPath} does not exist`);
        }
    }
    start() {
        if (this.timer) {
            return;
        }
        const f = () => {
            const atDate = new Date(new Date().getTime() - this.options.delay);
            DirectoryCleaner.emptyFolder(this.options.path, atDate).catch((e) => { });
        };
        f();
        this.timer = setInterval(f, this.options.interval);
        this.timer.unref();
    }
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}
exports.DirectoryCleaner = DirectoryCleaner;
//# sourceMappingURL=directory-cleaner.js.map