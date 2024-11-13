const Discord = require('discord.js');
const db = require('quick.db');
const { MessageActionRow, MessageButton } = require('discord-buttons');

function status(statut) {
    if (statut === "dnd") return `\`🔴\``;
    if (statut === "idle") return `\`🟠\``;
    if (statut === "online") return `\`🟢\``;
    if (statut === "invisible") return `\`⚫\``;
}

function secur(antijoinbot) {
    if (antijoinbot === null) return `\`❌\``;
    if (antijoinbot === true) return `\`✅\``;
}

let activity = {
    'PLAYING': 'Joue à',
    'STREAMING': 'Streame',
    'LISTENING': 'Écoute',
    'WATCHING': 'Regarde',
};

async function updateEmbed(msg, client, color) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Configuration Bot')
        .setFooter(`${client.config.name}`)
        .setTimestamp()
        .setColor(color)
        .setDescription(`
            **1・Changer le nom d'utilisateur**
            Actuel: \`${client.user.username}\`

            **2・Changer l'avatar**
            Actuel: [\`Clique ici\`](${client.user.displayAvatarURL()})

            **3・Changer l'activitée**
            Actuel: \`${client.user.presence.activities[0] ? `${activity[client.user.presence.activities[0].type]} ${client.user.presence.activities[0].name}` : `❌`}\`

            **4・Changer la presence du bot**
            Actuel: ${status(client.user.presence.status)}

            **5・Secur invite**
            Actuel: ${secur(db.get(`antijoinbot_${client.user.id}`))}
        `);

    // Création de nouveaux boutons avec des IDs fixes
    const bt1 = new MessageButton().setStyle("gray").setID("unpr").setEmoji("1️⃣");
    const bt2 = new MessageButton().setStyle("gray").setID("deuxpr").setEmoji("2️⃣");
    const bt3 = new MessageButton().setStyle("gray").setID("troispr").setEmoji("3️⃣");
    const bt4 = new MessageButton().setStyle("gray").setID("quattrepr").setEmoji("4️⃣");
    const bt5 = new MessageButton().setStyle("gray").setID("cinqpr").setEmoji("5️⃣");

    const row = new MessageActionRow()
        .addComponent(bt1)
        .addComponent(bt2)
        .addComponent(bt3)
        .addComponent(bt4)
        .addComponent(bt5);

    // Mise à jour du message avec le nouvel embed et les nouveaux boutons
    await msg.edit({ embed: embed, components: [row] });
}

