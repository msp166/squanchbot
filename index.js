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
}).filter((item) => {
  if (item.extension == '.wav' || item.extension == '.ogg' || item.extension == '.mp3') {
    return true;
  } else {
    return false;
  }
});

console.log(squanches);

squanches.forEach(function(item, index, array) {
  var json_file = item.filename.replace(item.extension, '.json');
  try {
    fs.accessSync('res/' + json_file, fs.constants.R_OK);
    var data = JSON.parse(fs.readFileSync('res/' + json_file, 'utf8'));
    item = Object.assign(item, data);
    array[index] = item;
  } catch (error) {
    //do nothing, this is fine. This is just a very anti-synchronous implementation of checking file access. 
    //We are using synchronous here because this is loading initial config state
  }
});

console.log(squanches);


var global_audio_connection = null;

var Discord = require('discord.js');

var bot = new Discord.Client();

bot.on('message', function(message) {

  if (message.channel.name === undefined) {
    if (message.attachments.length > 0 && message.author.username != bot.user.username) {
      var filename = message.attachments[0].filename;
      filename = filename.replace(/ /g, '_');
      var url = message.attachments[0].url;
      var extension = filename.substring(filename.lastIndexOf('.'));
      var command = '!' + filename.replace(extension, '').toLowerCase();
      
      var tags = message.content;
      if (tags) {
        if (tags.indexOf(',') != -1) {
          tags = tags.split(',');
          tags = tags.map((item) => {
            return item.trim();
          });
        } else {
          tags = [tags];
        }
      } else {
        tags = [];
      }

      if (extension === '.ogg' || extension === '.wav' || extension === '.mp3') {
        if (squanches.map((item) => { return item.filename; }).indexOf(filename) == -1) {
          var file = fs.createWriteStream('res/' + filename);
          https.get(url, (res) => {
            res.pipe(file);
            fs.writeFile('res/' + filename.replace(extension, '.json'), JSON.stringify({tags: tags}), 'utf8', (error) => {
              if (error) {
                bot.reply(message, 'Had some kind of error saving your tags: ' + JSON.stringify(error));
              }
            });
            squanches.push({filename: filename, extension: extension, command: command, tags: tags});
            console.log(squanches);
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
        var extension = squanches[commands.indexOf(command_to_delete)].extension;
        var json_file = audio_file.replace(extension, '.json');

        var archive_time = (new Date()).getTime();

        fs.rename('res/' + audio_file, 'archive/' + audio_file + '_' + archive_time, (error) => {
          if (error) {
            bot.reply(message, 'Okay mothersquancher, I tried to do that but there was an error: ' + error);
          } else {
            squanches.splice(commands.indexOf(command_to_delete), 1);
            bot.reply(message, 'I deleted ' + audio_file + ' for you, you old squanchbag.');

            fs.rename('res/' + json_file, 'archive/' + json_file + '_' + archive_time, (error) => {
              if (error) {
                bot.reply(message, 'Okay mothersquancher, I tried to do that but there was an error getting rid of the tags: ' + error);
              } 
            });

          }
        });
      } else {
        bot.reply(message, 'Listen here squanchacho, I don\'t even know what file you\'re talking about.');
      }
    } else if (message.content.startsWith('!download') || message.content.startsWith('download')) {
      var command_to_download = '!' + message.content.replace(/!download /, '').replace(/download /, '');
      var commands = squanches.map((item) => {
        return item.command.toLowerCase();
      });
      if (commands.indexOf(command_to_download) != -1) {
        var audio_file = squanches[commands.indexOf(command_to_download)].filename;

        bot.sendFile(message.channel, 'res/' + audio_file, audio_file);

      } else {
        bot.reply(message, 'You can go download a sack of squanch, I don\' have any command or file like that.');
      }
    } else if (message.content.startsWith('!command') || message.content.startsWith('command')) {
      var command_to_check = '!' + message.content.replace(/!command /, '').replace(/command /, '');
      var commands = squanches.map((item) => {
        return item.command.toLowerCase();
      });
      if (commands.indexOf(command_to_check) != -1) {
        bot.reply(message, JSON.stringify(squanches[commands.indexOf(command_to_check)]));
      } else {
        bot.reply(message, 'I don\'t know what command you\'re asking about.');
      }
    } else if (message.content.startsWith('!tag list') || message.content.startsWith('tag list')) {
      var command_to_check = '!' + message.content.replace(/!tag list /, '').replace(/tag list /, '');
      var commands = squanches.map((item) => {
        return item.command.toLowerCase();
      });
      if (commands.indexOf(command_to_check) != -1) {
        var tags = squanches[commands.indexOf(command_to_check)].tags;
        if (tags.length == 0) {
          bot.reply(message, 'No tags on this one yet');
        } else {
          var reply = 'Tags for ' + squanches[commands.indexOf(command_to_check)].command + ":";
          for (var i = 0; i < tags.length; i++) {
            reply += "\r\n" + tags[i];
          }
          bot.reply(message, reply);
        }
      } else {
        bot.reply(message, 'I don\'t know what command you\'re asking about.');
      }
    }  else if (message.content.startsWith('!tag add') || message.content.startsWith('tag add')) {
      var command_and_tag = '!' + message.content.replace(/!tag add /, '').replace(/tag add /, '');
      command_and_tag = command_and_tag.split(' ');
      var command_to_check = command_and_tag.shift();
      var tag_to_add = command_and_tag.join(' ');

      if (command_to_check == null || command_to_check == '' || command_to_check == undefined) {
        bot.reply(message, 'I\'m not sure what command you what to squanch the tags on.');
        return false;
      }

      if (tag_to_add == null || tag_to_add == '' || tag_to_add == ' ' || tag_to_add == undefined) {
        bot.reply(message, 'You didn\'t give me any tags to add, you sad squanch, you.');
        return false;
      }

      var commands = squanches.map((item) => {
        return item.command.toLowerCase();
      });
      if (commands.indexOf(command_to_check) != -1) {
        var tags = squanches[commands.indexOf(command_to_check)].tags;

        if (tags == null) {
          tags = [];
        }

        if (tags.indexOf(tag_to_add) == -1) {
          tags.push(tag_to_add);
          squanches[commands.indexOf(command_to_check)].tags = tags;
          var filename = squanches[commands.indexOf(command_to_check)].filename;
          var extension = squanches[commands.indexOf(command_to_check)].extension;
          fs.writeFile('res/' + filename.replace(extension, '.json'), JSON.stringify({tags: tags}), 'utf8', (error) => {
            if (error) {
              bot.reply(message, 'Had some kind of error saving your tags: ' + JSON.stringify(error));
            }
          });
          bot.reply(message, JSON.stringify(squanches[commands.indexOf(command_to_check)]));
        } else {
          bot.reply(message, 'The command already has that squanch loving tag!');
        }
        
      } else {
        bot.reply(message, 'I don\'t know what command you\'re asking about, squanchcake.');
      }
    } else if (message.content.startsWith('!tag remove') || message.content.startsWith('tag remove')) {
      var command_and_tag = '!' + message.content.replace(/!tag remove /, '').replace(/tag remove /, '');
      command_and_tag = command_and_tag.split(' ');
      var command_to_check = command_and_tag.shift();
      var tag_to_remove = command_and_tag.join(' ');

      if (command_to_check == null || command_to_check == '' || command_to_check == undefined) {
        bot.reply(message, 'I\'m not sure what command you what to squanch the tags on.');
        return false;
      }

      if (tag_to_remove == null || tag_to_remove == '' || tag_to_remove == ' ' || tag_to_remove == undefined) {
        bot.reply(message, 'You didn\'t give me any tags to remove, you sad squanch, you.');
        return false;
      }

      var commands = squanches.map((item) => {
        return item.command.toLowerCase();
      });
      if (commands.indexOf(command_to_check) != -1) {
        var tags = squanches[commands.indexOf(command_to_check)].tags;

        if (tags.indexOf(tag_to_remove) == -1) {
          bot.reply(message, 'The command doesn\'t have that squanching tag!');
        } else {
          tags.splice(tags.indexOf(tag_to_remove), 1);
          squanches[commands.indexOf(command_to_check)].tags = tags;
          var filename = squanches[commands.indexOf(command_to_check)].filename;
          var extension = squanches[commands.indexOf(command_to_check)].extension;
          fs.writeFile('res/' + filename.replace(extension, '.json'), JSON.stringify({tags: tags}), 'utf8', (error) => {
            if (error) {
              bot.reply(message, 'Had some kind of error saving your tags: ' + JSON.stringify(error));
            }
          });
          bot.reply(message, JSON.stringify(squanches[commands.indexOf(command_to_check)]));
        }
        
      } else {
        bot.reply(message, 'I don\'t know what command you\'re asking about, squanchcake.');
      }
    } else if (message.content.startsWith('!tags') || message.content.startsWith('tags')) {
      var all_tags = [];
      for (var i = 0; i < squanches.length; i++) {
        if (squanches[i].hasOwnProperty('tags')) {
          var tags = squanches[i].tags;
          for (var j = 0; j < tags.length; j++) {
            var tag = tags[j];
            if (all_tags.map((item) => { return item.tag; }).indexOf(tag) == -1) {
              all_tags.push({tag: tag, count: 1});
            } else {
              all_tags[all_tags.map((item) => { return item.tag; }).indexOf(tag)].count += 1;
            }
          }
        }
      }

      all_tags.sort((a, b) => {
        return a.count - b.count;
      });

      var reply = "Here are the top 25 tags in the squanch list:";
      for (var i = 0; i < all_tags.length && i < 24; i++) {
        reply += "\r\n#" + (i + 1) + " - " + all_tags[i].tag + " - count: " + all_tags[i].count;
      }

      bot.reply(message, reply);

    } else if (message.content.startsWith('!alltags') || message.content.startsWith('alltags')) {
      var all_tags = [];
      for (var i = 0; i < squanches.length; i++) {
        if (squanches[i].hasOwnProperty('tags')) {
          var tags = squanches[i].tags;
          for (var j = 0; j < tags.length; j++) {
            var tag = tags[j];
            if (all_tags.map((item) => { return item.tag; }).indexOf(tag) == -1) {
              all_tags.push({tag: tag, count: 1});
            } else {
              all_tags[all_tags.map((item) => { return item.tag; }).indexOf(tag)].count += 1;
            }
          }
        }
      }

      all_tags.sort((a, b) => {
        return a.tag - b.tag;
      });

      var reply = "Here are the top 25 tags in the squanch list:";
      for (var i = 0; i < all_tags.length && i < 24; i++) {
        reply += "\r\n" + all_tags[i].tag + " - count: " + all_tags[i].count;
      }

      bot.reply(message, reply);

    } else if (message.content.startsWith('!tag search') || message.content.startsWith('tag search')) {
      var params = message.content.split(' ');

      if (params.length <= 2) {
        bot.reply(message, 'You didn\'t give me a tag to squanch for');
      } else {
        params.splice(0, 2);
        var tag = params.join(' ');
        var filtered_commands = getCommandsByTag(tag);

        if (filtered_commands.length == 0) {
          bot.reply(message, 'I couldn\'t squanch anything for ' + tag);
        } else {
          filtered_commands = filtered_commands.map((item) => {
            return item.command;
          });

          filtered_commands.sort();

          var reply = 'If you wanna hear ' + tag + ', try squanching these:';
          for (var i = 0; i < filtered_commands.length; i++) {
            reply += "\r\n" + filtered_commands[i];
          }

          bot.reply(message, reply);
        }
      }
    } else if (message.author.username != bot.user.username) { //This should always be last
      bot.reply(message, 'I\'ve never even heard of that command.');
    }
  } else {

    var audio_command = message.content.toLowerCase();

    var commands = squanches.map((item) => {
      return item.command.toLowerCase();
    });

    if (commands.indexOf(audio_command) != -1) {
      var voice_channel = message.member.voiceChannel;

      var audio_file = squanches[commands.indexOf(audio_command)].filename;

      message.delete();

      voice_channel.join()
        .then(connection => {
          console.log('res/' + audio_file);
          global_audio_connection = connection;
          var dispatcher = connection.playFile('res/' + audio_file, {volume: 0.25});
          dispatcher.once('end', () => {
            connection.disconnect();
            global_audio_connection = null;
          });
        })
        .catch(console.error);
    }

    if (message.content === '!commands' || message.content === '!help') {
      message.channel.sendMessage(getCommands())
        .then(sent_message => {
          message.delete(10000);
          sent_message.delete(10000);
        })
        .catch(console.error);
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

              message.channel.sendMessage(return_string);

              for (var k = 0; k < images.length; k++) {
                message.channel.sendFile(images[k], uuid.v4()+'.jpg');
              }

            }

            if (result.length == 0) {
              message.reply('Wolfram can\'t squanch that');
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

      message.delete();

      request(image, {encoding: 'binary'}, function(error, response, body){
        if (error) {
          console.log(error);
          message.channel.sendMessage('I\'m sorry to have to tell you this, but the server you wanted me to go to is completely squanched');
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
              message.channel.sendMessage('I don\t know what you\'re trying to pull here buddy but that ain\'t no squanching image');
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
              message.channel.sendMessage('Sorry bud, I couldn\'t squanch that image');
              return 0;
            }

            // bot.sendMessage(message.channel, 'got the image: ' + image_file);
            // bot.sendFile(message.channel, image_file);

            im.identify(image_file, function(error, features){
              if (error) {
                console.log(error);
                message.channel.sendMessage('Uh, sorry pal. I\'m having a real squanchy time trying to put these images together');
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
                  message.channel.sendMessage('Uh, sorry pal. I\'m having a real squanchy time trying to put these images together');
                  return 0;
                }
                console.log('stdout: ' + stdout);

                im.convert([resize_image_file, '-background', 'None', '-rotate', rotation_angle, rotate_image_file], function(error, stdout){
                  if (error) {
                    console.log(error);
                    message.channel.sendMessage('Uh, sorry pal. I\'m having a real squanchy time trying to put these images together');
                    return 0;
                  }

                  im.convert([background_image, rotate_image_file, '-geometry', '+725+300', '-composite', composite_image_file], function(error, stdout){
                    if (error) {
                      console.log(error);
                      message.channel.sendMessage('Uh, sorry pal. I\'m having a real squanchy time trying to put these images together');
                      return 0;
                    }

                    im.convert([composite_image_file, foreground_image, '-composite', final_image_file], function(error, stdout){
                      if (error) {
                        console.log(error);
                        message.channel.sendMessage('Uh, sorry pal. I\'m having a real squanchy time trying to put these images together');
                        return 0;
                      }

                      message.channel.sendFile(final_image_file);
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
          message.channel.sendMessage('Sorry bud, I couldn\'t squanch that image');
        }

      });
    }

    if (message.content.startsWith('!tags')) {
      var all_tags = [];
      for (var i = 0; i < squanches.length; i++) {
        if (squanches[i].hasOwnProperty('tags')) {
          var tags = squanches[i].tags;
          for (var j = 0; j < tags.length; j++) {
            var tag = tags[j];
            if (all_tags.map((item) => { return item.tag; }).indexOf(tag) == -1) {
              all_tags.push({tag: tag, count: 1});
            } else {
              all_tags[all_tags.map((item) => { return item.tag; }).indexOf(tag)].count += 1;
            }
          }
        }
      }

      all_tags.sort((a, b) => {
        return a.count - b.count;
      });

      var reply = "Here are the top 25 tags in the squanch list:";
      for (var i = 0; i < all_tags.length && i < 24; i++) {
        reply += "\r\n#" + (i + 1) + " - " + all_tags[i].tag + " - count: " + all_tags[i].count;
      }

      message.channel.sendMessage(reply);
    }

    if (message.content.startsWith('!alltags')) {
      var all_tags = [];
      for (var i = 0; i < squanches.length; i++) {
        if (squanches[i].hasOwnProperty('tags')) {
          var tags = squanches[i].tags;
          for (var j = 0; j < tags.length; j++) {
            var tag = tags[j];
            if (all_tags.map((item) => { return item.tag; }).indexOf(tag) == -1) {
              all_tags.push({tag: tag, count: 1});
            } else {
              all_tags[all_tags.map((item) => { return item.tag; }).indexOf(tag)].count += 1;
            }
          }
        }
      }

      all_tags.sort((a, b) => {
        return a.tag - b.tag;
      });

      var reply = "Here are all the tags in the squanch list:";
      for (var i = 0; i < all_tags.length; i++) {
        reply += "\r\n" + all_tags[i].tag + " - count: " + all_tags[i].count;
      }

       message.channel.sendMessage(reply);

    }

    if (message.content.startsWith('!random')) {
      var params = message.content.split(' ');
      var voice_channel = message.member.voiceChannel;
      message.delete();

      if (params.length <= 1) {

        var audio_file = squanches[Math.floor(Math.random()*squanches.length)].filename;

        voice_channel.join()
        .then(connection => {
          console.log('res/' + audio_file);
          global_audio_connection = connection;
          var dispatcher = connection.playFile('res/' + audio_file, {volume: 0.25});
          dispatcher.once('end', () => {
            connection.disconnect();
            global_audio_connection = null;
          });
        })
        .catch(console.error);
      } else {
        var tag = params[1];
        var filtered_commands = getCommandsByTag(tag);

        if (filtered_commands.length == 0) {
        //   bot.sendMessage(message.channel, 'I can\'t randomly squanch anything for that particular tag, bub', {}, function(error, sent_message){
        //     setTimeout(function(){
        //       bot.deleteMessage(message);
        //       bot.deleteMessage(sent_message);
        //     }, 5000);
        //   });
          message.channel.sendMessage('I can\'t randomly squanch anything for that particular tag, bub')
            .then(sent_message => {
              message.delete(5000);
              sent_message.delete(5000);
            })
            .catch(console.error);
        } else {
          var audio_file = filtered_commands[Math.floor(Math.random()*filtered_commands.length)].filename;

          // bot.joinVoiceChannel(voice_channel, function(error, connection) {
          //   global_audio_connection = connection;
          //   console.log('res/' + audio_file);
          //   connection.playFile('res/' + audio_file, 0.25, function(error, intent){
          //     intent.on('end', function(){
          //       setTimeout(function(){
          //         connection.destroy();
          //         global_audio_connection = null;
          //       }, 1000);
          //     });
          //   });
          // });
          voice_channel.join()
          .then(connection => {
            console.log('res/' + audio_file);
            global_audio_connection = connection;
            var dispatcher = connection.playFile('res/' + audio_file, {volume: 0.25});
            dispatcher.once('end', () => {
              connection.disconnect();
              global_audio_connection = null;
            });
          })
          .catch(console.error);
        }
      }
    }

    if (message.content.startsWith('!tag search')) {
      var params = message.content.split(' ');

      if (params.length <= 2) {
        bot.sendMessage(message.channel, 'You didn\'t give me a tag to squanch for', {}, function(error, sent_message){
          setTimeout(function(){
            bot.deleteMessage(message);
            bot.deleteMessage(sent_message);
          }, 5000);
        });
      } else {
        params.splice(0, 2);
        var tag = params.join(' ');
        var filtered_commands = getCommandsByTag(tag);

        if (filtered_commands.length == 0) {
          bot.sendMessage(message.channel, 'I couldn\'t squanch anything for ' + tag, {}, function(error, sent_message){
            setTimeout(function(){
              bot.deleteMessage(message);
              bot.deleteMessage(sent_message);
            }, 5000);
          });
        } else {
          filtered_commands = filtered_commands.map((item) => {
            return item.command;
          });

          filtered_commands.sort();

          var reply = 'If you wanna hear ' + tag + ', try squanching these:';
          for (var i = 0; i < filtered_commands.length; i++) {
            reply += "\r\n" + filtered_commands[i];
          }

          bot.sendMessage(message.channel, reply, {}, function(error, sent_message){
            setTimeout(function(){
              bot.deleteMessage(message);
              bot.deleteMessage(sent_message);
            }, 5000);
          });
        }
      }
    }

  //end of channel commands
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

var getCommandsByTag = function(tag) {
  return squanches.filter((item) => {
    if (item.hasOwnProperty('tags')) {
      // return item.tags.map((inner_item) => {
      //   return inner_item.replace(/ /g, '').toLowerCase();
      // }).includes(tag.toLowerCase());
      for (var i = 0; i < item.tags.length; i++) {
        if (item.tags[i].replace(/ /g, '').toLowerCase() == tag.toLowerCase()) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  });
};

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
    bot.login(config.get('bot.token'), (error, token) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Squanchbot reconnected');
      }
    });
  }
});

if (config.get('bot.token') != null) {
  bot.login(config.get('bot.token'));
}

bot.on('ready', () => {
  console.log("Squanchbot connected");
});

bot.on('error', e => {
  console.error(e);
});