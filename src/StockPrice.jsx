import { useEffect, useState } from 'react';

function StockPrice() {
  const [stockPrice, setStockPrice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'APCA-API-KEY-ID': 'YOUR_API_KEY_ID',
            'APCA-API-SECRET-KEY': 'YOUR_API_SECRET_KEY'
          }
        };
        
        const response = await fetch('https://data.alpaca.markets/v2/stocks/quotes?symbols=AAPL%2CTSLA&start=2024-01-03T00%3A00%3A00Z&end=2024-01-04T09%3A30%3A00-04%3A00&limit=3&feed=iex&sort=asc', options);
        const data = await response.json();
        setStockPrice(data.quotes.AAPL['0'].bp);        
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="stock-price">
      {error && <p>Error: {error}</p>}
      {stockPrice && <p>Stock Price: ${stockPrice}</p>}
      {!stockPrice && !error && <p>Loading...</p>}
    </div>
  );
}

export default StockPrice;
