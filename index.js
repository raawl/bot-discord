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

  if (command === 'pileouface') {
   const choix =
         Math.floor(Math.random() * 2);
   const pari = args[0];
  if (choix === 0 && !pari) {
   return message.reply('c’est **pile** !');}
else if (choix === 1 && !pari) {
   return message.reply('c’est **face** !'); 
  } else {
   if (choix === 0 && pari === 'pile') {
   return message.reply(`c’est **pile** ${message.author} tu as gagné !`);}
  else if (choix === 1 && pari === 'face') {
   return message.reply(`c’est **face** ${message.author} tu as gagné !`);
  } else {
   if (choix === 0) {
   return message.reply (`nul.. c’est **pile** ${message.author} tu as perdu..`)
  } else {
   return message.reply (`nul.. c’est **face** ${message.author} tu as perdu..`);}
} } }

   if (command === '8ball') {
   const question = args.join(' ');
   if (!question) {
   return message.reply (`${message.author} pose moi un question tdc`);}
   const reponseAleatoire =
   Math.floor(Math.random() * 3);
   if (reponseAleatoire === 0) {
   return message.reply('oui je suis d’accord');}
   if (reponseAleatoire === 1) {
   return message.reply('non je ne pense pas');}
   if (reponseAleatoire === 2) {
   return message.reply('pourquoi pas oui');}
 }
   if (command === 'profil') {
   const cible = message.mentions.users.first() || message.author;
   const user = await cible.fetch();
   const banniereURL = user.bannerURL({ dynamic: true, size: 1024 });

   const fichiers = [cible.displayAvatarURL({ dynamic: true, size: 1024 })];

   if (banniereURL) {
      fichiers.push(banniereURL);}

   const estLAutre = cible.id !== message.author.id;
   let texte = banniereURL ? 'Voici le profile de' : 'Pas de banner voici la pp de';
   texte += estLAutre ? `${cible}` : 'ton profil';

    return message.reply
    ({content: texte,files: fichiers });
 }







});
// Connexion sécurisée au bot Discord
client.login(process.env.DISCORD_TOKEN);