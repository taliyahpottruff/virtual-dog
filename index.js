require('dotenv').config();

const { REST, Routes, Client, GatewayIntentBits, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const mongoose = require('mongoose');
const Dog = require('./dog');

mongoose.connect(process.env.MONGODB_URI).then(() => {

	const commands = [
		{
			name: 'adopt',
			description: 'Sets up a server dog if one doesn\'t already exist',
			options: [
				{
					name: 'name',
					description: 'The name of your new dog',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			]
		},
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

		const dog = await Dog.findOne({server: interaction.guildId});

		if (interaction.commandName === 'adopt') {
			if (dog) {
				return await interaction.reply(new Embed('Test'));
			}

			const dogName = interaction.options.getString('name');

			return await interaction.reply({ embeds: [new EmbedBuilder()
				.setTitle(`Congrats! Welcome to the family ${dogName}!`)
			]});
		}
		
		// Guard: Make sure a dog exists
		if (!dog) {
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
					.setColor('Red')
					.setTitle('HOLD UP!')
					.setDescription(`You don't have a dog yet. Use \`/adopt\` to adopt one first.`)
				]
			});
		}

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

	setInterval(async () => {
		
	}, 1000 * 60 * 60);
  
	client.login(process.env.TOKEN);
}).catch(err => {
	console.error(err);
});