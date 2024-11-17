const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'guildMemberAdd',

  async execute(member) {
    // Kullanıcı için yeni takma ad formatını oluştur
    let nickname = config.unregisteredName; // Örnek: "Kayıtsız"
    if (config.autoTag) {
      nickname = `${config.tag} ${config.unregisteredName}`; // Örnek: "[TAG] Kayıtsız"
    }

    // Kullanıcının adını yeni isimle ayarla
    try {
      await member.setNickname(nickname);
    } catch (error) {
      console.error(`Takma ad ayarlanırken hata oluştu: ${error}`);
    }

    // Kayıtsız rolünü verme
    try {
      await member.roles.add(config.unregisteredRoleId);
    } catch (error) {
      console.error(`Rol eklenirken hata oluştu: ${error}`);
    }

    // Kayıt kanalını bulma
    const registerChannel = member.guild.channels.cache.get(config.registerChannelId);
    if (!registerChannel) {
      console.error("Kayıt kanalı bulunamadı.");
      return;
    }

    // Hesap güvenliği kontrolü (Hesap 1 aydan eski mi?)
    const isTrusted = (Date.now() - member.user.createdAt) >= (30 * 24 * 60 * 60 * 1000);
    const accountAge = Math.floor((Date.now() - member.user.createdAt) / (24 * 60 * 60 * 1000)); // Gün olarak hesap yaşı

    // Embed oluşturma
    const embed = new EmbedBuilder()
      .setColor(isTrusted ? 0x00FF00 : 0xFF0000) // Yeşil renk güvenliyse, kırmızı renk güvenli değilse
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
    try {
      await registerChannel.send({
        content: `Hoş geldin <@${member.id}>! Lütfen kaydını tamamlamak için aşağıdaki bilgilere göz at. || <@&${config.registeredRoleId}> ||`,
      });
      await registerChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error(`Mesaj gönderilirken hata oluştu: ${error}`);
    }
  },
};
