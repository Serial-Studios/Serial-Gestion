const Discord = require('discord.js')
const db = require('quick.db')
const {
    MessageActionRow,
    MessageButton,
    MessageMenuOption,
    MessageMenu
} = require('discord-buttons');


module.exports = {
    name: 'blacklist',
    aliases: ["bl", "listenoire"],
    run: async (client, message, args, prefix, color) => {

        if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true) {

//##############################################################################################################################################################

            if (args[0] === "add") {
                let member = client.users.cache.get(message.author.id);
                if (args[1]) {
                    member = client.users.cache.get(args[1]);
                } else {
                    if (!user) return message.channel.send(`Aucun membre trouvé pour \`${args[1] || "rien"}\``)
                }
                if (message.mentions.members.first()) {
                    member = client.users.cache.get(message.mentions.members.first().id);
                }
                if (!member) return message.channel.send(`Aucun membre trouvé pour \`${args[1]|| " "}\``)
                if (db.get(`blmd_${client.user.id}_${member.id}`) === true) {
                    return message.channel.send(`**${member.tag}** est déjà dans la blacklist`)
                }
                let nmb = 0
                let nmbe = 0
                client.guilds.cache.forEach(g => {
                    if(g.members.cache.get(member.id)) {
                        g.members.cache.get(member.id).ban().then(() => {nmb=nmb+1}).catch(err => {nmbe=nmbe+1})
                     
                    }
                });
                db.set(`blmd_${client.user.id}_${member.id}`, true)

                message.channel.send(`**${member.tag}** à été ajouté à la blacklist.\nIl à été **ban** de **${client.guilds.cache.size}** serveur(s)\nJe n'ai pas pu le **ban** de 0 serveur`)

//##############################################################################################################################################################

            } else if (args[0] === "clear") {
                let tt = await db.all().filter(data => data.ID.startsWith(`blmd_${client.user.id}`));
                message.channel.send(`**${tt.length === undefined||null ? 0:tt.length}** ${tt.length > 1 ? "personnes ont été supprimées ":"personne a été supprimée"} de la blacklist`)


                let ttt = 0;
                for (let i = 0; i < tt.length; i++) {
                    db.delete(tt[i].ID);
                    ttt++;
                }

//##############################################################################################################################################################

            } else if (args[0] === "remove") {

                if (args[1]) {
                    let member = client.users.cache.get(message.author.id);
                    if (args[1]) {
                        member = client.users.cache.get(args[1]);
                    } else {
                        return message.channel.send(`Aucun membre trouvé pour \`${args[1]|| " "}\``)

                    }
                    if (message.mentions.members.first()) {
                        member = client.users.cache.get(message.mentions.members.first().id);
                    }
                    if (!member) return message.channel.send(`Aucun membre trouvé pour \`${args[1]|| " "}\``)
                    if (db.get(`blmd_${client.user.id}_${member.id}`) === null) {
                        return message.channel.send(`**${member.tag}** n'est pas dans la blacklist`)
                    }
                    db.delete(`blmd_${client.user.id}_${member.id}`)
                    message.channel.send(`**${member.tag}** à été retiré de la blacklist.\nIl à été **unban** de **${client.guilds.cache.size}** serveur(s)\nJe n'ai pas pu le **unban** de 0 serveur`)
                }

//##############################################################################################################################################################

            } else if (args[0] === "list") {


                let money = db.all().filter(data => data.ID.startsWith(`blmd_${client.user.id}`)).sort((a, b) => b.data - a.data)

                let p0 = 0;
                let p1 = 3;
                let page = 1;

                const embed = new Discord.MessageEmbed()
                    .setTitle('Blacklist')
                    .setDescription(money
                        .filter(x => client.users.cache.get(x.ID.split('_')[2]))
                        .map((m, i) => `${i + 1}) <@${client.users.cache.get(m.ID.split('_')[2]).id}> (${client.users.cache.get(m.ID.split('_')[2]).id})`)
                        .slice(0, 3)

                    )
                    .setFooter(`${page}/${Math.ceil(money.length === 0?1:money.length / 3)} • ${client.config.name}`)
                    .setColor(color)


                message.channel.send(embed).then(async tdata => {
                    if (money.length > 3) {
                        const B1 = new MessageButton()
                            .setLabel("◀")
                            .setStyle("gray")
                            .setID('bl1');

                        const B2 = new MessageButton()
                            .setLabel("▶")
                            .setStyle("gray")
                            .setID('bl2');

                        const bts = new MessageActionRow()
                            .addComponent(B1)
                            .addComponent(B2)
                        tdata.edit("", {
                            embed: embed,
                            components: [bts]
                        })
                        setTimeout(() => {
                            tdata.edit("", {
                                components: [],
                                embed: new Discord.MessageEmbed()
                                    .setTitle('Blacklist')
                                    .setDescription(money
                                        .filter(x => client.users.cache.get(x.ID.split('_')[2]))
                                        .map((m, i) => `${i + 1}) <@${client.users.cache.get(m.ID.split('_')[2]).id}> (${client.users.cache.get(m.ID.split('_')[2]).id})`)
                                        .slice(0, 3)

                                    )
                                    .setFooter(`1/${Math.ceil(money.length === 0?1:money.length / 3)} • ${client.config.name}`)
                                    .setColor(color)


                            })
                            // message.channel.send(embeds)
                        }, 60000 * 3)
                        client.on("clickButton", (button) => {
                            if (button.clicker.user.id !== message.author.id) return;
                            if (button.id === "bl1") {
                                button.reply.defer(true)

                                p0 = p0 - 3;
                                p1 = p1 - 3;
                                page = page - 1

                                if (p0 < 0) {
                                    return
                                }
                                if (p0 === undefined || p1 === undefined) {
                                    return
                                }


                                embed.setDescription(money
                                        .filter(x => client.users.cache.get(x.ID.split('_')[2]))
                                        .map((m, i) => `${i + 1}) <@${client.users.cache.get(m.ID.split('_')[2]).id}> (${client.users.cache.get(m.ID.split('_')[2]).id})`)
                                        .slice(p0, p1)

                                    )
                                    .setFooter(`${page}/${Math.ceil(money.length === 0?1:money.length / 3)} • ${client.config.name}`)
                                tdata.edit(embed);

                            }
                            if (button.id === "bl2") {
                                button.reply.defer(true)

                                p0 = p0 + 3;
                                p1 = p1 + 3;

                                page++;

                                if (p1 > money.length + 3) {
                                    return
                                }
                                if (p0 === undefined || p1 === undefined) {
                                    return
                                }


                                embed.setDescription(money
                                        .filter(x => client.users.cache.get(x.ID.split('_')[2]))
                                        .map((m, i) => `${i + 1}) <@${client.users.cache.get(m.ID.split('_')[2]).id}> (${client.users.cache.get(m.ID.split('_')[2]).id})`)
                                        .slice(p0, p1)

                                    )
                                    .setFooter(`${page}/${Math.ceil(money.length === 0?1:money.length / 3)} • ${client.config.name}`)
                                tdata.edit(embed);

                            }
                        })
                    }

                })

            }
        }


    }
}
