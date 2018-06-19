export interface IDirectoryCleanerOptions {
    path: string;
    interval: number;
    delay: number;
}
export declare class DirectoryCleaner {
    private readonly options;
    static emptyFolder(folderPath: string, atDate: Date): Promise<void>;
    private timer;
    constructor(options: IDirectoryCleanerOptions);
    start(): void;
    stop(): void;
}
