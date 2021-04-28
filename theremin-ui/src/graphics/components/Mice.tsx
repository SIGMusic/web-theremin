import React from 'react';
import { Node } from 'gl-react';
import { Surface } from 'gl-react-dom';

import { Location } from 'misc/utils/location';
import shaders from 'graphics/utils/shaders';


interface Props {
  /** Absolute mouse position. */
  mouse: Location;
}
interface State { 
  width: number
  height: number
}

/**
 * Tracks two mice on the screen.
 */
class Mice extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { width: window.innerWidth, height: window.innerHeight };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render = () => {
    const { mouse } = this.props;
    return (
      <div className="background-canvas">
        <Surface
          width={this.state.width}
          height={this.state.height}
        >
          <Node
            shader={shaders.mice}
            uniforms={{
              iMouse: [mouse.x * this.state.width, (1-mouse.y) * this.state.height, 0, 0],
              iResolution: [this.state.width, this.state.height, 0],
              iTime: 1.0,
            }}
          />
        </Surface>
      </div>
    );
  };
}

export default Mice;