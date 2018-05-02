"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Generator {
    constructor(options) {
        this.options = options;
        this.docExtention = new Map();
    }
    async docMerge(input) {
        const plugIn = this.docExtention.get(input.type);
        let docPath = typeof (input.file) === 'string' ? input.path : input.file.url;
        if (plugIn) {
            return plugIn.merge(docPath, input.data);
        }
        else {
            throw new Error(`Plugin not registered for ${input.type}`);
        }
    }
    async registerPlugin(type, plugin) {
        this.docExtention.set(type, plugin);
    }
    plugCall(modele, plugin) {
        if (typeof (this.options.file) === 'string') {
            plugin.merge(this.options.file.toString(), this.options.data, this.options.fileName);
        }
        else {
            plugin.merge(this.options.file.url, this.options.data, this.options.fileName);
        }
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map