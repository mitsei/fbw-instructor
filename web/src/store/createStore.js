import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
import persistState from 'redux-localstorage'
import _ from 'lodash'

import makeRootReducer from '../reducers/'
import { updateLocation } from '../reducers/location'

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (__DEV__) {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  // copy state to local storage
  enhancers.push(persistState(null, {
    slicer: paths => state => {
      let subset = {
        bank: state.bank,
        subject: state.subject,
        result: _.omit(state.result, ['phaseIResults', 'phaseIIResults']),
        editMission: _.assign({}, state.editMission, {
          newMission: null,
          // i hate that this is here, but let's experiment to see if this fixes things
          spawnDate: {}
        }),
        mapping: state.mapping,
        mission: _.assign({}, state.mission, {
          isGetMissionsInProgress: false
        }),
        login: state.login,
        location: state.location,
        view: state.view
      };

      // console.log('storing state:', subset)

      return subset;
    }
  }))

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store))

  if (module.hot) {
    module.hot.accept('../reducers/', () => {
      const reducers = require('../reducers/').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}
