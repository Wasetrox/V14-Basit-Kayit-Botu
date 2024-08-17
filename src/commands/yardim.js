const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yardım')
    .setDescription('Botun tüm komutlarını ve nasıl kullanıldıklarını gösterir.'),
  
  async execute(interaction) {
    // Yardım mesajını embed şeklinde oluşturma
    const helpEmbed = new EmbedBuilder()
      .setColor('#0099ff') // Embed rengi
      .setTitle('Yardım Komutları')
      .setDescription('Aşağıda botun mevcut komutlarını ve nasıl kullanıldıklarını bulabilirsiniz.')
      .addFields(
        { name: '/kayıt', value: 'Bir kullanıcıyı isim ve opsiyonel olarak yaş bilgisiyle kaydeder.' },
        { name: '/c-kayıt', value: 'Bir kullanıcıyı cinsiyetine göre (erkek/kız) kaydeder ve yaş bilgisi ekler.' },
        { name: '/oto-tag', value: 'Yeni kayıt olan bir kullanıcıya otomatik olarak tag ekler.' },
        { name: '/yardım', value: 'Botun tüm komutlarını ve kullanım detaylarını gösterir.' },
      )
      .setTimestamp()
      .setFooter({ text: 'Bot Yardımı', iconURL: interaction.client.user.displayAvatarURL() });

    // Embed'i gönder
    await interaction.reply({ embeds: [helpEmbed] });
  },
};
