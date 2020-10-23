import React from 'react';

import { BrowserRouter as Router, Route, RouteComponentProps } from 'react-router-dom';

import LandingPage from 'components/LandingPage';
import Room from 'components/Room';

interface MatchParams {
  roomCode: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

const Routing = () => (
  <Router>
    <Route
      exact
      path="/room/:roomCode"
      render={(props: Props) => {
        const { roomCode } = props.match.params;
        return <Room {...props} roomCode={roomCode} />;
      }}
    />
    <Route
      exact
      path="/"
      render={(props: Props) => <LandingPage {...props} />}
    />
  </Router>
);

export default Routing;
