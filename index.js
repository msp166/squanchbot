var fs = require('fs');
var https = require('https');

var squanches = fs.readdirSync('res');

squanches = squanches.map((item) => {
  var filename = item;
  var extension = filename.substring(filename.lastIndexOf('.'));
  var command = '!' + filename.replace(extension, '');

  return {filename: filename, extension: extension, command: command};
});


var global_audio_connection = null;

var Discord = require('discord.js');

var bot = new Discord.Client();

bot.on('message', function(message) {

  if (message.channel.name === undefined) {
    if (message.attachments.length > 0) {
      var filename = message.attachments[0].filename;
      var url = message.attachments[0].url;
      var extension = filename.substring(filename.lastIndexOf('.'));
      var command = '!' + filename.replace(extension, '');
      if (extension === '.ogg' || extension === '.wav' || extension === '.mp3') {
        if (squanches.map((item) => { return item.filename; }).indexOf(filename) == -1) {
          var file = fs.createWriteStream('res/' + filename);
          https.get(url, (res) => {
            res.pipe(file);
            squanches.push({filename: filename, extension: extension, command: command});
            bot.reply(message, 'Added ' + command);
            console.log('squanches', squanches);
          }).on('error', (e) => {
            bot.reply(message, e);
          });
        } else {
          bot.reply(message, 'Okay, well, I\'ve already got a file with that name so go squanch yourself!');
        }
      } else {
        bot.reply(message, 'Come on dude, that\'s not even an audio file.');
      }
    }
  } else {

    var commands = squanches.map((item) => {
      return item.command;
    });

    if (commands.indexOf(message.content) != -1) {
      var voice_channel = message.author.voiceChannel;

      var audio_file = squanches[commands.indexOf(message.content)].filename;

      bot.deleteMessage(message);

      bot.joinVoiceChannel(voice_channel, function(error, connection) {
        global_audio_connection = connection;
        console.log('res/' + audio_file);
        connection.playFile('res/' + audio_file, 0.25, function(error, intent){
          intent.on('end', function(){
            setTimeout(function(){
              connection.destroy();
              global_audio_connection = null;
            }, 1000);
          });
        });
      });
    }
  }

  if (message.content === '!commands') {
    var squanch_commands = squanches.map((item) => {
      return item.command;
    });

    squanch_commands.sort();

    console.log(squanch_commands);
    bot.sendMessage(message.channel, squanch_commands, {}, function(error, sent_message){
      setTimeout(function(){
        bot.deleteMessage(message);
        bot.deleteMessage(sent_message);
      }, 10000);
    });
  }

  if (message.content === 'ping') {
    bot.sendMessage(message.channel, "Oh what, like I'm supposed to sit here waiting to say 'pong' for you?");
  }

  if (message.content === '!stop') {
    if (global_audio_connection != null) {
      global_audio_connection.stopPlaying();
    }
  }

  if (message.content === '!rule34') {
    bot.sendFile(message.channel, 'rule34.jpg', function(error, this_message){
      setTimeout(function(){
        bot.deleteMessage(this_message);
      }, 10000);
    });
  }
});

bot.on('ready', function() {
  console.log('Squanchbot online');
});

bot.loginWithToken('MTkyMDMzMTQxMTA2NDA5NDcy.CkDAXw.Ls7Wiy3NcsD4O6kx3ISXZ1r1p6g');
