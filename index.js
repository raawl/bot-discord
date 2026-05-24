const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Le bot est vivant !'));
app.listen(process.env.PORT || 3000);


const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ] 
});
const jimp = require('jimp');

const PREFIX = "!"; // <-- C'est TON préfixe. Tu peux mettre ce que tu veux entre les guillemets.
let nombreSecret = 
Math.floor(Math.random() * 100) + 1;

client.on('ready', () => {
  console.log(`Le bot est connecté sous le nom de : ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
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
   return message.reply (`${message.author} pose moi une question tdc`);}
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
   let texte = banniereURL ? 'Voici le profile de ' : 'Pas de banner voici la pp de ';
   texte += estLAutre ? `${cible}` : `${message.author}`

    return message.reply
    ({content: texte,files: fichiers });
 }
  if (command === 'vacance') {
    if (!message.member.permissions.has('ModerateMembers')) {
      return message.reply("Tu n'as pas la permission de mute des membres ! ❌");
    }

    let cible = message.mentions.members.first();

    if (!cible && message.reference) {
      const messageRepondu = await message.channel.messages.fetch(message.reference.messageId);
      cible = await message.guild.members.fetch(messageRepondu.author.id).catch(() => null);
    }

    if (!cible) {
      return message.reply("Tu dois mentionner un membre ou répondre à son message pour le mute ! ❌");
    }

    if (!cible.moderatable) {
      return message.reply("Je ne peux pas mute ce membre (rôle trop haut ou admin). ❌");
    }

    const tempsDansArgs1 = args[0] && args[0].startsWith("<@");
    const texteDuree = tempsDansArgs1 ? args[1] : args[0];


    if (!texteDuree) {
      return message.reply("Il part en vacance combien de temps ?");
    }

    const valeur = parseInt(texteDuree);
    const unite = texteDuree.replace(valeur, "").toLowerCase().trim();

    if (isNaN(valeur) || valeur <= 0) {
      return message.reply("La durée entrée n'est pas valide. Exemple : `10m`, `2h`.");
    }

    let tempsMillisecondes = 0;
    let nomDuree = "";

    if (["s", "sec", "second", "seconde", "secondes"].includes(unite)) {
      tempsMillisecondes = valeur * 1000;
      nomDuree = `${valeur} seconde(s)`;
    } 
    else if (["m", "min", "minute", "minutes"].includes(unite)) {
      tempsMillisecondes = valeur * 60 * 1000;
      nomDuree = `${valeur} minute(s)`;
    } 
    else if (["minutos", "h", "hour", "hours", "heure", "heures"].includes(unite)) {
      tempsMillisecondes = valeur * 60 * 60 * 1000;
      nomDuree = `${valeur} heure(s)`;
    } 
    else if (["j", "d", "day", "days", "jour", "jours"].includes(unite)) {
      tempsMillisecondes = valeur * 24 * 60 * 60 * 1000;
      nomDuree = `${valeur} jour(s)`;
    } 
    else {
      tempsMillisecondes = valeur * 60 * 1000;
      nomDuree = `${valeur} minute(s)`;
    }

    const maxDiscord = 28 * 24 * 60 * 60 * 1000; 
    if (tempsMillisecondes > maxDiscord) {
      tempsMillisecondes = maxDiscord;
      nomDuree = '28 jours';
    }
    if (tempsMillisecondes < 1000) {
      tempsMillisecondes = 1000;
      nomDuree = '1 seconde';
    }

    try {
      await cible.send(`Ton vole Ryan Air depart **${message.guild.name}** durera **${nomDuree}**.`);
    } catch (error) {
      console.log(`Impossible d'envoyer un DM à ${cible.user.tag}.`);
    }

    await cible.timeout(tempsMillisecondes, `Mute par ${message.author.tag}`);

    return message.reply(`**${cible.user.username}** a bien pris son vole Ryan Air pour **${nomDuree}** !`);
  }
   if (command === 'justeprix') {
   const proposition = parseInt(args[0]);
   if (isNaN(proposition)) {
   return message.reply(`Tu dois mettre un nombre entre **1 et 100** ${message.author} !`);}
   if (proposition === nombreSecret) {
nombreSecret =
Math.floor(Math.random() * 100) + 1;
   return message.reply(`Bravo tu as trouvé le juste prix etait bien **${proposition}** un nouveau nombre a etait choisi !`);}
   if (proposition < nombreSecret) {
   return message.reply(`c’est **plus** ${message.author}..`);}
   if (proposition > nombreSecret) {
   return message.reply(`c’est **moins** ${message.author}..`);}
 }
     if (command === 'pixel') {
    let cible = message.mentions.users.first();
    
    if (!cible && message.reference) {
      cible = (await message.channel.messages.fetch(message.reference.messageId)).author;
    }
    
    if (!cible) {
      cible = message.author;
    }
    
    const avatarURL = cible.displayAvatarURL({ extension: 'png', size: 1024 });
    let messageStatut = await message.reply("🔄 Pixelisation de l'image en cours, patiente un peu..");

    try {
      const image = await jimp.read(avatarURL);
      image.pixelate(10); 
      
      const buffer = await image.getBufferAsync(jimp.MIME_PNG);

      messageStatut = await messageStatut.edit({
        content: `Voici **<@${cible.id}>** en **pixel** !`,
        files: [{ attachment: buffer, name: 'pp_pixel.png' }]
      });

    } catch (error) {
      console.error(error);
      return messageStatut.edit("❌ Une erreur est survenue en modifiant l'image..");
    }
  }

  if (command === 'explose') {
    let cible = message.mentions.users.first();
    
    if (!cible && message.reference) {
      cible = (await message.channel.messages.fetch(message.reference.messageId)).author;
    }
    
    if (!cible) {
      cible = message.author;
    }
    
    const avatarURL = cible.displayAvatarURL({ extension: 'png', size: 1024 });
    let messageStatut = await message.reply(`**<@${cible.id}>** va exploser..`);

    try {
      const image = await jimp.read(avatarURL);
      
      // Cet effet fait tourner les pixels au centre comme un tourbillon (effet twirl/vortex)
      // Le premier chiffre (0.6) c'est la force, le deuxième (250) c'est le rayon du cercle
      image.convolute([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ]); 
const buffer = await image.getBufferAsync(jimp.MIME_PNG);

      messageStatut = await messageStatut.edit({
        content: `💥 **BOUM !** **<@${cible.id}>** a explosé !`,
        files: [{ attachment: buffer, name: 'explosion.png' }]
      });

    } catch (error) {
      console.error(error);
      return messageStatut.edit('❌  L’explosion a été desamorcée');
    }
  }






});
// Connexion sécurisée au bot Discord
client.login(process.env.DISCORD_TOKEN);