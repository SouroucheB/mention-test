// @flow

import fetch from 'cross-fetch';

export const FETCH_MENTIONS = 'FETCH_MENTIONS';
export const ITEM_CLICKED = 'ITEM_CLICKED';

type Action = { type: 'ITEM_CLICKED', payload: string } | { type: 'FETCH_MENTIONS', payload: {} };

type ThunkAction = (dispatch: Dispatch) => any;
type Dispatch = (action: Action | ThunkAction | Array<Action>) => any;

export const getItemClicked =
  (id: string): ThunkAction =>
  dispatch =>
    dispatch({ type: ITEM_CLICKED, payload: id });

export const fetchMentions = (): ThunkAction => {
  return dispatch => {
    const apiHost = process.env.REACT_APP_API_HOST;
    const accessToken = process.env.REACT_APP_ACCESS_TOKEN;
    const accountId = process.env.REACT_APP_ACCOUNT_ID;
    const alertId = process.env.REACT_APP_ALERT_ID;

    // Flow
    if (!apiHost) {
      throw new Error('REACT_APP_API_HOST env variable is missing');
    }

    if (!accessToken) {
      throw new Error('REACT_APP_ACCESS_TOKEN env variable is missing');
    }

    if (!accountId) {
      throw new Error('REACT_APP_ACCOUNT_ID env variable is missing');
    }

    if (!alertId) {
      throw new Error('REACT_APP_ALERT_ID env variable is missing');
    }

    return fetch(`https://${apiHost}/accounts/${accountId}/alerts/${alertId}/mentions`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        throw new Error('La connexion avec LinkedIn a échoué');
      })
      .then(data =>
        dispatch({
          type: FETCH_MENTIONS,
          payload: {
            mentions: data.mentions.map(mention => ({ ...mention, is_clicked: false })),
            initialized: true,
          },
        }),
      )
      .catch(error => ({ isError: true, message: error.message }));
  };
};
