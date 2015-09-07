# KibotoGameSDK

Connect your game to a Kiboto server and allow AI competitions without difficult hacks

## Integration

You must embed this into your game client for the easiest approach
Let the player choose whether or not to use AI controls
If they do, initialize the context and start sending events
when the game client receives them from the game server

Either use it with the supplied bot message queue,
or use your own.

Make sure to have a message queue ready to be able to
extract the messages out of the callback context

## Javascript SDK Usage Example

```javascript
// import from kiboto_game.js

// initialize the message and game context
// kiboto supplies a message queue, but its optional
// you can use your own!
var botMessages = new KibotoBotMessages();
var game = new KibotoGame(hostname, port, 123, 000, "bob");

// register your session with the kiboto server before
// starting to send events
game.init_session(function(httpCode, statusMessage) {
		// on success
	},
	function (httpCode, statusMessage) {
		// on error
	});

// display loading screen in the mean time

//...

// somewhere in the game loop:

// process previous loop's messages
if (botMessages.messagesToProcess) {
	YourGameLogic.process(botMessages.get());
	botMessages.clear();
}

// an event happens, fire off to kiboto to notify the appropriate bot
game.event({...}, function (httpcode, text, statustext) {

		// you can use the kiboto message queue,
		// or spin your own
		// or modify game state right here (although
		// I advise using a message queue of some kind)

		if (httpcode == 200)
			botMessages.push(text);
		else
			botMessages.push(statustext);
	},
	function (errorcode, errormessage) {
		//...
	}, 5000);
```
