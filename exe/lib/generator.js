"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Generator {
    constructor(options) {
        this.options = options;
        this.docExtention = new Map();
    }
    async docMerge(input) {
        const plugIn = this.docExtention.get(input.type);
        if (plugIn) {
            return plugIn.merge(input.modeleRef, input);
        }
        else {
            throw new Error(`Plugin not registered for ${input.type}`);
        }
    }
    async registerPlugin(type, plugin) {
        this.docExtention.set(type, plugin);
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map