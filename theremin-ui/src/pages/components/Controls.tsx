import React from 'react';
import { Frequency } from 'tone/Tone/core/type/Units';
import { H5, Slider, Switch } from '@blueprintjs/core';

interface State {
  cutoff: Frequency
}

export class Controls extends React.Component<State> {
  constructor() {
    super();
    this.state = {cutoff: 100};
  }

  public render() {
    const { cutoff } = this.state;
      return (
          <Controls>
              <Slider
                  min={100}
                  max={20000}
                  stepSize={Math.log2(cutoff / 100)}
                  onChange={this.getChangeHandler("cutoff")}
                  labelRenderer={this.renderLabel1}
                  value={cutoff}
                  vertical={true}
              />
          </Controls>
      );
  }

  private getChangeHandler(key: string) {
      return (value: number) => this.setState({ [key]: value });
  }

  private renderLabel1 = (val: number) => {
      return `${Math.round((20000 / this.state.cutoff) * 100)}%`;
  };

}