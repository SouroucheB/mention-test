// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import moment from 'moment';

import { fetchMentions, getItemClicked } from './actions.js';

import loader from './assets/puff.svg';
import './App.scss';

// Flow
type Props = {
  initialized: boolean,
  mentions: [],
  getMentions: () => {},
  getItemClicked: string => {},
};

class App extends React.Component<Props> {
  componentDidMount() {
    const { getMentions } = this.props;

    getMentions();
  }

  handleClick(id: string) {
    const { getItemClicked } = this.props;

    getItemClicked(id);
  }

  render() {
    const { initialized, mentions } = this.props;

    if (initialized) {
      return mentions.map((mention, index) => (
        <button
          key={get(mention, 'id')}
          type="button"
          onClick={() => this.handleClick(get(mention, 'id'))}
          {...(get(mention, 'is_clicked') && { className: 'is-clicked' })}
        >
          <div>
            <img
              className="profile"
              src={get(mention, 'picture_url', 'https://picsum.photos/200')}
              alt=""
              width="50"
            />
            {!get(mention, 'is_clicked') && <span className="circle margin-top-10"></span>}
          </div>
          <div className="gutter-left-20">
            <p className="text-color-primary">{get(mention, 'source_name')}</p>
            <h2 className="title margin-top-10">{get(mention, 'title')}</h2>
            <p className="text-color-primary margin-top-10">{get(mention, 'description_short')}</p>
          </div>
          <p className="date">{moment(get(mention, 'published_at')).format('DD MMM')}</p>
        </button>
      ));
    }

    return <img src={loader} width="120" className="loader" alt="" />;
  }
}

const mapStateToProps = state => ({
  initialized: state.mentions.initialized,
  mentions: state.mentions.mentions,
});

const mapDispatchToProps = dispatch => ({
  getItemClicked: id => dispatch(getItemClicked(id)),
  getMentions: () => dispatch(fetchMentions()),
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(App);
