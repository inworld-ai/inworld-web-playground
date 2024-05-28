import { CanvasTexture, DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import { TextGeometry } from 'three-stdlib';

export type TextboxProps = {
  color: string | CanvasGradient | CanvasPattern;
  font: string;
  fontSize: number;
  label: string;
  width?: number;
  height?: number;
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
    // textboxCanvasContext.rect(1, 1, 98, 98);
    // textboxCanvasContext.fillStyle = "white";
    // textboxCanvasContext.fill();
    textboxCanvasContext.font = `${props.fontSize}px ${props.font}`;
    textboxCanvasContext.fillStyle = props.color;
    textboxCanvasContext.fillText(this.label, 0, props.fontSize);

    const canvasText = new CanvasTexture(this.textboxCanvas);

    this.geo = new PlaneGeometry((props.width || 100) / 100, (props.height || 100) / 100);
    const material = new MeshStandardMaterial({ map: canvasText, side: DoubleSide, transparent: true });
    this.plane = new Mesh(this.geo, material)
  }

  get canvas(): HTMLCanvasElement {
    return this.textboxCanvas;
  }
  get mesh(): Mesh {
    return this.plane;
  }

}
