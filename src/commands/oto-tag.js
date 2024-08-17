const { SlashCommandBuilder } = require('@discordjs/builders');

const config = require('../../config.json');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('oto-tag')

    .setDescription('Kayıt sırasında kullanıcıya otomatik olarak etiket ekleyin.')

    .addUserOption(option => option.setName('user').setDescription('User to add the tag to').setRequired(true)),

  async execute(interaction) {

    const member = interaction.options.getUser('user');

    const guildMember = interaction.guild.members.cache.get(member.id);

    

    await guildMember.setNickname(`${config.tag} ${guildMember.displayName}`);

    

    await interaction.reply({ content: `${config.tag} has been added to ${member.tag}.`, ephemeral: true });

  }

};