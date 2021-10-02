require('cross-fetch/polyfill');
const axios = require('axios');

exports.handler = async (event) => {
    const options = {
        method: 'GET',
        url: 'https://yh-finance.p.rapidapi.com/auto-complete',
        params: { q: event.arguments.symbol, region: 'US' },
        headers: {
            'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
            'x-rapidapi-key': '9ea30f36b7msh44578fed17f43b8p19d68bjsn7efdcdb2cfae'
        }
    };

    try {
        const { data: { quotes } } = await axios.request(options);
        return quotes.filter(quote => quote.quoteType === 'EQUITY');
    } catch (error) {
        console.log(error);
        return error;
    }
};
