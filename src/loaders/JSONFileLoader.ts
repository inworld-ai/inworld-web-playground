import { IFileLoader } from './IFileLoader';

export interface JSONFileLoaderProps {
  fileURI: string;
  name: string;
}

// A basic JSON file loader.
export class JSONFileLoader implements IFileLoader {
  data: any;
  fileURI: string;
  name: string;

  constructor(props: JSONFileLoaderProps) {
    this.name = props.name;
    this.fileURI = props.fileURI;
  }

  async load(onLoad: Function, onError?: Function) {
    try {
      const file = await fetch(this.fileURI);
      this.data = await file.json();
      onLoad(this.name, this.data);
    } catch (e: unknown) {
      if (onError) {
        onError(e);
      } else {
        console.error(e);
      }
    }
  }
}
