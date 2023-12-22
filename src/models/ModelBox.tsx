import { useCallback, useEffect, useState } from "react";
import { Vector3 } from "three";

import { ModelFileLoader } from "../loaders/ModelFileLoader";

interface ModelBoxProps {
  isLoaded: boolean;
  name?: string;
  position: Vector3;
  scale: Vector3;
}

function ModelBox(props: ModelBoxProps) {
  const [box, setBox] = useState<ModelFileLoader>(null!);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (props.isLoaded) {
      setBox(new ModelFileLoader("/assets/models/wooden_box.glb"));
    }
  }, [props.isLoaded]);

  useEffect(() => {
    if (box) {
      box.load(onLoad);
    }
  }, [box]);

  const onLoad = useCallback(() => {
    if (box && box.getModel()) {
      box
        .getModel()!
        .position.set(props.position.x, props.position.y, props.position.z);
      box.getModel()!.scale.set(props.scale.x, props.scale.y, props.scale.z);
      setIsLoaded(true);
    }
  }, [box]);

  return (
    <>
      {isLoaded && (
        <primitive
          name={props.name || "Box"}
          object={box!.getModel()!}
          castShadow
          receiveShadow
        />
      )}
    </>
  );
}

export default ModelBox;
