export { IFile, IInputFileOptions, InputFile, InputFileRef, IInputFile, IOutputFile }
    from './input-ref/input-file';
export { IPluginOld, Generator, IBody, IPluginResult, isIBody, OutputType }
    from './generator';
export { FilePlugin }
    from './docx-plugin';
export { IPlugin }
    from './generateur/index';
export { Client, App }
    from '../../../doc-merge-client/src/lib/index';
export { IErrorHandlerOptions, ErrorHandler }
    from '../lib/errors/error-handler-middleware';
export { IErrorConstructorArgs, IErrorData, ExtError }
    from '../lib/errors/ext-error';
export { DocGenerator }
    from './plugins/docGenerator';
export { EchoPlugin }
    from './plugins/echo-plugin';
export { asyncMiddleware }
    from './async-handler';
export { DownloadHandler }
    from './downloadManager';
