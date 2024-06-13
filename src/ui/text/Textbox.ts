import { CanvasTexture, DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';

export enum TextAlign {
  Center = 'center',
  Left = 'left',
  Right = 'right',
};

export type TextboxProps = {
  color: string | CanvasGradient | CanvasPattern;
  font: string;
  fontSize: number;
  label: string;
  width?: number;
  height?: number;
  align?: CanvasTextAlign;
};

export class Textbox {

  label: string
  textboxCanvas: HTMLCanvasElement;
  geo: PlaneGeometry;
  plane: Mesh;

  constructor(props: TextboxProps) {
    this.label = props.label;
    this.textboxCanvas = document.createElement("canvas");
    this.textboxCanvas.width = props.width || 100;
    this.textboxCanvas.height = props.height || 100;

    const textboxCanvasContext = this.textboxCanvas.getContext("2d");
    if (!textboxCanvasContext) throw new Error("Error Textbox unable to create context.");
    textboxCanvasContext.font = `${props.fontSize}px ${props.font}`;
    textboxCanvasContext.textAlign = props.align || TextAlign.Left;
    textboxCanvasContext.fillStyle = props.color;
    
    let xPos = 0;
    if (textboxCanvasContext.textAlign === TextAlign.Center) {
      xPos = this.textboxCanvas.width / 2;
    }
    if (textboxCanvasContext.textAlign === TextAlign.Right) {
      xPos = this.textboxCanvas.width;
    }
    textboxCanvasContext.fillText(this.label, xPos, props.fontSize);

    const canvasText = new CanvasTexture(this.textboxCanvas);

    this.geo = new PlaneGeometry((props.width || 100) / 200, (props.height || 100) / 200);
    const material = new MeshStandardMaterial({ flatShading: true, map: canvasText, side: DoubleSide, transparent: true });
    this.plane = new Mesh(this.geo, material)
  }

  get canvas(): HTMLCanvasElement {
    return this.textboxCanvas;
  }
  get mesh(): Mesh {
    return this.plane;
  }

}
