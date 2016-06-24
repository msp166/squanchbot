var fs = require('fs');
var http = require('http');
var https = require('https');
var uuid = require('node-uuid');
var request = require('request');
var im = require('imagemagick');
var config = require('config');
var urban = require('urban');
var wolfram = null;

if (config.get('wolfram.enabled') == true) {
  wolfram = require('wolfram-alpha').createClient(config.get('wolfram.key'));
}

var squanches = fs.readdirSync('res');

squanches = squanches.map((item) => {
  var filename = item;
  var extension = filename.substring(filename.lastIndexOf('.'));
  var command = '!' + filename.replace(extension, '').toLowerCase();

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
      var command = '!' + filename.replace(extension, '').toLowerCase();
      if (extension === '.ogg' || extension === '.wav' || extension === '.mp3') {
        if (squanches.map((item) => { return item.filename; }).indexOf(filename) == -1) {
          var file = fs.createWriteStream('res/' + filename);
          https.get(url, (res) => {
            res.pipe(file);
            squanches.push({filename: filename, extension: extension, command: command});
            bot.reply(message, 'Added ' + command);
          }).on('error', (e) => {
            bot.reply(message, e);
          });
        } else {
          bot.reply(message, 'Okay, well, I\'ve already got a file with that name so go squanch yourself!');
        }
      } else {
        bot.reply(message, 'Come on dude, that\'s not even an audio squanch. I can only do .ogg, .mp3 or .wav');
      }
    } else if (message.content === '!commands' || message.content == 'commands' || message.content === '!help' || message.content === 'help') {
      bot.reply(message, getCommands());
    } else if (message.content.startsWith('!delete ') || message.content.startsWith('delete ')) {
      var command_to_delete = '!' + message.content.replace(/!delete /, '').replace(/delete /, '');
      var commands = squanches.map((item) => {
        return item.command.toLowerCase();
      });

      if (commands.indexOf(command_to_delete) != -1) {
        var audio_file = squanches[commands.indexOf(command_to_delete)].filename;

        fs.rename('res/' + audio_file, 'archive/' + audio_file + '_' + (new Date()).getTime(), (error) => {
          if (error) {
            bot.reply(message, 'Okay mothersquancher, I tried to do that but there was an error: ' + error);
          } else {
            squanches.splice(commands.indexOf(command_to_delete), 1);
            bot.reply(message, 'I deleted ' + audio_file + ' for you, you old squanchbag.');
          }
        });
      } else {
        bot.reply(message, 'Listen here squanchacho, I don\'t even know what file you\'re talking about.');
      }
    }
  } else {

    var audio_command = message.content.toLowerCase();

    var commands = squanches.map((item) => {
      return item.command.toLowerCase();
    });

    if (commands.indexOf(audio_command) != -1) {
      var voice_channel = message.author.voiceChannel;

      var audio_file = squanches[commands.indexOf(audio_command)].filename;

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

    if (message.content === '!commands' || message.content === '!help') {
      bot.sendMessage(message.channel, getCommands(), {}, function(error, sent_message){
        setTimeout(function(){
          bot.deleteMessage(message);
          bot.deleteMessage(sent_message);
        }, 10000);
      });
    }

    if (message.content.startsWith('!wolfram ')) {
      if (config.get('wolfram.enabled') == true) {
        try {
          var query = message.content.replace(/!wolfram /, '');
          wolfram.query(query, function(error, result){
            if (error) throw error;
            console.log(result);
            var return_string = "";
            for (var i = 0; i < result.length; i++) {
              var images = [];
              var sounds = [];
              return_string = '\n__**' + result[i].title + '**__\n';
              for (var j = 0; j < result[i].subpods.length; j++) {
                if ('text' in result[i].subpods[j]) {
                  return_string += result[i].subpods[j].text + '\n';
                }
                if ('image' in result[i].subpods[j]) {
                  images.push(result[i].subpods[j].image);
                }
                if ('sound' in result[i].subpods[j]) {
                  sounds.push(result[i].subpods[j].sound);
                }
                if ('mathml' in result[i].subpods[j]) {
                  return_string += '`' + result[i].subpods[j].mathml + '`\n';
                }
              }

              bot.sendMessage(message.channel, return_string);
              // console.log(return_string);

              for (var k = 0; k < images.length; k++) {
                bot.sendFile(message.channel, images[k], uuid.v4()+'.jpg');
              }

              // var getImage = function(image_list) {
              //   var image = 'tmp/' + uuid.v4() + '.gif';
              //   var file = fs.createWriteStream(image_list[0]);
              //   console.log(image_list[0]);
              //   http.get(image_list[0], (res) => {
              //     res.pipe(file);
              //     image_list.shift();
              //     console.log('got image');
              //     getImage(image_list);
              //     // bot.sendFile(message.channel, image, function(error){
              //     //   fs.unlink(image, (error) => {
              //     //     if (error) throw error;
              //     //   });
              //     // });
              //   }).on('error', (error) => {
              //     throw error;
              //   });
              // };

              // if (images.length > 0) {
              //   getImage(images);
              // }
              
              // for (var k = 0; k < images.length; k++) {
              //   var image = 'tmp/' + uuid.v4() + '.gif';
              //   var file = fs.createWriteStream(image);
              //   console.log(images[k]);
              //   http.get(images[k], (res) => {
              //     res.pipe(file);
              //     // bot.sendFile(message.channel, image, function(error){
              //     //   fs.unlink(image, (error) => {
              //     //     if (error) throw error;
              //     //   });
              //     // });
              //   }).on('error', (error) => {
              //     throw error;
              //   });
              // }
            }

            if (result.length == 0) {
              bot.reply(message, 'Wolfram can\'t squanch that');
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (message.content.startsWith('!photograph ')) {
      var image = message.content.replace(/!photograph /, '');

      var image_uuid = uuid.v4();

      bot.deleteMessage(message);

      request(image, {encoding: 'binary'}, function(error, response, body){
        if (error) {
          console.log(error);
          bot.sendMessage(message.channel, 'I\'m sorry to have to tell you this, but the server you wanted me to go to is completely squanched');
          return 0;
        }

        console.log(response.headers);
        console.log(response.statusCode);
        console.log(response.statusMessage);

        if (response.statusCode === 200) {
          var image_file = 'tmp/' + image_uuid;
          var resize_image_file = image_file + '_resize';
          var rotate_image_file = image_file + '_rotate';
          var composite_image_file = image_file + '_composite';
          var final_image_file = image_file + '_final';
          var extension = "";

          switch (response.headers['content-type']) {
            case 'image/gif':
              extension = ".gif";
              break;
            case 'image/jpeg':
              extension = ".jpg";
              break;
            case 'image/png':
              extension = ".png";
              break;
            default:
              bot.sendMessage(message.channel, 'I don\t know what you\'re trying to pull here buddy but that ain\'t no squanching image');
              return false;
              break;
          }

          image_file += extension;
          resize_image_file += '.png';
          rotate_image_file += '.png';
          composite_image_file += '.png';
          final_image_file += '.png';

          fs.writeFile(image_file, body, 'binary', function(error){
            if (error) {
              console.log(error);
              bot.sendMessage(message.channel, 'Sorry bud, I couldn\'t squanch that image');
              return 0;
            }

            // bot.sendMessage(message.channel, 'got the image: ' + image_file);
            // bot.sendFile(message.channel, image_file);

            im.identify(image_file, function(error, features){
              if (error) {
                console.log(error);
                bot.sendMessage(message.channel, 'Uh, sorry pal. I\'m having a real squanchy time trying to put these images together');
                return 0;
              }
              console.log(features);

              var target_width = 355;
              var target_height = 252;
              var rotation_angle = -14.33;
              var background_image = 'lookatthisphotograph_base.png';
              var foreground_image = 'lookatthisphotograph_over.png';

              var image_width = features.width;
              var image_height = features.height;

              var after_resize = function(error, stdout) {
                if (error) {
                  console.log(error);
                  bot.sendMessage(message.channel, 'Uh, sorry pal. I\'m having a real squanchy time trying to put these images together');
                  return 0;
                }
                console.log('stdout: ' + stdout);
                // bot.sendFile(message.channel, resize_image_file);

                im.convert([resize_image_file, '-background', 'None', '-rotate', rotation_angle, rotate_image_file], function(error, stdout){
                  if (error) {
                    console.log(error);
                    bot.sendMessage(message.channel, 'Uh, sorry pal. I\'m having a real squanchy time trying to put these images together');
                    return 0;
                  }

                  // bot.sendFile(message.channel, rotate_image_file);

                  im.convert([background_image, rotate_image_file, '-geometry', '+725+300', '-composite', composite_image_file], function(error, stdout){
                    if (error) {
                      console.log(error);
                      bot.sendMessage(message.channel, 'Uh, sorry pal. I\'m having a real squanchy time trying to put these images together');
                      return 0;
                    }

                    // bot.sendFile(message.channel, composite_image_file);

                    im.convert([composite_image_file, foreground_image, '-composite', final_image_file], function(error, stdout){
                      if (error) {
                        console.log(error);
                        bot.sendMessage(message.channel, 'Uh, sorry pal. I\'m having a real squanchy time trying to put these images together');
                        return 0;
                      }

                      bot.sendFile(message.channel, final_image_file);
                    });

                  });

                });

              };

              if ((target_width / image_width) >= (target_height / image_height)) {
                im.convert([image_file, '-resize', target_width + 'x', '-gravity', 'center', '-crop', target_width + 'x' + target_height + '+0+0', '+repage', resize_image_file], after_resize);
              } else {
                im.convert([image_file, '-resize', 'x' + target_height, '-gravity', 'center', '-crop', target_width + 'x' + target_height + '+0+0', '+repage', resize_image_file], after_resize);
              }
            });

          });

        } else {
          bot.sendMessage(message.channel, 'Sorry bud, I couldn\'t squanch that image');
        }

      });

      // request
      //   .get(image)
      //   .on('response', (response) => {
      //     console.log(response.headers);
      //     console.log(response.statusCode);
      //     console.log(response.statusMessage);

      //     if (response.statusCode === 200) {
      //       var image_file = 'tmp/' + image_uuid;

      //       switch (response.headers['content-type']) {
      //         case 'image/gif':
      //           image_file += '.gif';
      //           break;
      //         case 'image/jpeg':
      //           image_file += '.jpg';
      //           break;
      //         case 'image/png':
      //           image_file += '.png';
      //           break;
      //         default:
      //           bot.sendMessage(message.channel, 'I don\t know what you\'re trying to pull here buddy but that ain\'t no squanching image');
      //           return false;
      //           break;
      //       }

      //       var ws = fs.createWriteStream(image_file);

      //       response.pipe(ws, function(error){
      //         if (error) console.log(error);
      //         bot.sendMessage(message.channel, 'got the image: ' + image_file);

      //         im.identify(image_file, function(error, features){
      //           if (error) console.log(error);
      //           console.log(features);

      //           // var target_width = 355;
      //           // var target_height = 252;
      //           // var quality = 80;
      //           // var rotation_angle = -14.33;
      //           // var background_image = 'lookatthisphotograph_base.png';
      //           // var foreground_image = 'lookatthisphotograph_over.png';

      //           // im.convert([image_file, '-resize', target_width + 'x' + target_height, '-gravity', 'center', '-crop', target_width + 'x' + target_height + '0+0', '+repage', image_file + '_resize'], function(error, stdout){
      //           //   if (error) console.log(error);
      //           //   console.log('stdout: ' + stdout);
      //           //   bot.sendFile(message.channel, image_file + '_resize');
      //           // });


      //         });
      //       });

      //     } else {
      //       bot.sendMessage(message.channel, 'Sorry bud, I couldn\'t squanch that image');
      //     }
      //   })
      //   .on('error', (error) => {
      //     console.log(error);
      //     bot.sendMessage(message.channel, 'I\'m sorry to have to tell you this, but the server you wanted me to go to is completely squanched');
      //   });
    }

  }

  if (message.content === 'ping') {
    bot.sendMessage(message.channel, "Oh what, like I'm supposed to squanch around waiting to say 'pong' for you?");
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

  if (message.content.startsWith('!ud ')) {
      var query = message.content.replace(/!ud /, '');
      var results = urban(query);

      var chunks = [];

      results.first(function(json){
        console.log(json);
        chunks.push('__**' + query + '**__\r\n');
        var definition = json.definition;
        if (definition.length <= 2000) {
          chunks.push(definition);
        } else {
          while (definition.length >= 2000) {
            chunks.push(definition.slice(0, 2000 - 1));
            definition = definition.slice(2000 - 1);
          }
        }
        
        if (json.example.length > 0) {
          chunks.push('Example: *' + json.example + '*');
        }

        var sendChunk = function(send_chunks) {
          bot.sendMessage(message.channel, send_chunks[0], function(error){
            if (error) {
              console.log(error);
              return 0;
            }

            send_chunks.shift();
            if (send_chunks.length > 0) {
              sendChunk(send_chunks);
            }

          });
        };

        if (chunks.length > 0) {
          sendChunk(chunks);
        }

      });
  }
});

var getCommands = function() {
  var squanch_commands = squanches.map((item) => {
      return item.command.toLowerCase();
    });

    squanch_commands.sort();

    return squanch_commands;
};

bot.on('ready', function() {
  console.log('Squanchbot online');
});

bot.on('disconnected', function(){
  console.log('Squanchbot reconnecting...');
  if (config.get('bot.token') != null) {
    bot.loginWithToken(config.get('bot.token'), (error, token) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Squanchbot reconnected');
      }
    });
  }
});

if (config.get('bot.token') != null) {
  bot.loginWithToken(config.get('bot.token'), (error, token) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Squanchbot connected');
    }
  });
}
