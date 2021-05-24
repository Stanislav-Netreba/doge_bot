const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fetch = require("node-fetch");
const fs = require('fs')
const { Telegraf } = require('telegraf');

const bot = new Telegraf(token);

bot.on('message', ctx=>{

    if(ctx.message.text != 'chart') return

    const width = 800; //px
    const height = 400; //px
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    function ut (timestamp) {
        var d = new Date(timestamp);
        timeStampCon = d.getDate() + '.' + (d.getMonth()) + '.' + d.getFullYear();

        return timeStampCon;
    };

    fetch('https://api.coingecko.com/api/v3/coins/dogecoin/market_chart?vs_currency=usd&days=14&interval=daily')
    .then(res => res.json())
    .then(json => {
        var prices = [];
        var dates = [];
        json.prices.forEach(element => { 
            prices.push(element[1]) 
        });
        json.prices.forEach(element => { 
            dates.push(ut(element[0])) 
        });
        (async () => {
            const configuration = {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Doge price',
                        data: prices,
                        backgroundColor: [
                            'rgba(255, 99, 132, 256)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,256)'
                        ],
                        borderWidth: 1
                    }]
                },
                plugins:  {
                    id: 'custom_canvas_background_color',
                    beforeDraw: (chart) => {
                    const ctx = chart.canvas.getContext('2d');
                    ctx.save();
                    ctx.globalCompositeOperation = 'destination-over';
                    ctx.fillStyle = 'lightGreen';
                    ctx.fillRect(0, 0, chart.width, chart.height);
                    ctx.restore();
                    }
                } 
                
            };
            const image = await chartJSNodeCanvas.renderToBuffer(configuration);
            
            fs.writeFileSync(`./tmp.png`, image)
        }) (); 
    });
    ctx.replyWithPhoto({
        source: './tmp.png'
    })
});

bot.launch();