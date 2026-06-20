const axios = require("axios");

require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

// WAKES UP THE BOT
app.command("/locked-in-bot-ping",async({command,ack,respond})=>{
    const start = Date.now();
    await ack();
    const latency = Date.now()-start;
    await respond({text: `Pong!\nLatency:${latency}ms`});
});

(async()=>{
    await app.start();
    console.log("bot is running!");
})();

// ASKS BOT FOR HELP
app.command("/locked-in-bot-help",async({ack,respond})=>{
    await ack();
    await respond({
        text:
        `Available Commands:
        /locked-in-bot-ping - Check bot latency
        /locked-in-bot-catfact - Get a cat fact`
    });
});

//CAT FACT
app.command("/locked-in-bot-history", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://muffinlabs.com");
    const events = response.data.data.Events;
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    await respond({ text: `📜 *On this day in Year ${randomEvent.year}:*\n${randomEvent.text}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a history fact." });
  }
});

//JOKE
app.command("/locked-in-bot-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

// COIN FLIP COMMAND
app.command('/locked-in-bot-coinflip', async ({ ack, respond }) => {
    await ack();
    const result = Math.random() < 0.5 ? "Heads! 🪙" : "Tails! 🪙";
    await respond(`The coin spun through the air and landed on... *${result}*`);
});

// MAGIC 8-BALL COMMAND
app.command('/locked-in-bot-8-ball', async ({ command, ack, respond }) => {
    await ack();
    const answers = [
        "It is certain. 🔮", "Without a doubt! ✅", "Reply hazy, try again. 🌫️",
        "Ask again later. ⏳", "Don't count on it. ❌", "My sources say no. 🛑",
        "Outlook good! 👍", "Most likely. 😎"
    ];
    const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
    await respond(`You asked: *"${command.text}"*\n🔮 The Magic 8-Ball says: *${randomAnswer}*`);
});

// CUSTOM DICE ROLLER
app.command("/locked-in-bot-dice", async ({ command, ack, respond }) => {
    await ack(); // 1.3.7, 1.3.8
    let sides = parseInt(command.text) || 6;
    const roll = Math.floor(Math.random() * sides) + 1;
    // Changed double asterisks (**) to single asterisks (*) for Slack formatting
    await respond({ text: `🎲 You rolled a custom *${sides}-sided* die and got a *${roll}*!` }); // 1.3.8
});

// 