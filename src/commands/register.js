const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
    try {
      // Kullanıcı bilgilerini al
      const member = interaction.options.getUser('kullanici');
      let username = interaction.options.getString('isim');
      const age = interaction.options.getString('yas');
      
      // Yaş ekleme
      if (age) {
        username += ` | ${age}`;
      }

      // Otomatik tag ekleme
      if (config.autoTag) {
        username = `${config.tag} ${username}`;
      }

      // Kullanıcıyı guild'den çek
      const guildMember = await interaction.guild.members.fetch(member.id);

      // Kullanıcının ismini ve rollerini ayarla
      await guildMember.setNickname(username);
      await guildMember.roles.remove(config.unregisteredRoleId);
      await guildMember.roles.add(config.kayitliRolId);

      // Komutu kullanan kişiye geri bildirim
      await interaction.reply(`${member} başarıyla kaydedildi!`);

      // Embed mesajı oluştur
      const embed = new EmbedBuilder()
        .setTitle('Kullanıcı Kaydedildi')
        .setColor('GREEN')
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'Kayıt Eden', value: interaction.user.tag, inline: true },
          { name: 'Kayıt Olan', value: member.tag, inline: true },
          { name: 'Kayıt İsmi', value: username, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });

      // Log kanalına embed mesaj gönder
      const logChannel = interaction.guild.channels.cache.get(config.logChannelId);
      if (logChannel && logChannel.isTextBased()) {
        await logChannel.send({ embeds: [embed] });
      } else {
        console.error('Log kanalı bulunamadı veya mesaj gönderilemez.');
      }
    } catch (error) {
      console.error('Kayıt komutunda bir hata oluştu:', error);
      await interaction.reply({
        content: 'Bir hata oluştu. Lütfen tekrar deneyin veya yöneticinize başvurun.',
        ephemeral: true
      });
    }
  },
};
