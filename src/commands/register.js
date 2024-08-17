const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kayıt')
    .setDescription('Bir kullanıcıyı isim ve opsiyonel olarak yaş bilgisiyle kaydeder.')
    .addUserOption(option => 
      option.setName('kullanici')
        .setDescription('Kayıt edilecek kullanıcıyı seçin')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('isim')
        .setDescription('Kullanıcının ismini girin')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('yas')
        .setDescription('Kullanıcının yaşını girin (opsiyonel)')
        .setRequired(false)),
  
  async execute(interaction) {
    const member = interaction.options.getUser('kullanici');
    let username = interaction.options.getString('isim');
    const age = interaction.options.getString('yas');

    if (age) {
      username += ` | ${age}`;
    }

    // Otomatik tag ekleme
    if (config.autoTag) {
      username = `${config.tag} ${username}`;
    }

    const guildMember = await interaction.guild.members.fetch(member.id);
    await guildMember.setNickname(username);
    await guildMember.roles.remove(config.unregisteredRoleId);
    await guildMember.roles.add(config.kayitliRolId);

    await interaction.reply(`${member} başarıyla kaydedildi!`);
    
    const logChannel = interaction.guild.channels.cache.get(config.logChannelId);
    if (logChannel) {
      logChannel.send(`${interaction.user.tag} kullanıcısı ${member.tag}'yi kaydetti.`);
    }
  },
};
