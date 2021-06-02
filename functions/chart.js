const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');
const fetch = require("node-fetch");


module.exports = async (ctx, chart) =>{
    
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 1000, height: 500 });

    function ut (timestamp) {
        let d = new Date(timestamp);
        let hours = d.getHours() 
        let minutes = d.getMinutes();
        let timeStampCon = (hours<=9 ? `0${hours}` : `${hours}`) + ':' + (minutes<=9 ? `0${minutes}` : `${minutes}`)
        return timeStampCon;
    };

    let unix = Date.now();

    let prices = [];
    let dates = [];
    
    fetch(chart)
    .then(res => res.json())
    .then(async json => {
        
        json.prices.forEach(element => { 
            prices.push(element[1]) 
        });
        json.prices.forEach(element => { 
            dates.push(ut(element[0])) 
        });
        let func = async () => {
            const image = await chartJSNodeCanvas.renderToBuffer({
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Doge price',
                        data: prices,
                        pointBorderColor: 'transparent',
                        pointBackgroundColor: 'transparent',
                        borderColor: [
                            'rgba(255,99,132,256)'
                        ],
                        borderWidth: 3
                    }]
                }
            });
            await fs.writeFileSync(`./images/${unix}_c.png`, image)
        } 
        
        await func()

        let a = await ctx.replyWithPhoto({
            source: `./images/${unix}_c.png`
        });

        
        let st = setTimeout(() => {
            ctx.message_id && ctx.deleteMessage(ctx.message_id);
            ctx.deleteMessage(a.message_id);
        }, 60*1e3);  
        

        fs.unlinkSync(`./images/${unix}_c.png`)
    });
    
};