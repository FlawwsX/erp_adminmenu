import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';

import {BrowserRouter as Router} from 'react-router-dom';

import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import reducers from './redux/reducers'
import thunk from 'redux-thunk';

const store = createStore(reducers, composeWithDevTools(
  applyMiddleware(thunk),
))

ReactDOM.render(
  <Provider store={store}>
    <Router basename="/">
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
