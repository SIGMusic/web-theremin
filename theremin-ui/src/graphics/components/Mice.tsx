import React from 'react';
import { Node } from 'gl-react';

import shaders from 'graphics/utils/shaders';


interface Props { }
interface State { }

/**
 * Tracks two mice on the screen.
 */
class Mice extends React.Component<Props, State> {
  render = () => {
    return (
    <Node
      shader={shaders.mice}
      uniforms={{
        iMouse: [10, 10, 0, 0],
        iResolution: [300, 300, 0],
        iTime: 1.0,
      }}
    />
    );
  };
}

export default Mice;