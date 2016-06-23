# squanchbot
*Just say say what's in your squanch and people will understand* ~Rick Sanchez C-137

This is a bot for [discord](https://discordapp.com). It was created for the use of a small personal server. Its main functionality is playing user defined audio clips in voice chat, but it also has a few other functions. 

By convention, most discord bots run as a single public entity that can be invited to servers. However, because this bot accepts file uploads from users and can end up storing quite a bit of data, I decided to not do that. If you would like to add this bot to your server you will need to generate a discord API key and run / host it for yourself.

## Running the bot

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
