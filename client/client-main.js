import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import React from 'react'

import App from '/imports/client/App'

// TODO: explode the original into a react app
import original from '/imports/client/App/original'

const onStartup = () => {
  const root = document.querySelector('.root')
  render(<App />, root)
  window.appState = original()
}

Meteor.startup(onStartup)
