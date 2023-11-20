const { Client, GatewayIntentBits } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const math = require("mathjs");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});
const dotenv = require("dotenv");

dotenv.config();
client.on("ready", () => {
  console.log(`Bot Online ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "cal") {
    const rows = [
      new ActionRowBuilder().addComponents([
        new ButtonBuilder({
          customId: "clear",
          style: "4",
          label: "AC",
        }),
        new ButtonBuilder({
          customId: "(",
          style: "1",
          label: "(",
        }),
        new ButtonBuilder({
          customId: ")",
          style: "1",
          label: ")",
        }),
        new ButtonBuilder({
          customId: "/",
          style: "1",
          label: "➗",
        }),
      ]),
      new ActionRowBuilder().addComponents([
        new ButtonBuilder({
          customId: "7",
          style: "2",
          label: "7",
        }),
        new ButtonBuilder({
          customId: "8",
          style: "2",
          label: "8",
        }),
        new ButtonBuilder({
          customId: "9",
          style: "2",
          label: "9",
        }),
        new ButtonBuilder({
          customId: "*",
          style: "1",
          label: "✖️",
        }),
      ]),
      new ActionRowBuilder().addComponents([
        new ButtonBuilder({
          customId: "4",
          style: "2",
          label: "4",
        }),
        new ButtonBuilder({
          customId: "5",
          style: "2",
          label: "5",
        }),
        new ButtonBuilder({
          customId: "6",
          style: "2",
          label: "6",
        }),
        new ButtonBuilder({
          customId: "-",
          style: "1",
          label: "➖",
        }),
      ]),
      new ActionRowBuilder().addComponents([
        new ButtonBuilder({
          customId: "1",
          style: "2",
          label: "1",
          color: "65280",
        }),
        new ButtonBuilder({
          customId: "2",
          style: "2",
          label: "2",
        }),
        new ButtonBuilder({
          customId: "3",
          style: "2",
          label: "3",
        }),
        new ButtonBuilder({
          customId: "+",
          style: "1",
          label: "➕",
        }),
      ]),
      new ActionRowBuilder().addComponents([
        new ButtonBuilder({
          customId: "backspace",
          style: "1",
          label: "⬅️",
        }),
        new ButtonBuilder({
          customId: "0",
          style: "2",
          label: "0",
        }),
        new ButtonBuilder({
          customId: ".",
          style: "1",
          label: ".",
        }),
        new ButtonBuilder({
          customId: "result",
          style: "3",
          label: "=",
        }),
      ]),
    ];

    await interaction.deferReply({ ephemeral: true });
    const msg = await interaction.followUp({
      components: rows,
      embeds: [
        {
          description: "```\nCalculator\n```",
          color: "65280",
        },
      ],
      fetchReply: true,
    });

    let data = "";

    const col = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      time: 600000,
    });

    col.on("collect", async (i) => {
      let extra = "";

      if (i.customId === "result") {
        try {
          let result = "";
          result = math.evaluate(data).toString();
          data += ` = ${result}`;
        } catch (e) {
          data = "";
          extra = "Click AC for restart";
        }
      } else if (i.customId === "clear") {
        data = "";
        extra = "Click AC for restart";
      } else if (i.customId === "backspace") {
        data = data.slice(0, data.length - 2);
      } else {
        const lc = data[data.length - 1];
        data +=
          `${
            ((parseInt(i.customId) == i.customId || i.customId === ".") &&
              (lc == parseInt(lc) || lc === ".")) ||
            data.length === 0
              ? ""
              : " "
          }` + i.customId;
      }

      i.update({
        embeds: [
          {
            color: "65280",
            description: `\`\`\`\n${data || extra}\n\`\`\``,
          },
        ],
      });
    });

    col.on("end", () => {
      msg.edit({
        components: [
          new ActionRowBuilder().addComponents([
            new ButtonBuilder({
              label: "The Calculator Ended",
              disabled: true,
              style: "4",
              customId: "_1_",
            }),
          ]),
        ],
      });
    });
  }
});

client.login(process.env.TOKEN);
