module.exports = async (bot, ctx) => {
    ctx.replyWithMarkdown(
`
**doge <количество>** - Текущий курс dogecoin, количество писать не обязательно;
**chart** - График курса dogecoin за сутки;

`
    );
};