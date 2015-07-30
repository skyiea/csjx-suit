React   = require 'react'
$       = require 'jquery'
App     = require './body/Body'

$ () -> React.render <App />, document.getElementById 'app-container'