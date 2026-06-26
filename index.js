const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Le bot est vivant !'));
app.listen(process.env.PORT || 3000);

const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');

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
  salonVerification: "1519923771811696751",
  salonLogsStaff: "1519924137483829338",
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

    // Téléchargement sécurisé des images pour contourner le blocage Discord
    const listeFichiers = [];
    for (const img of toutesLesImages.values()) {
      try {
        const response = await fetch(img.url);
        if (response.ok) {
          const buffer = Buffer.from(await response.arrayBuffer());
          listeFichiers.push(new AttachmentBuilder(buffer, { name: img.name }));
        }
      } catch (error) {
        console.error("Erreur lors du traitement d'une image :", error);
      }
    }

    await message.delete().catch(() => null);

    if (listeFichiers.length === 0) {
      return message.author.send("❌ Impossible de traiter tes images. Réessaye avec un autre format !").catch(() => null);
    }

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
      return message.reply("La durée entrée n'est pas valide. Exemple : `10m`, `2h`.");
    }

    let tempsMillisecondes = 0;
    let nomDuree = "";

    if (["s", "sec", "second", "seconde", "secondes"].includes(unite)) {
      tempsMillisecondes = valeur * 1000;
      nomDuree = `${valeur} seconde(s)`;
    } else if (["m", "min", "minute", "minutes"].includes(unite)) {
      tempsMillisecondes = valeur * 60 * 1000;
      nomDuree = `${valeur} minute(s)`;
    } else if (["minutos", "h", "hour", "hours", "heure", "heures"].includes(unite)) {
      tempsMillisecondes = valeur * 60 * 60 * 1000;
      nomDuree = `${valeur} heure(s)`;
    } else if (["j", "d", "day", "days", "jour", "jours"].includes(unite)) {
      tempsMillisecondes = valeur * 24 * 60 * 60 * 1000;
      nomDuree = `${valeur} jour(s)`;
    } else {
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
      return message.reply(`Tu dois mettre un nombre entre **1 et 100** ${message.author} !`);
    }
    if (proposition === nombreSecret) {
      nombreSecret = Math.floor(Math.random() * 100) + 1;
      return message.reply(`Bravo tu as trouvé le juste prix etait bien **${proposition}** un nouveau nombre a etait choisi !`);
    }
    if (proposition < nombreSecret) return message.reply(`c’est **plus** ${message.author}..`);
    if (proposition > nombreSecret) return message.reply(`c’est **moins** ${message.author}..`);
  }

  if (command === 'pixel') {
    let cible = message.mentions.users.first();
    if (!cible && message.reference) cible = (await message.channel.messages.fetch(message.reference.messageId)).author;
    if (!cible) cible = message.author;
    
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

  if (command === 'tsunami') {
    let cible = message.mentions.users.first();
    if (!cible && message.reference) cible = (await message.channel.messages.fetch(message.reference.messageId)).author;
    if (!cible) cible = message.author;
    
    const avatarURL = cible.displayAvatarURL({ extension: 'png', size: 1024 });
    let messageStatut = await message.reply(`tsunami en approche vers **<@${cible.id}>**..`);

    try {
      const image = await jimp.read(avatarURL);
      const width = image.bitmap.width;
      const height = image.bitmap.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2;
      const sourceImage = image.clone();

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < radius) {
            const angle = 2.5 * (1 - distance / radius);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            const sourceX = Math.floor(centerX + (dx * cos - dy * sin));
            const sourceY = Math.floor(centerY + (dx * sin + dy * cos));

            if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height) {
              const pixelColor = sourceImage.getPixelColor(sourceX, sourceY);
              image.setPixelColor(pixelColor, x, y);
            }
          }
        }
      }

      const buffer = await image.getBufferAsync(jimp.MIME_PNG);
      messageStatut = await messageStatut.edit({
        content: `💥 **<@${cible.id}>** a été emporté par le tsunami !`,
        files: [{ attachment: buffer, name: 'explosion.png' }]
      });
    } catch (error) {
      console.error(error);
      return messageStatut.edit('❌ Ce n’etait qu’une simple vague.');
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const [prefixe, action, idMembre] = interaction.customId.split('_');
  if (prefixe !== 'verif') return;

  const cibleEtoile = await interaction.guild.members.fetch(idMembre).catch(() => null);

  if (action === 'oui') {
    if (cibleEtoile) {
      await cibleEtoile.roles.add(CONFIG_VERIF.roleAAttriber).catch(() => null);
      await cibleEtoile.send(`✅ Félicitations ! Ta vérification sur **${interaction.guild.name}** a été acceptée par le staff ! Tu as maintenant accès au serveur.`).catch(() => null);
    }
    return interaction.update({
      content: `✅ Demande acceptée par **${interaction.user.tag}** (Membre : <@${idMembre}>)`,
      components: [],
      embeds: []
    });
  }

  if (action === 'non') {
    if (cibleEtoile) {
      await cibleEtoile.send(`❌ Désolé, ta photo envoyée sur **${interaction.guild.name}** n'était pas éligible à la vérification. Merci de bien lire les consignes et de recommencer !`).catch(() => null);
    }
    return interaction.update({
      content: `❌ Demande refusée par **${interaction.user.tag}** (Membre : <@${idMembre}>)`,
      components: [],
      embeds: []
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
