// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import './index.css';
import App from './App';
import { FETCH_MENTIONS, ITEM_CLICKED } from './actions.js';
import reportWebVitals from './reportWebVitals';

type State = {
  initialized: boolean,
  mentions: [],
};

type Action = {
  +type: string,
  +payload: { initialized: boolean, mentions: [] } | string,
};

const mentionsReducer = (state: State = { initialized: false, mentions: [] }, action: Action) => {
  const { payload, type } = action;

  switch (type) {
    case FETCH_MENTIONS:
      return { ...state, ...payload };
    case ITEM_CLICKED:
      const mentionIndex = state.mentions.findIndex(mention => mention.id === payload);
      return {
        ...state,
        mentions: state.mentions.map((mention, index) =>
          index === mentionIndex ? { ...mention, is_clicked: true } : { ...mention },
        ),
      };
    default:
      return state;
  }
};

const rootReducer = () =>
  combineReducers({
    mentions: mentionsReducer,
  });

const store = createStore(
  rootReducer(),
  compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f),
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
