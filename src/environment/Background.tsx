import { Sky } from '@react-three/drei';
import { useControls } from 'leva';
import { Vector3 } from 'three';

export type BackgroundProps = {
  visible: boolean;
  distance: number;
  sunPosition: Vector3;
  inclination: number;
  azimuth: number;
};

function Background() {
  const directionalCtl = useControls(
    'Background',
    {
      visible: true,
      distance: 450000,
      sunPosition: [5, 1, 8],
      inclination: 0,
      azimuth: 0.25,
    },
    { collapsed: true, render: () => false },
    [],
  );

  return <>{directionalCtl.visible && <Sky {...directionalCtl} />}</>;
}

export default Background;
