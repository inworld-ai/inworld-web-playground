import { folder, useControls } from 'leva';

function Lighting() {
  const lightCtl = useControls(
    'Lighting',
    {
      Ambient: folder({
        ambientVisible: { value: true, label: 'Visible' },
        ambientIntensity: { value: 1, min: 0, max: 5, label: 'Intensity' },
      }),
      Directional: folder({
        directionalVisible: { value: true, label: 'Visible' },
        directionalPosition: {
          value: {
            x: 10,
            y: 10,
            z: 20,
          },
          label: 'Position',
        },
        directionalIntensity: {
          value: 1,
          min: 0,
          max: 5,
          label: 'Intensity',
        },
        directionalCastShadow: { value: true, label: 'Cast Shadow' },
        Helper: folder(
          {
            directionalHelperVisible: { value: false, label: 'Visible' },
            directionalHelperColor: { value: '#f00', label: 'Color' },
            directionalHelperSize: { value: 1, min: 0, max: 5, label: 'Size' },
          },
          { collapsed: true },
        ),
      }),
      Hemisphere: folder({
        hemisphereVisible: { value: true, label: 'Visible' },
        hemisphereColorA: { value: '#fff', label: 'Color A' },
        hemisphereColorB: { value: '#333', label: 'Color B' },
        hemisphereIntensity: { value: 1, min: 0, max: 5, label: 'Intensity' },
      }),
    },
    { collapsed: true, render: () => false },
  );

  return (
    <>
      <ambientLight
        visible={lightCtl.ambientVisible}
        intensity={lightCtl.ambientIntensity}
      />
      <hemisphereLight
        args={[lightCtl.hemisphereColorA, lightCtl.hemisphereColorB]}
        intensity={lightCtl.hemisphereIntensity}
        visible={lightCtl.hemisphereVisible}
      />
      <directionalLight
        visible={lightCtl.directionalVisible}
        intensity={lightCtl.directionalIntensity}
        position={[
          lightCtl.directionalPosition.x,
          lightCtl.directionalPosition.y,
          lightCtl.directionalPosition.z,
        ]}
      />
    </>
  );
}

export default Lighting;
