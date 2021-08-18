const { Telegraf } = require('telegraf'); //импортируем Телеграф
const config = require('./config.json'); //имортируем конфиг
require('dotenv').config(); //импортируем dotenv
const bot = new Telegraf(process.env.TOKEN); //регестрируем бота

///
//импорт всех существующих функций
let chart = require('./functions/chart.js'),
	help = require('./functions/help.js'),
	coin_price = require('./functions/price.js');
///
///
//импорт всех существующих ссылок
let uah = config.doge_in_uah, //ссылка на цену доги к гривне
	usd = config.doge_in_usd, //ссылка на цену доги к доллару
	rub = config.doge_in_rub, //ссылка на цену доги к рублю
	uah_btc = config.bitcoin_in_uah, //ссылка на цену доги к гривне
	usd_btc = config.bitcoin_in_usd, //ссылка на цену доги к доллару
	rub_btc = config.bitcoin_in_rub, //ссылка на цену доги к рублю
	chart_data_doge = config.doge_price_chart, //ссылка с данными для графика
	chart_data_btc = config.btc_price_chart; //ссылка с данными для графика btc
///

bot.command('doge', (ctx) => {
	let msg = ctx.message.text; //берем текст сообщения
	if (!msg) return; //если его нет останавливаемся
	msg = msg.split(/\s+/g); //превращаем текст в список поделеный на слова
	cmd = msg[0].toLowerCase(); //первое слово - это команда
	let num = +msg[1] || 1; //запрошеное количество
	coin_price(ctx, num, uah, usd, rub, ctx.message.message_id, 'doge');
});

bot.command('btc', (ctx) => {
	let msg = ctx.message.text; //берем текст сообщения
	if (!msg) return; //если его нет останавливаемся
	msg = msg.split(/\s+/g); //превращаем текст в список поделеный на слова
	cmd = msg[0].toLowerCase(); //первое слово - это команда
	let num = +msg[1] || 1; //запрошеное количество
	coin_price(
		ctx,
		num,
		uah_btc,
		usd_btc,
		rub_btc,
		ctx.message.message_id,
		'btc'
	);
});

bot.command('help', (ctx) => {
	help(bot, ctx);
});

bot.command('chart', (ctx) => {
	chart(ctx, chart_data_doge, 'Doge');
});
bot.command('chart_btc', (ctx) => {
	chart(ctx, chart_data_btc, 'BTC');
});
bot.on('message', (ctx) => {
	let msg = ctx.message.text; //берем текст сообщения
	if (!msg) return; //если его нет останавливаемся
	msg = msg.split(/\s+/g); //превращаем текст в список поделеный на слова
	cmd = msg[0].toLowerCase(); //первое слово - это команда
	let num = +msg[1] || 1; //запрошеное количество
	switch (cmd) {
		case 'help':
			help(bot, ctx);
		case 'doge':
			coin_price(ctx, num, uah, usd, rub, ctx.message.message_id, 'doge');
			break;
		case 'btc':
			coin_price(ctx, num, uah, usd, rub, ctx.message.message_id, 'btc');
			break;
		case 'chart_btc':
			chart(ctx, chart_data_btc, 'BTC');
			break;
		case 'chart':
			chart(ctx, chart_data_doge, 'doge');
			break;
	}
});

bot.on('callback_query', (query) => {
	switch (query.update.callback_query.data) {
		///ответ на команду doge
		case 'doge':
			coin_price(
				query,
				1,
				uah,
				usd,
				rub,
				query.update.callback_query.message.message_id,
				'doge'
			);
			break;
		///ответ на команду chart
		case 'chart':
			chart(query, chart_data_doge, 'doge');
			break;
	}
});
bot.launch(); //запускаем бота
