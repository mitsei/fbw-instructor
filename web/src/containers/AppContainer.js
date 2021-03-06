import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'

import {isLoggedIn} from 'adaptive-common/selectors'

require('../styles/foundation.min.css');


class AppContainer extends Component {
  static propTypes = {
    routes : PropTypes.object.isRequired,
    store  : PropTypes.object.isRequired
  }

  componentDidMount() {
    const store = this.props.store;
    const state = store.getState();      // because AppContainer is the top-level parent

    // console.log('state in AppContainer', state)
    if (window.location.pathname.indexOf('guide') > -1) {

    } else if (window.location.pathname.indexOf('d2l-callback') === -1) {
      if (!isLoggedIn(state)) browserHistory.push('/login');

    } else {
      let unsub = store.subscribe(() => {
        let state = store.getState();
        console.log('state changed', state);
        unsub();
        if (isLoggedIn(state))  browserHistory.push('/')
      })
    }
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={browserHistory} children={routes} />
        </div>
      </Provider>
    )
  }
}

export default AppContainer
