import { IPlugin, IPluginResult, Generator } from './generator';
import { IInputFile, InputFile } from './input-ref/input-file';
// tslint:disable:no-console
export class DocXPlugin implements IPlugin {
    public name?: string;
    public async merge(modele: string, data: string | IInputFile, fileName?: string): Promise<IPluginResult> {
        let extension = modele.substr(modele.lastIndexOf('/') + 1).split('.');
        let tmpFolder = modele;
        const ipFile = new InputFile({
            tmpFolder,
        });
        if (extension[1] === 'docx') {
            ipFile.getFile(data);
        } else if (extension[1] === 'pdf') {
            // do pdf generation doc work
        } else {
            console.log('Other type of document!');
        }
        return null;
    }
}
