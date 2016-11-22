# squanchbot
*Just say what's in your squanch and people will understand* ~Rick Sanchez C-137

This is a bot for [discord](https://discordapp.com) written in javascript for the [Node.js](https://nodejs.org) platform. It was created for the use of a small personal server. Its main functionality is playing user defined audio clips in voice chat, but it also has a few other functions. 

By convention, most discord bots run as a single public entity that can be invited to servers. However, because this bot accepts file uploads from users and can end up storing quite a bit of data, I decided to not do that. If you would like to add this bot to your server you will need to generate a discord API key and run / host it for yourself.

### Feature List
+ User-created audio commands
+ Searchable tags for audio commands
+ Stop audio control
+ "Look at this photograph" meme generation
+ WolframAlpha queries
+ Urban Dictionary lookups

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Hosting the bot](#hosting-the-bot)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
  - [Configuring](#configuring)
    - [Bot API Token](#bot-api-token)
    - [Editing config/default.json](#editing-configdefaultjson)
- [Running the bot](#running-the-bot)
  - [Adding to a Discord server](#adding-to-a-discord-server)
- [Usage](#usage)
  - [Channel Commands](#channel-commands)
    - [!alltags](#alltags)
    - [!commands](#commands)
    - [!photograph](#photograph)
    - [!ping](#ping)
    - [!random \<optional tag\>](#random-%5Coptional-tag%5C)
    - [!rule34](#rule34)
    - [!stop](#stop)
    - [!tags](#tags)
    - [!tag search \<tag\>](#tag-search-%5Ctag%5C)
    - [!ud](#ud)
    - [!wolfram](#wolfram)
  - [PM Commands](#pm-commands)
    - [!command \<command name\>](#command-%5Ccommand-name%5C)
    - [!commands](#commands-1)
    - [!delete \<command name\>](#delete-%5Ccommand-name%5C)
    - [!download \<command name\>](#download-%5Ccommand-name%5C)
    - [!tag add \<command name\> \<tag\>](#tag-add-%5Ccommand-name%5C-%5Ctag%5C)
    - [!tag list \<command name\>](#tag-list-%5Ccommand-name%5C)
    - [!tag remove <command name> <tag>](#tag-remove-command-name-tag)
  - [User-created Audio Commands](#user-created-audio-commands)
- [WolframAlpha Integration](#wolframalpha-integration)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Hosting the bot

You will need to either download the source code from the gihtub repo, or use [git](https://git-scm.com/) to clone the project directly. You will also need [Node.js](https://nodejs.org) to run the project.

### Prerequisites

**Software:**
+ git 
+ Node.js (version 4.0 or above)
+ npm (comes with node)

**Accounts:**
+ Discord
+ WolframAlpha (optional)

### Installing

Either download the source code, or use git to clone the repo.

```
$> git clone https://github.com/muiro/squanchbot.git
```

Open the squanchbot directory and use npm to install all dependencies.
```
$> cd squanchbot
$> npm install
```

The bot is now installed and ready to be configured with your discord developer API token.

### Configuring

First you will need to acquire a bot API token, then add that token to squanchbot's configuration file.

#### Bot API Token

1. Log in to your discord account and go to the [Developers page](https://discordapp.com/developers/)
1. Open the **My Applications** link
1. Click on **New Application**
1. Fill in all required fields here. Add an icon if you want. When done press **Create Application**
1. Click **Create a Bot User**, then confirm the warning
1. Take note of the **Client/Application ID** and **Token** as you will need these for config

#### Editing config/default.json

Open config/default.json in your favorite text editor. Enter your **Token** like so:
```
{
	"bot": {
		"token": "MSsoesuffstMSNenuf08guau-oeu88hsoeu_fe8HDed"
	}
}
```

All of the required configuration is done, you can now run the bot

## Running the bot

Run the bot by issuing the following command in the squanchbot directory:
```
$> npm start
```

### Adding to a Discord server

A discord bot is added to a server by visiting a URL on your browser. Make sure you are first logged in and that you have permission to invite users to your server.

This is the URL you will need to visit. Replace the ```*******************``` with your **Client/Application ID** created above.
```
https://discordapp.com/oauth2/authorize?client_id=*******************&scope=bot&permissions=66321471
```

Choose the server you want the bot to be added to (you can only add bots to servers you can invite users to), disable any permissions you don't think the bot should have, then click **Authorize**.

*Note: This bot only uses edit message permissions, so everything else is unecessary. Functionality that uses these permissions may be added in the future.*

## Usage

Squnachbot listens for a number of commands in the server's text channel, each of which begin with the ! character. There are a number of built-in commands, and more commands can be added by you and your users. There are also a few commands which squanchbot can receive through a PM.

### Channel Commands

#### !alltags
Lists all known tags and their usage count.

#### !commands
Displays a list of all commands, including user-added audio commands. Message dissapears after 10 seconds to avoid channel clutter.

#### !photograph
Takes the URL of an image and processes that image inside the "look at this photograph" meme.
Example: ```!photograph http://website.com/funnypic.jpg```

#### !ping
Responds with a rude "pong" type message.

#### !random \<optional tag\>
Plays a random audio command. If given a tag, plays a random command which is tagged.

#### !rule34
If it exists...

#### !stop
Stops all currently playing audio.

#### !tags
Lists the top 25 used tags.

#### !tag search \<tag\>
Searches for commands with the given tag.

#### !ud
Looks up a word on [Urban Dictionary](http://www.urbandictionary.com) and returns the first result

#### !wolfram 
Queries [WolframAlpha](https://www.wolframalpha.com) and displays all results. Simply type your query after !wolfram.
Example: ```!wolfram poisson distribution```

### PM Commands
These commands will only work in a PM with the bot. This is intended to keep administration of audio commands out of the main channel. This reduces chat clutter and also helps users surprise other users with new audio.

All of the PM commands can be sent to the bot with our without the proceeding '!'. For example, 'delete airhorn' is equivalent to '!delete airhorn'.

#### !command \<command name\>
Displays the raw file and tag data for a given audio command.

#### !commands
Displays a list of all commands, including user-added audio commands.

#### !delete \<command name\>
When given the name of an audio command (without the !), this archives the file and removes it from the list of playable audio commands.

#### !download \<command name\>
When given the name of an audio command (without the !), this sends the user the file requested.

#### !tag add \<command name\> \<tag\>
Adds the specified tag to the command. Tags must be added one at a time and can contain spaces. Everything after the command name will be treated as the tag.

#### !tag list \<command name\>
Displays all the tags for the supplied audio command. Tags are added to audio commands to help search and administer the list.

#### !tag remove <command name> <tag>
Removes the specified tag from the command. Tags must be removed one at a time and may contain spaces. Everything after the command name will be treated as the tag.

### User-created Audio Commands

Users can create new audio commands by PMing audio files to the bot. These will then become available to all users and will cause squanchbot to connect to the requesting user's voice channel and play the file on command.

When uploading the file to the bot, initial tags for the audio can be included by typing them into the comment box. If more than one tag is desired, sepparate them with a comma. 

The new command name will be a lowercased version of the file name without the extension. Thus, if the user uploads a file called 'YeAAaHhHh.ogg' the new command will be '!yeaaahhhh'. Additionally, spaces are replaced with underscores to help avoid cross platform filesystem issues.

## WolframAlpha Integration

To utilize the wolfram alpha integration, you will need to apply to their API program here: [WolframAlpha API](http://products.wolframalpha.com/api/). This is free for personal use.

Once you have signed up and have your API key, edit config/default.json, add your key, and also set "enabeld" to true. The bot will need to be restarted for this to take effect.
