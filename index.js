const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Le bot est vivant !'));
app.listen(process.env.PORT || 3000);


const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ] 
});

const PREFIX = "!"; // <-- C'est TON préfixe. Tu peux mettre ce que tu veux entre les guillemets.

client.on('ready', () => {
  console.log(`Le bot est connecté sous le nom de : ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  // On ignore si le message ne commence pas par ton préfixe, ou si c'est un autre bot qui parle
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  // On découpe le message pour isoler le nom de la commande
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // === TES COMMANDES COMMENCENT ICI ===

  if (command === 'ping') {
    message.reply('Pong ! 🏓');}

  if (command === 'salut') {
    message.reply(`Yo ${message.author.username}, bien ou quoi ?`);}

  if (command === 'sdk') {
    message.reply(`wsh ${message.author} trkl et toi ?`);}

  if (command === 'note') {
   const textAnoter = args.join(' ');
   const noteAleatoire = 
         Math.floor(Math.random() * 11);
  if (!textAnoter) {
  return message.reply(`je note ${message.author} **${noteAleatoire}/10**`);
  } else {
  return message.reply(`je note ${textAnoter} **${noteAleatoire}/10**`);} }




}
});
// Connexion sécurisée au bot Discord
client.login(process.env.DISCORD_TOKEN);
