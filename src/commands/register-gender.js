const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
    const unregisterRole = await interaction.guild.roles.fetch(config.unregisteredRoleId);

    // Cinsiyete göre rol belirleme
    let roleId;
    if (gender == 'erkek') {
      roleId = config.maleRoleId;
    } else if (gender == 'kiz') {
      roleId = config.femaleRoleId;
    }
    const genderRole = await interaction.guild.roles.fetch(roleId);
    const kayitli = await interaction.guild.roles.fetch(config.kayitliRolId);

    // Kullanıcının ismini ve rolünü ayarlama
    await guildMember.setNickname(username);
    if (unregisterRole) {
      await guildMember.roles.remove(unregisterRole);
    }
    await guildMember.roles.add(kayitli);
    if (genderRole) {
      await guildMember.roles.add(genderRole);
    }

    await interaction.reply(`${member} başarıyla ${gender} olarak kaydedildi!`);

    // Log kanalına embed mesaj gönderme
    const logChannel = interaction.guild.channels.cache.get(config.logChannelId);
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setColor(gender === 'erkek' ? '#3498db' : '#e91e63') // Erkek için mavi, kız için pembe renk
        .setTitle('Kayıt İşlemi')
        .addFields(
          { name: 'Kayıt Eden', value: interaction.user.tag, inline: true },
          { name: 'Kayıt Olan', value: `${member.tag} (${member.id})`, inline: true },
          { name: 'Cinsiyet', value: gender.charAt(0).toUpperCase() + gender.slice(1), inline: true }
        )
        .setFooter({ text: `Kayıt Tarihi: ${new Date().toLocaleString('tr-TR')}` })
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } else {
      console.error('Log kanalı bulunamadı. Lütfen config.logKanalId değerini kontrol edin.');
    }
  },
};
