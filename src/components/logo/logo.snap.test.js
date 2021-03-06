import React from 'react';
import {render} from '@testing-library/react';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import Logo from '../logo/logo';


test(`Should Logo render correctly`, () => {
  const history = createMemoryHistory();
  const {container} = render(
      <Router history={history}>
        <Logo/>
      </Router>
  );
  expect(container).toMatchSnapshot();
});
