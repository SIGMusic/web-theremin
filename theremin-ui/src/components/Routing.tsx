import React from 'react';

import { BrowserRouter as Router, Route, RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';

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
        const parsed = queryString.parse(props.location.search);
        const host = parsed.host === 'true';
        return <Room {...props} roomCode={roomCode} host={host} />;
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
