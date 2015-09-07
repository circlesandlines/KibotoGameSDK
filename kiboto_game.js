function KibotoBotMessages() {
	// store responses in global state because
	// callback can't access anything in KibotoGame
	// object
	// NOTE: this should be a singleton but can't really enforce it!

	this.kibotoResponses = [];
	this.messagesToProcess = false;

	this.get = function() {
		return this.kibotoResponses;
	};

	this.push = function(message) {
		this.kibotoResponses.push(message);
		this.messagesToProcess = true;
	}

	this.clear = function() {
		this.kibotoResponses = [];
		this.messagesToProcess = false;
	};
}

function KibotoGame(hostname, port, game_id, session_id, player_id) {
	this.hostname = hostname;
	this.port = port;
	this.game_id = game_id;
	this.session_id = session_id;
	this.player_id = player_id;

	// a session and player id should already exist, so might as well use them
	// the game id can be made up. either the name of the game, or a guid
	this.session_key = game_id + ':' + session_id + ':' + player_id;
	this.responses = [];

	this.session_connected = false;
	this.session_error = false;

	this.init_session = function() {
		// initializes the session
		url = this.host + ':' + this.port + '/session?' + \
				'game_id=' + game_id + '&' + \
				'session_id=' + session_id + '&' + \
				'player_id=' + player_id;

		var xhr = new XMLHttpRequest();
		xhr.open("GET", "/event", true);
		xhr.onload = function (err) {
			if (xhr.readyState == 4) {
				if (xhr.status != 200) {
					console.log ("error: couldn't start session:");
					console.log ("status: " + xhr.status.toString());
					onsole.log ("message: " + xhr.statusText);
					this.session_connected = false;
					this.session_error = true;
				} else {
					this.session_connected = true;
					this.session_error = false;
				}
			}
		}
	};

	this.event = function(data, callback, errorCallback, timeout) {
		// send an event to kiboto server with
		// what ever data the game developer wants.
		// should represent state changes for the current player
		// as well as other players and the environment.
		// the callback should be a function that the game
		// specifies. they can do whatever they want in there

		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/event", true);

		// handle success
		if (callback == null) {
			// error. how to notify?
		} else {
			// wrap the function to notify the bot message
			// object that there are messages to process
			xhr.onload = function (err) {
				// assume they handle their own message state and
				// message queue. only pass them what they need
				if (xhr.readyState == 4) {
					callback(xhr.status, xhr.responseText, xhr.statusText);
				}
			};
		}

		// handle errors
		if (errorCallback == null) {
			// error. how to notify?
		} else {
			xhr.onerror = function (err) {
				errorCallback(xhr.status, xhr.statusText);
			};
		}

		// handle timeouts?

		xhr.timeout = timeoutMS;
		xhr.send(data);
 	};
}

