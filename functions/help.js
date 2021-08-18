const inline_keyboard = [
    [
        {
            text: 'doge',
            callback_data: 'doge',
        },
    ],
    [
        {
            text: 'chart',
            callback_data: 'chart',
        },
    ],
];

const message_text = `
*doge* <количество> - Текущий курс dogecoin, количество писать не обязательно;
*chart* - График курса dogecoin за сутки;
*btc* <количество> - Текущий курс bitcoin, количество писать не обязательно;
*chart_btc* - График курса bitcoin за сутки;`;

module.exports = async (bot, ctx, del_message_id) => {
    ctx.deleteMessage(del_message_id);
    ctx.replyWithMarkdown(message_text, {
        reply_markup: { inline_keyboard },
    });
};
