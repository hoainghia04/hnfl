import { config } from "dotenv";
import {
  Client,
  IntentsBitField,
  ActivityType,
  REST,
  Routes,
  ApplicationCommandOptionType,
  EmbedBuilder,
  Collection,
} from "discord.js";
import cheerio from "cheerio";
import { request } from "./request.mjs";
import fakeUserAgent from "user-agents-gen";

config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

const cooldowns = new Collection();

client.on("ready", (c) => {
  console.log("Bot Online");

  // client.user.setActivity({
  //   name: "/keyhn",
  //   type: ActivityType.Listening,
  // });
});

async function bypass(userhwid) {
  const userAgent = fakeUserAgent();
  const start_url =
    "https://keysystem.fluxteam.net/android/checkpoint/start.php?HWID=" + userhwid;
  const commonheader = {
    Referer: "https://linkvertise.com/",
    "User-Agent": userAgent,
  };
  await request(start_url, {
    Referer: "https://fluxteam.net/",
    "User-Agent": userAgent,
  });
  await request(
    "https://fluxteam.net/android/checkpoint/check1.php",
    commonheader
  );
  const response = await request(
    "https://fluxteam.net/android/checkpoint/main.php",
    commonheader
  );
  const parsed = cheerio.load(response["data"]);
  const key = parsed("body > main > code").text();

  return key;
}

function extractHWIDFromURL(url) {
  const regex = /HWID=([\w\d]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

client.on("interactionCreate", async (interaction) => {
  const allowedChannelId = '1200782926506369167';
		if (!interaction.guild) {
			await interaction.reply("Mày chỉ được sử dụng lệnh trong server. [Click vào đây để được vào server!](https://discord.gg/hngaming)");
			return;
			}
        if (interaction.channelId !== allowedChannelId) {
    const allowedChannel = interaction.guild.channels.cache.get(allowedChannelId);
    const channelLink = allowedChannel ? `<#${allowedChannel.id}>` : `channel ${allowedChannelId}`;
    const replyMessage = await interaction.reply(`Mày chỉ được dùng lệnh trong ${channelLink}.`);

    setTimeout(async () => {
      await replyMessage.delete();
    }, 3000); 
    return;
  }
  if (!interaction.isChatInputCommand()) return;

  await interaction.deferReply();

  const command = interaction.commandName;

  if (!cooldowns.has(command)) {
    cooldowns.set(command, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command);
  const cooldownAmount = 1 * 1000;

  if (timestamps.has(interaction.guild.id)) {
    const expirationTime = timestamps.get(interaction.guild.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return interaction.editReply(`Dùng từ từ thôi thằng khứa, chờ ${timeLeft.toFixed(1)} giây đi thằng khứa.`);   
    }
  }

  timestamps.set(interaction.guild.id, now);
  setTimeout(() => timestamps.delete(interaction.guild.id), cooldownAmount);

  if (interaction.commandName === "keyhn") {
    const link = interaction.options.get("link").value;
    
    if (link.startsWith('https://keysystem.fluxteam.net/android/checkpoint/start.php?HWID=cracked') ||
    link.startsWith('https://keysystem.fluxteam.net/android/checkpoint/start.php?HWID=hngamingfluxus') ||
    link.startsWith('https://keysystem.fluxteam.net/android/checkpoint/start.php?HWID=succcccccccccccccccccccacacafxcaxic21312930912030120410dsqdwqk1329949123owqodwq08dwqdqwd0satrucgg') ||
    link.startsWith('https://keysystem.fluxteam.net/android/checkpoint/start.php?HWID=83ba0c867602ea0f883776a5ded4b27fe8b419e17db47d2850f74a6c017ea16529433d73c9719ba10f12bde3431bd6d3') ||
    link.startsWith('https://keysystem.fluxteam.net/android/checkpoint/start.php?HWID=ec1fadf0d747d04788c50f0b4b2f91fcadd5358d7d7f7df2e72e957c76f27fb9fb98ce7fb1bf5bf53130db69108a38cb') ||
    link.startsWith('https://keysystem.fluxteam.net/android/checkpoint/start.php?HWID=c215891a4b87d66e8bd3e5351a4695154445318dc86949949553bc767e4749495e7b1b8dc1d0c85f8d82e0351bc4a369')) {

      const embed = new EmbedBuilder()
        .setColor("#FF00FF")
        .setTitle("Banned!")
        .setDescription("**Link fluxus bị banned rồi mày**\nHãy xóa fluxus của mày và [ấn vào đây để tải fluxus mới](https://www.mediafire.com/file/h5nugjv5foohjol/hngaming-fl.apk/file)")
        .setThumbnail('https://cdn.discordapp.com/attachments/1175469677871370323/1180021154988171385/nx.gif?ex=657be757&is=65697257&hm=6d10b828b749d1c5ccec3c896e6587ad32dace5d86eea0a6cf9fb30099b92562&')
        .setTimestamp()

      return await interaction.followUp({ embeds: [embed], ephemeral: true });
    }

    if (!link.startsWith('https://keysystem.fluxteam.net/android/checkpoint/start.php?HWID=')) {
      const embed = new EmbedBuilder()
        .setColor("#FF00FF")
        .setTitle("Đồ ngu")
        .setDescription("**sai link rồi thằng khứa! \nLink phải giống như này nè thằng khứa, ví dụ:** ```https://keysystem.fluxteam.net/android/checkpoint/start.php?HWID=hngaming```")
        .setThumbnail('https://cdn.discordapp.com/attachments/1175469677871370323/1180021154988171385/nx.gif?ex=657be757&is=65697257&hm=6d10b828b749d1c5ccec3c896e6587ad32dace5d86eea0a6cf9fb30099b92562&')
        .setTimestamp() 
      return await interaction.followUp({ embeds: [embed], ephemeral: true }); 
    }

    try {
      const userhwid = extractHWIDFromURL(link);
      const key = await bypass(userhwid);
      const keyWithoutSpaces = key.replace(/\s+/g, "");

      const embed = new EmbedBuilder()
        .setColor("#FF69B4")
        .setTitle("By pass key fluxus by HN Gaming!")
        .setThumbnail('https://cdn.discordapp.com/attachments/1175469677871370323/1180021154988171385/nx.gif?ex=657be757&is=65697257&hm=6d10b828b749d1c5ccec3c896e6587ad32dace5d86eea0a6cf9fb30099b92562&')
	      .setTimestamp()
        .addFields(
          {
            name: "Key của mày : ",
            value: "```" + keyWithoutSpaces + "```\n[Subscribe channel HN Gaming](https://www.youtube.com/channel/UCVzNxeEWfSbnf_IK3YMhW3w)",
          },
        );
      await interaction.followUp({ content: `${interaction.user.toString()}, mày đã dùng lệnh và dưới đây là key của mày`, embeds: [embed] });
    } catch (error) {
      await interaction.followUp("fluxus website probably down.");
    }
  }
});

async function main() {
  const commands = [
    {
      name: "keyhn",
      description: "Key bypasser for Fluxus!",
      options: [
        {
          name: "link",
          description: "enter your link",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ];

  try {
    console.log("Updating Slash...");
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT, process.env.GUILD),
      { body: commands }
    );
    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(error);
  }
}

main();
