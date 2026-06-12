const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Le bot est vivant !'));
app.listen(process.env.PORT || 3000);

const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers
  ] 
});
const jimp = require('jimp');

const PREFIX = "!"; 
let nombreSecret = Math.floor(Math.random() * 100) + 1;

const CONFIG_VERIF = {
  salonVerification: "1514850676755398856",
  salonLogsStaff: "1514850739489345547",
  roleAAttriber: "1514851493927190598"
};

client.on('ready', () => {
  console.log(`Le bot est connecté sous le nom de : ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.channel.id === CONFIG_VERIF.salonVerification) {
    const toutesLesImages = message.attachments.filter(fichier => fichier.contentType && fichier.contentType.startsWith('image/'));
    
    if (toutesLesImages.size !== 5) {
      await message.delete().catch(() => null);
      return message.author.send("❌ Tu devez envoyer **exactement 5 photos** dans le salon de vérification !").catch(() => null);
    }

    const salonStaff = message.guild.channels.cache.get(CONFIG_VERIF.salonLogsStaff);
    if (!salonStaff) return;

    await message.delete().catch(() => null);

    const listeFichiers = toutesLesImages.map(img => img.url);

    const boutons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`verif_oui_${message.author.id}`)
        .setLabel('Accepter ✅')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`verif_non_${message.author.id}`)
        .setLabel('Refuser ❌')
        .setStyle(ButtonStyle.Danger)
    );

    await salonStaff.send({
      content: `📷 **Nouvelle demande de vérification de :** ${message.author} (${message.author.tag})`,
      files: listeFichiers,
      components: [boutons]
    });
    
    return message.author.send("⏳ Tes 5 photos ont bien été envoyées au staff. Patiente pendant la vérification !").catch(() => null);
  }

  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    message.reply('Pong ! 🏓');
  }

  if (command === 'salut') {
    message.reply(`Yo ${message.author.username}, bien ou quoi ?`);
  }

  if (command === 'sdk') {
    message.reply(`wsh ${message.author} trkl et toi ?`);
  }

  if (command === 'note') {
    const textAnoter = args.join(' ');
    const noteAleatoire = Math.floor(Math.random() * 11);
    if (!textAnoter) {
      return message.reply(`je note ${message.author} **${noteAleatoire}/10**`);
    } else {
      return message.reply(`je note ${textAnoter} **${noteAleatoire}/10**`);
    } 
  }

  if (command === 'pileouface') {
    const choix = Math.floor(Math.random() * 2);
    const pari = args[0];
    if (choix === 0 && !pari) {
      return message.reply('c’est **pile** !');
    } else if (choix === 1 && !pari) {
      return message.reply('c’est **face** !'); 
    } else {
      if (choix === 0 && pari === 'pile') {
        return message.reply(`c’est **pile** ${message.author} tu as gagné !`);
      } else if (choix === 1 && pari === 'face') {
        return message.reply(`c’est **face** ${message.author} tu as gagné !`);
      } else {
        if (choix === 0) {
          return message.reply(`nul.. c’est **pile** ${message.author} tu as perdu..`);
        } else {
          return message.reply(`nul.. c’est **face** ${message.author} tu as perdu..`);
        }
      } 
    } 
  }

  if (command === '8ball') {
    const question = args.join(' ');
    if (!question) {
      return message.reply(`${message.author} pose moi une question tdc`);
    }
    const reponseAleatoire = Math.floor(Math.random() * 8);
    if (reponseAleatoire === 0) return message.reply('oui je suis d’accord');
    if (reponseAleatoire === 1) return message.reply('non je ne pense pas');
    if (reponseAleatoire === 2) return message.reply('pourquoi pas oui');
    if (reponseAleatoire === 3) return message.reply('absoluement oui');
    if (reponseAleatoire === 4) return message.reply('alors la non');
    if (reponseAleatoire === 5) return message.reply('possiblement');
    if (reponseAleatoire === 6) return message.reply('il est peu probable');
    if (reponseAleatoire === 7) return message.reply('oui, mais juste pour te faire plaisir');
  }

  if (command === 'profil') {
    const cible = message.mentions.users.first() || message.author;
    const user = await cible.fetch();
    const banniereURL = user.bannerURL({ dynamic: true, size: 1024 });
    const fichiers = [cible.displayAvatarURL({ dynamic: true, size: 1024 })];

    if (banniereURL) fichiers.push(banniereURL);

    const estLAutre = cible.id !== message.author.id;
    let texte = banniereURL ? 'Voici le profile de ' : 'Pas de banner voici la pp de ';
    texte += estLAutre ? `${cible}` : `${message.author}`;

    return message.reply({ content: texte, files: fichiers });
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
      return message.reply("La durée
