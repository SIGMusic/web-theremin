import React from 'react';

import { BrowserRouter as Router, Route, RouteComponentProps } from 'react-router-dom';

import LandingPage from 'pages/components/LandingPage';

interface MatchParams {
  roomCode: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

/**
 * Handles client-side routing. Currently, everything routes to the landing
 * page.
 */
const Routing = () => (
  <Router>
    <Route
      exact
      path={`${process.env.NODE_ENV === 'production' ? '/web-theremin' : ''}/`}
      render={(props: Props) => <LandingPage {...props} />}
    />
  </Router>
);

export default Routing;
