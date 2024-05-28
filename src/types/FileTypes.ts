
export type FileLoadableType = {
  [key: string]: string;
}

export type FilesLoadableType = {
  [key: string]: FileLoadableType;
}

export type ImageLoadableType = {
  [key: string]: string;
}

export type ImageType = {
  image: HTMLImageElement;
}

export type ImagesType = {
  [key: string]: ImageType;
}

export type JSONLoadableType = {
  [key: string]: string;
}

export type JSONSType = {
  [key: string]: JSON;
}
