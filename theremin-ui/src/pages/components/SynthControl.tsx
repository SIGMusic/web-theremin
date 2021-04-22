import React from 'react';
import { Slider } from '@blueprintjs/core';

interface Props {}

interface State {
  cutoff?: number
}

export default class SynthControl extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {cutoff: 100};
  }

  public render() {
    const { cutoff } = this.state === undefined ? this.state : {cutoff: 100};
      return (
          <SynthControl>
              <Slider
                  min={100}
                  max={20000}
                  stepSize={Math.log2(cutoff / 100)}
                  onChange={this.getChangeHandler("cutoff")}
                  labelRenderer={this.renderLabel1}
                  value={cutoff}
                  vertical={true}
              />
          </SynthControl>
      );
  }

  private getChangeHandler(key: string) {
      return (value: number) => this.setState({ [key]: value });
  }

  private renderLabel1 = (val: number) => {
    const { cutoff } = this.state === undefined ? this.state : {cutoff: 100};
      return `${Math.round((20000 / cutoff) * 100)}%`;
  };

}