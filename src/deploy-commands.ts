import fs from 'node:fs';
import path from 'node:path';
import configJson from '../config.json';
import { REST, Routes } from 'discord.js';

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const folders = fs.readdirSync(foldersPath);

for(const folder of folders) {
    const folderPath = path.join(foldersPath, folder);
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    
    for(const file of files) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);

        if('data' in command && 'execute' in command) {
            commands.push(JSON.stringify(command.data));
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required property.`);
        }
    }
}

const rest = new REST().setToken(configJson.token);

(async () => {
    try {
        console.log(`Started refreshing application (/) commands.`);
        const data:any = await rest.put(
            Routes.applicationGuildCommands(configJson.client_id, configJson.guild_id),
            { body: commands },
        );

        console.log(`Succesfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();