module.exports = {
    name: 'botconfig',
    aliases: ["setprofil", "config", "setup"],
    run: async (client, message, args, prefix, color) => {
        if (client.config.owner.includes(message.author.id)) {
            const embed = new Discord.MessageEmbed()
                .setTitle('Configuration Bot')
                .setFooter(`${client.config.name}`)
                .setTimestamp()
                .setColor(color)
                .setDescription(`
                    **1・Changer le nom d'utilisateur**
                    Actuel: \`${client.user.username}\`

                    **2・Changer l'avatar**
                    Actuel: [\`Clique ici\`](${client.user.displayAvatarURL()})

                    **3・Changer l'activitée**
                    Actuel: \`${client.user.presence.activities[0] ? `${activity[client.user.presence.activities[0].type]} ${client.user.presence.activities[0].name}` : `❌`}\`

                    **4・Changer la presence du bot**
                    Actuel: ${status(client.user.presence.status)}

                    **5・Secur invite**
                    Actuel: ${secur(db.get(`antijoinbot_${client.user.id}`))}
                `);

            // Création de boutons avec des IDs fixes
            const bt1 = new MessageButton().setStyle("gray").setID("unpr").setEmoji("1️⃣");
            const bt2 = new MessageButton().setStyle("gray").setID("deuxpr").setEmoji("2️⃣");
            const bt3 = new MessageButton().setStyle("gray").setID("troispr").setEmoji("3️⃣");
            const bt4 = new MessageButton().setStyle("gray").setID("quattrepr").setEmoji("4️⃣");
            const bt5 = new MessageButton().setStyle("gray").setID("cinqpr").setEmoji("5️⃣");

            const row = new MessageActionRow()
                .addComponent(bt1)
                .addComponent(bt2)
                .addComponent(bt3)
                .addComponent(bt4)
                .addComponent(bt5);

            await message.channel.send({ embed: embed, components: [row] }).then(async (msg) => {
                // Ajouter l'écouteur d'événements après l'envoi de l'embed
                client.on("clickButton", async (button) => {
                    // Vérifier si l'utilisateur est bien celui qui a lancé la commande
                    if (button.clicker.user.id !== message.author.id) return;

                    // Gestion de chaque bouton
                    if (button.id === "cinqpr") {
                        button.reply.defer(true);
                        if (db.get(`antijoinbot_${client.user.id}`) === null) {
                            db.set(`antijoinbot_${client.user.id}`, true);
                        } else if (db.get(`antijoinbot_${client.user.id}`) === true) {
                            db.set(`antijoinbot_${client.user.id}`, null);
                        }
                        return updateEmbed(msg, client, color); // Mettre à jour l'embed après l'interaction
                    }

                    if (button.id === "unpr") {
                        button.reply.defer(true);
                        let question = await message.channel.send("Quel est **le nouveau nom du bot** ?");
                        const filter = m => m.author.id === button.clicker.user.id;
                        message.channel.awaitMessages(filter, { max: 1, time: 60000 * 5, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete();
                            question.delete();
                            client.user.setUsername(collected.first().content).catch(async (err) => {
                                collected.first().delete();
                                message.channel.send("Je ne peux pas changer de pseudo pour l'instant, veuillez réessayer plus tard").then((mm) => mm.delete({ timeout: 5000 }));
                            }).then(async () => {
                                updateEmbed(msg, client, color); // Mettre à jour l'embed après l'interaction
                            });
                        });
                    }

                    if (button.id === "deuxpr") {
                        button.reply.defer(true);
                        let question = await message.channel.send("Quel est **le nouvelle avatar du bot ?** (*liens*)");
                        const filter = m => m.author.id === button.clicker.user.id;
                        message.channel.awaitMessages(filter, { max: 1, time: 60000 * 5, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete();
                            question.delete();
                            client.user.setAvatar(collected.first().content).catch(async (err) => {
                                collected.first().delete();
                                message.channel.send("Je ne peux pas changer de photo de profil pour l'instant, veuillez réessayer plus tard").then((mm) => mm.delete({ timeout: 5000 }));
                            }).then(async () => {
                                updateEmbed(msg, client, color); // Mettre à jour l'embed après l'interaction
                            });
                        });
                    }

                    if (button.id === "troispr") {
                        button.reply.defer(true);
                        let question = await message.channel.send("Quel est **le nouveau type d'activité du bot ?** (\`play\`, \`stream\`, \`watch\`, \`listen\`)");
                        const filter = m => m.author.id === button.clicker.user.id;

                        message.channel.awaitMessages(filter, { max: 1, time: 60000 * 5, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete();
                            question.delete();
                            let type = "";

                            if (collected.first().content.toLowerCase().startsWith("play")) {
                                type = "PLAYING";
                            } else if (collected.first().content.toLowerCase().startsWith("stream")) {
                                type = "STREAMING";
                            } else if (collected.first().content.toLowerCase().startsWith("listen")) {
                                type = "LISTENING";
                            } else if (collected.first().content.toLowerCase().startsWith("watch")) {
                                type = "WATCHING";
                            } else {
                                return message.channel.send("Type d'activité invalide ! Recommence !");
                            }

                            let question2 = await message.channel.send("Quel est **la nouvelle activité du bot ?** (*message*)");

                            message.channel.awaitMessages(filter, { max: 1, time: 60000 * 5, errors: ['time'] }).then(async (collected2) => {
                                collected2.first().delete();
                                question2.delete();

                                client.user.setActivity(collected2.first().content, { type: type, url: "https://www.twitch.tv/serial_checker" }).then(async (a) => {
                                    updateEmbed(msg, client, color); // Mettre à jour l'embed après l'interaction
                                });
                            });
                        });
                    }

                    if (button.id === "quattrepr") {
                        button.reply.defer(true);
                        let question = await message.channel.send(`Quel est **la nouvelle presence du bot ?** (\`dnd\`, \`idle\`, \`online\`, \`invisible\`)`);
                        const filter = m => m.author.id === button.clicker.user.id;

                        message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
                            collected.first().delete();
                            question.delete();
                            let type = "";

                            if (collected.first().content.toLowerCase().startsWith("dnd")) {
                                type = "dnd";
                            } else if (collected.first().content.toLowerCase().startsWith("idle")) {
                                type = "idle";
                            } else if (collected.first().content.toLowerCase().startsWith("online")) {
                                type = "online";
                            } else if (collected.first().content.toLowerCase().startsWith("invisible")) {
                                type = "invisible";
                            } else {
                                return message.channel.send(`Presence incorrecte ! Recommence !`);
                            }

                            client.user.setPresence({ status: type }).then(async (a) => {
                                updateEmbed(msg, client, color); // Mettre à jour l'embed après l'interaction
                            });
                        });
                    }
                });
            });
        }
    }
};
