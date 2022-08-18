require('dotenv').config();

const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');

const commands = [
	{
		name: 'speak',
		description: 'Gets the dog to bark.'
	}
];

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent]});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'speak') {
		await interaction.reply('Bork!');
	}
});
  
client.login(process.env.TOKEN);