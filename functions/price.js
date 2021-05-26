const fetch = require("node-fetch");

module.exports = async(ctx, num, uah, usd, rub) => {
    fetch(uah)
    .then(res => res.json())
    .then(json => {
        let uah_price = json[0].current_price;
        fetch(usd)
        .then(res => res.json())
        .then(json => {
            let usd_price = json[0].current_price;
            fetch(rub)
            .then(res => res.json())
            .then(json => {
                let rub_price = json[0].current_price;
                let a = ctx.reply(`${num} doge → rub: ${rub_price*num}₽ \n${num} doge → uah: ${uah_price*num}₴ \n${num} doge → usd: ${usd_price*num}$`)
                a.then(a=>{
                    let st = setTimeout(() => {
                        ctx.deleteMessage(ctx.message_id);
                        ctx.deleteMessage(a.message_id);
                    }, 10*1e3);
                    
                });
            });
        });
    });


};