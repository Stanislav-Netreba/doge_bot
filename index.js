const { Telegraf } = require('telegraf');
const config = require('./config.json');
require('dotenv').config()

const bot = new Telegraf(process.env.TOKEN);

//functions

const chart = require('./functions/chart.js');
const help = require('./functions/help.js');
const doge_price = require('./functions/price.js')

//

const uah = config.doge_in_uah;
const usd = config.doge_in_usd;
const rub = config.doge_in_rub;


bot.on('message', ctx => {
    console.log('text')
    let command = ctx.message.text
    if(!command) return;
    cmdList = command.split(/\s+/g);

    if(cmdList[0].toLowerCase() == 'doge'){
        let num = +cmdList[1] || 1;
        doge_price(ctx, num, uah, usd, rub)
    };
    if(cmdList[0].toLowerCase() == 'help'){
        help(bot, ctx);
    };
    if(cmdList[0].toLowerCase() == 'chart') {
        chart(ctx, config.doge_price_chart);
    };
    if(ctx.message.text == 'time'){
        ctx.reply(new Date())

    }
});
bot.launch();