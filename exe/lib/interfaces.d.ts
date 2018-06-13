export interface IPluginInput {
    modelFileName: string;
    data: any;
    outputFileName: string;
}
export interface IInputFileOptions {
    tmpFolder: string;
}
export interface IPluginOutput {
    outputFileName: string;
    contentType: string;
}
export interface IPlugin {
    generate(input: IPluginInput): Promise<IPluginOutput>;
}
export interface IAppOptions {
    port?: number;
    tmpFolder: string;
}
