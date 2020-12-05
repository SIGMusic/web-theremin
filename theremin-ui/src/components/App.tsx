import React from 'react';
import dotenv from 'dotenv';
import { Classes } from '@blueprintjs/core';

import '@blueprintjs/core/lib/css/blueprint.css';

import Routing from 'components/Routing';

import 'styles/App.css';


dotenv.config();

const App = () => (
  <div
    className={`App ${Classes.DARK}`}
    style={{ width: '100vw', height: '100vh' }}
  >
    <Routing />
  </div>
);

export default App;
