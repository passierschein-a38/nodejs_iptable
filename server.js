var WebSocketServer = require('websocket').server;
var http = require('http');
var port = process.env.PORT || 5000

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});
server.listen(port, function() { });

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

var ip_table = new Map();

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
	
        if (message.type === 'utf8') {
            
			try{			
				var cmd = JSON.parse( message.utf8Data );				
				console.log( cmd );
				
				var resp = new Object();
				
				switch( cmd.cmd ){
				
					case 'show':				
						console.log( 'show: '  + cmd );
						ip_table.set( cmd.id, cmd.ip );									
						resp.cmd = 'show-resp';
						resp.msg = 'ok';
						break;
						
					case 'watch':
					
						if( ip_table.has( cmd.id ) ){						
							resp.cmd = 'watch-resp';
							resp.ip = ip_table.get( cmd.id ); 
						}else{
							resp.cmd = 'error';
							resp.msg = 'unknown id: ' + cmd.id;
						}
					
						break;
					default:					
						resp.cmd = 'error';
						resp.msg = 'unknown command: ' + cmd.cmd;
						break;								
				}
				
				console.log( resp );
				connection.send( JSON.stringify( resp ) );								
				
			}catch( e ){			
				var resp = new Object();
				resp.cmd = 'error';
				resp.msg = e.message;	
				resp.log( resp );				
				connection.send( JSON.stringify( resp ) );		
			}							
        }
    });

    connection.on('close', function(connection) {
        // close user connection
    });
});