const { Telegraf } = require('telegraf');
const config = require('./config.json');

const bot = new Telegraf(config.token);

//functions

const chart = require('./functions/chart.js');
const doge_price = require('./functions/price.js')

//

const uah = config.doge_in_uah;
const usd = config.doge_in_usd;
const rub = config.doge_in_rub;


bot.on('message', ctx => {
    let command = ctx.message.text
    if(!command) return;
    cmdList = command.split(/\s+/g);

    if(cmdList[0].toLowerCase() == 'doge'){
        let num = +cmdList[1] || 1;
        doge_price(ctx, num, uah, usd, rub)
    };

    if(cmdList[0].toLowerCase() == 'chart') {
        chart(ctx, config.doge_price_chart);
    };
});
bot.launch();