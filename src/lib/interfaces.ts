export interface IPluginInput {
    modelFileName: string;          // Model File
    data: any;                      // informations to merge with the file
    outputFileName: string;         // File's output name
}

export interface IInputFileOptions {
    tmpFolder: string;
}

export interface IPluginOutput {
    outputFileName: string;         // a voir les autres infos
    contentType: string;            // Type of the output document (docx, pdf, etc.)
}

export interface IPlugin {
    // TODO
    generate(input: IPluginInput): Promise<IPluginOutput>;
}

export interface IAppOptions {
    port?: number;
    tmpFolder: string;
}
