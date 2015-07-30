http        = require 'http'
dispatcher  = require 'httpdispatcher'
fs          = require 'fs'

PORT    = 1234
server  = http.createServer()

returnFile = (file_path, content_type, response) ->
    fs.exists file_path, (exists) ->
        if exists
            fs.readFile file_path, (err, file) ->
                response.writeHead 200, 'Content-Type': content_type
                response.end file
        else
            response.writeHead 500, 'Content-Type': 'text/plain'
            response.end '500 Interval error'

server
    .on 'request', (request, response) -> dispatcher.dispatch(request, response)
    .listen PORT, ->
        console.log 'Server listening on: http://localhost:%s', PORT

dispatcher.setStaticDirname __dirname
dispatcher.setStatic 'public'

dispatcher.onGet '/', (request, response) ->
    returnFile 'index.html', 'text/html', response

dispatcher.onGet /^\/(?!api\/.+).+/, (request, response) ->
    response.writeHead 404, 'Content-Type': 'text/plain'
    response.end '404 Not found'