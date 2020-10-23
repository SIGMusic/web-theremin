import React from 'react';
import dotenv from 'dotenv';

import '@blueprintjs/core/lib/css/blueprint.css';

import Routing from 'components/Routing';

import 'styles/App.css';


dotenv.config();

const App = () => (
  <div
    className="App"
    style={{ width: '100%', height: '100%' }}
  >
    <Routing />
  </div>
);

export default App;
