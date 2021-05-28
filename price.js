const fetch = require("node-fetch");

module.exports = async (ctx, num, uah, usd, rub) => {
    const [
        [ { current_price: uah_price } ],
        [ { current_price: usd_price } ],
        [ { current_price: rub_price } ],
        [ { price_change_percentage_1h_in_currency: price_change_1h } ],
        [ { price_change_percentage_24h_in_currency: price_change_24h } ],
        [ { price_change_percentage_7d_in_currency: price_change_7d } ],
        [ { price_change_percentage_14d_in_currency: price_change_14d } ],
        [ { price_change_percentage_30d_in_currency: price_change_30d } ],
        [ { price_change_percentage_1y_in_currency: price_change_1y } ]

    ] = await Promise.all([fetch(uah), fetch(usd), fetch(rub), fetch(uah), fetch(uah), fetch(uah), fetch(uah), fetch(uah), fetch(uah)])
    .then(responses => Promise.all(responses.map(res => res.json())));


    const sentMsg = await ctx.reply(
        `${num} doge → rub: ${(rub_price * num).toFixed(3)}₽ \n` +
        `${num} doge → uah: ${(uah_price * num).toFixed(3)}₴ \n` +
        `${num} doge → usd: ${(usd_price * num).toFixed(3)}$ \n` +
        '➖➖➖➖➖➖➖➖➖➖➖➖➖\n' +
        `Price change \n` +
        `1hour:    ${price_change_1h<0 ? '🔴' : '🟢'}${Math.abs(price_change_1h).toFixed(3)}% \n` +
        `1day:      ${price_change_24h<0 ? '🔴' : '🟢'}${Math.abs(price_change_24h).toFixed(3)}% \n` +
        `7days:    ${price_change_7d<0 ? '🔴' : '🟢'}${Math.abs(price_change_7d).toFixed(3)}% \n` +
        `14days:  ${price_change_14d<0 ? '🔴' : '🟢'}${Math.abs(price_change_14d).toFixed(3)}% \n` +
        `1month: ${price_change_30d<0 ? '🔴' : '🟢'}${Math.abs(price_change_30d).toFixed(3)}% \n` +
        `1year:     ${price_change_1y<0 ? '🔴' : '🟢'}${Math.abs(price_change_1y).toFixed(3)}% \n` 
    );

    setTimeout(() => {
        ctx.deleteMessage(ctx.message_id);
        ctx.deleteMessage(sentMsg.message_id);
    }, 10e3); 
}; 