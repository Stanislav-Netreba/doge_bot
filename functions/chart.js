const { ChartJSNodeCanvas } = require('chartjs-node-canvas'); //импортируем библиотеку для создания графиков
const fs = require('fs'); //имортируем файловую систему
const fetch = require('node-fetch'); //импортируем fetch

module.exports = async (ctx, chart, coin_name, del_message_id) => {
	ctx.deleteMessage(del_message_id);

	const { prices } = await fetch(chart).then((res) => res.json()); //получаем масив цены
	const { market_caps } = await fetch(chart).then((res) => res.json()); //получаем масив капитализации

	const dogePriceChart = new ChartJSNodeCanvas({ width: 1000, height: 500 }); //создаем канвас графика

	let ut = (timestamp) => {
		//функция для преобразования unix время в обычное
		let d = new Date(timestamp); //задаем наше время
		let hours = d.getHours(); //конвертируем в часы
		let minutes = d.getMinutes(); //конвертируем в минуты
		let timeStampCon =
			(hours <= 9 ? `0${hours}` : `${hours}`) +
			':' +
			(minutes <= 9 ? `0${minutes}` : `${minutes}`); //склеиваем и получаем время
		return timeStampCon;
	};

	let unix = Date.now(); //создаем пременную с уникальным id для каждой картинки графика

	let array_of_prices = []; //тут будут все цены
	let array_of_market_caps = []; //тут будут вся капитализация
	let dates = []; //тут будут время для каждой цены

	prices.forEach((element) => {
		array_of_prices.push(element[1]); //собираем все цены в масив
	});
	market_caps.forEach((element) => {
		array_of_market_caps.push(element[1]); //собираем всю рыночную капитализацию в масив
	});
	prices.forEach((element) => {
		dates.push(ut(element[0])); //собираем все даты в масив
	});
	await (async () => {
		const image_price = await dogePriceChart.renderToBuffer({
			//создаем переменную image в которой будет буфер картинки графика
			type: 'line', //линейный тип графика
			data: {
				labels: dates,
				datasets: [
					{
						label: `${coin_name} price`,
						data: array_of_prices, //задаем масив цен как данные для графика
						pointBorderColor: 'transparent', //убираем точки с графика
						pointBackgroundColor: 'transparent', //убираем точки с графика
						borderColor: [
							coin_name == 'BTC'
								? 'rgba(255,77,0,256)'
								: 'rgba(255,99,132,256)', //задаем розоватый цвет линии графика
						],
						borderWidth: 3, //толщина линии - 3 пикселя
					},
				],
			},
		});
		await fs.writeFileSync(`./images/${unix}_price.png`, image_price); //записываем буфер в картинку
	})();
	let a = await ctx.replyWithPhoto(
		{
			//отправляем пользователю картинку с графиком
			source: `./images/${unix}_price.png`,
		},
		{
			caption: 'Author: @Stas_Netreba \nОткрыт для заказов',
		}
	);

	let st = await setTimeout(() => {
		//удаление сообщений спустя время
		ctx.deleteMessage(a.message_id);
	}, 60 * 1e3);

	fs.unlinkSync(`./images/${unix}_price.png`); //удаление картинки для экономии памяти
};
