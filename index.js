//(function() {
//    var childProcess = require("child_process");
//    var oldSpawn = childProcess.spawn;
//    function mySpawn() {
//        console.log('spawn called');
//        console.log(arguments);
//        var result = oldSpawn.apply(this, arguments);
//        return result;
//    }
//    childProcess.spawn = mySpawn;
//})();

const fs = require('fs');

var squanches = fs.readdirSync('res');

console.log(squanches);

var global_audio_connection = null;

var Discord = require('discord.js');

var bot = new Discord.Client();

bot.on('message', function(message) {

  console.log(message);

  if (message.content === 'ping') {
    bot.sendMessage(message.channel, "Oh what, like I'm supposed to sit here waiting to say 'pong' for you?");
  }

  if (message.content === '!stop') {
    if (global_audio_connection != null) {
      global_audio_connection.stopPlaying();
    }
  }

  if (message.content === '!squanch') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('squanch.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

   if (message.content === '!duel') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('duel.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

   if (message.content === '!potg') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('potg.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!12pm') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('highnoon.mp3', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!10') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('thatsaten.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!schlami') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('schlami.ogg', 0.5, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!fleeb') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('fleeb.ogg', 0.5, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!purevanilla') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('Pure_Vanilla_3.ogg', 0.5, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

   if (message.content === '!plumbus') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('plumbus.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!nyan') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('nyan.mp3', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

   if (message.content === '!MANMODE') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('MAN_MODE.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!3ktesty') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('3ktesty.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!goteamventure') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('goteamventure.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!commander') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('Commander.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!mom') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('Mom.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!pizza') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('Pizza.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!cookiecat') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('Cookie_Cat.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!apocalypse') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('apocalypse.mp3', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!frenchfry') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('frenchfry.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!becool') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('Be_Cool.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!fireworks') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('fireworks.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!weed') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('Weed.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!hotdogs') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('hotdogs.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!scraps') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('scraps.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!english') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('English.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

   if (message.content === '!bitch') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('Bitch.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!shutup') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('shutup.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!whatwhat') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('whatwhat.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!spot') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('spot.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!lilbutler') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('lilbutler.mp3', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!theyregems') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('theyregems.mp3', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!noidea') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('noidea.mp3', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!giantwoman') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('giantwoman.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!propane') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('Propane.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!cornholio') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('Cornholio.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }

  if (message.content === '!playingswords') {
    //console.log(message.author);
    var voice_channel = message.author.voiceChannel;
    bot.joinVoiceChannel(voice_channel, function(error, connection) {
      global_audio_connection = connection;
      connection.playFile('Playing_Swords.ogg', 0.25, function(error, intent){
        intent.on('end', function(){
          connection.destroy();
          global_audio_connection = null;
        });
      });
    });
  }


  
});

bot.on('ready', function() {
  console.log('Squanchbot online');
});

bot.loginWithToken('MTkyMDMzMTQxMTA2NDA5NDcy.CkDAXw.Ls7Wiy3NcsD4O6kx3ISXZ1r1p6g');
