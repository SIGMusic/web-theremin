import React from 'react';
import { Node } from 'gl-react';

import { Location } from 'misc/utils/location';
import shaders from 'graphics/utils/shaders';


interface Props {
  /** Absolute mouse position. */
  mouse: Location;
}
interface State { }

/**
 * Tracks two mice on the screen.
 */
class Mice extends React.Component<Props, State> {
  render = () => {
    const { mouse } = this.props;
    return (
      <Node
        shader={shaders.mice}
        uniforms={{
          iMouse: [mouse.x * 300, (1-mouse.y) * 300, 0, 0],
          iResolution: [300, 300, 0],
          iTime: 1.0,
        }}
      />
    );
  };
}

export default Mice;