require('dotenv').config();

const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');

const commands = [
	{
		name: 'speak',
		description: 'Gets the dog to bark.'
	},
	{
		name: 'check',
		description: 'Checks the dogs condition.'
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
	} else if (interaction.commandName === 'check') {
		if (dog.dead) {
			return await interaction.reply('***Your dog is dead... 💀***');
		}

		if (dog.hunger >= 70) {
			return await interaction.reply(`*Your dog looks fine.*`);
		}

		if (dog.hunger >= 50) {
			return await interaction.reply(`*Your dog looks hungry.*`);
		}

		if (dog.hunger >= 30) {
			return await interaction.reply(`*Your dog looks starving...*`);
		}

		if (dog.hunger >= 10) {
			return await interaction.reply(`*Please feed your dog...*`);
		}

		return await interaction.reply('*Your dog is on the brink of death...*');
	}
});

let dog = {
	dead: false,
	hunger: 100
};

setInterval(() => {
	if (!dog.dead) {
		dog.hunger -= 1;

		if (dog.hunger <= 0) {
			dog.dead = true;
		}
	}
}, 1000);
  
client.login(process.env.TOKEN);