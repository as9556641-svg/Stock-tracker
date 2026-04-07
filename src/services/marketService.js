const getQuoteFromAlphaVantage = async (symbol) => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ALPHA_VANTAGE_API_KEY");
  }

  const query = new URLSearchParams({
    function: "GLOBAL_QUOTE",
    symbol,
    apikey: apiKey
  });

  const response = await fetch(`https://www.alphavantage.co/query?${query.toString()}`);

  if (!response.ok) {
    throw new Error("Stock quote service is unavailable");
  }

  const data = await response.json();

  if (data.Note) {
    throw new Error("Stock quote rate limit reached. Please try again shortly.");
  }

  if (data["Error Message"]) {
    throw new Error("Invalid stock symbol");
  }

  const quote = data["Global Quote"];
  const rawPrice = quote?.["05. price"];
  const price = Number.parseFloat(rawPrice);

  if (!quote || Number.isNaN(price)) {
    throw new Error("No live price found for this symbol");
  }

  return {
    symbol: quote["01. symbol"] || symbol.toUpperCase(),
    price,
    previousClose: Number.parseFloat(quote["08. previous close"] || "0"),
    changePercent: quote["10. change percent"] || "0%",
    priceUpdatedAt: new Date()
  };
};

module.exports = {
  getQuoteFromAlphaVantage
};
