const inline_keyboard =
[
    [
        {
            text: 'doge',
            callback_data: 'doge'
        }
    ],
    [
        {
            text: 'chart',
            callback_data: 'chart'
        }
    ]
];

const message_text = `
doge <количество> - Текущий курс dogecoin, количество писать не обязательно;
chart - График курса dogecoin за сутки;

`

module.exports = async (bot, ctx) => {
    ctx.reply(message_text, { reply_markup: {inline_keyboard}})
};