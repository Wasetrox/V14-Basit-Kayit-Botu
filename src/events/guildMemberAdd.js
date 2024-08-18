const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'guildMemberAdd',

  async execute(member) {
    // Kullanıcının ismini config'de tanımlanan kayıtsız isim olarak ayarlama
    await member.setNickname(config.unregisteredName);

    // Otomatik tag ekleme
    if (config.autoTag) {
      newUsername = `${config.tag} ${newUsername}`;
    }

    // Kayıtsız rolünü verme
    await member.roles.add(config.unregisteredRoleId);

    // Kayıt kanalını bulma
    const registerChannel = member.guild.channels.cache.get(config.registerChannelId);

    // Hesap güvenliği kontrolü (Hesap 1 aydan eski mi?)
    const isTrusted = (Date.now() - member.user.createdAt) >= (30 * 24 * 60 * 60 * 1000);
    const accountAge = Math.floor((Date.now() - member.user.createdAt) / (24 * 60 * 60 * 1000)); // Gün olarak hesap yaşı

    // Embed oluşturma
    const embed = new EmbedBuilder()
      .setColor(isTrusted ? 0x00FF00 : 0xFF0000)  // Yeşil renk güvenliyse, kırmızı renk güvenli değilse
      .setTitle('Yeni Üye Katıldı!')
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        { name: 'Kullanıcı', value: `<@${member.id}>`, inline: true },
        { name: 'Hesap Yaşı', value: `${accountAge} gün`, inline: true },
        { name: 'Güvenilirlik', value: isTrusted ? 'Güvenli' : 'Güvenli Değil', inline: true },
      )
      .setFooter({ text: `Sunucumuza hoş geldin! Lütfen kaydını tamamla.` })
      .setTimestamp();

    // Hoş geldin mesajı ve embed'i gönderme
    registerChannel.send({ content: `Hoş geldin <@${member.id}>! Lütfen kaydını tamamlamak için aşağıdaki bilgilere göz at. || <@&${config.sregisteredRoleId}> ||` });
    registerChannel.send({ embeds: [embed] });
  }
};
