import { log } from '../utils/log';
import { IFileLoader } from './IFileLoader';

export interface FileLoaderProps {
  fileURI: string;
  name: string;
}

// A basic file loader.
export class FileLoader implements IFileLoader {
  fileURI: string;
  name: string;

  constructor(props: FileLoaderProps) {
    this.name = props.name;
    this.fileURI = props.fileURI;
  }

  async load(onLoad: Function, onError?: Function) {
    try {
      // log("FileLoader loading:", this.fileURI);
      const file = await fetch(this.fileURI);
      onLoad(this.name);
    } catch (e: unknown) {
      if (onError) {
        onError(e);
      } else {
        console.error(e);
      }
    }
  }
}
