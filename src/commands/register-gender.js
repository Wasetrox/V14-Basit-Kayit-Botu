const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('c-kayıt')
    .setDescription('Bir kullanıcıyı cinsiyetine göre (erkek/kız) kaydeder ve yaş bilgisi ekler.')
    .addUserOption(option => 
      option.setName('kullanici')
        .setDescription('Kayıt edilecek kullanıcıyı seçin')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('isim')
        .setDescription('Kullanıcının ismini girin')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('cinsiyet')
        .setDescription('Kullanıcının cinsiyetini seçin')
        .setRequired(true)
        .addChoices(
          { name: 'Erkek', value: 'erkek' },
          { name: 'Kız', value: 'kiz' },
        ))
    .addStringOption(option => 
      option.setName('yas')
        .setDescription('Kullanıcının yaşını girin (opsiyonel)')
        .setRequired(false)),

  async execute(interaction) {
    const member = interaction.options.getUser('kullanici');
    let username = interaction.options.getString('isim');
    const gender = interaction.options.getString('cinsiyet');
    const age = interaction.options.getString('yas');

    if (age) {
      username += ` | ${age}`;
    }

    // Otomatik tag ekleme
    if (config.autoTag) {
      username = `${config.tag} ${username}`;
    }

    const guildMember = await interaction.guild.members.fetch(member.id);
    const unregisterRole = await interaction.guild.roles.fetch(config.unregisteredRoleId)

    // Cinsiyete göre rol belirleme
    let roleId;
    console.log(gender)
    if (gender == 'erkek') {
      roleId = config.maleRoleId;
    } else if (gender == 'kiz') {
      roleId = config.femaleRoleId;
    }
    const genderRole = await interaction.guild.roles.fetch(roleId);
    const kayitli = await interaction.guild.roles.fetch(config.kayitliRolId)

    // Kullanıcının ismini ve rolünü ayarlama
    await guildMember.setNickname(username);
    if(unregisterRole){
      await guildMember.roles.remove(unregisterRole);
    }
    await guildMember.roles.add(kayitli);
    if(genderRole){
      await guildMember.roles.add(genderRole);
    }

    await interaction.reply(`${member} başarıyla ${gender} olarak kaydedildi!`);
    
    const logChannel = interaction.guild.channels.cache.get(config.logKanalId);
    if (logChannel) {
      logChannel.send(`${interaction.user.tag} kullanıcısı ${member.tag}'yi ${gender} olarak kaydetti.`);
    }
  },
};
