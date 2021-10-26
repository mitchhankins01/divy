require('cross-fetch/polyfill');
const axios = require('axios');

exports.handler = async (event) => {
    const options = {
        method: 'GET',
        url: 'https://yh-finance.p.rapidapi.com/auto-complete',
        params: { q: event.arguments.symbol, region: 'US' },
        headers: {
            'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
            'x-rapidapi-key': process.env.YAHOO_KEY
        }
    };

    try {
        const { data: { quotes } } = await axios.request(options);
        return quotes.filter(quote => quote.quoteType === 'EQUITY' || quote.quoteType === 'ETF');
    } catch (error) {
        console.log(error);
        return error;
    }
};
