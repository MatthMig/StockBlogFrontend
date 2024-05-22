import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';
import StockChart from './StockChart';

function StockPrice({ symbol, stockData, error, isLoading }) {
  const title = `${symbol}'s line chart`;

  let tValues = [];
  let cValues = [];
  const data_available = stockData && Object.prototype.hasOwnProperty.call(stockData, "bars") && stockData.bars !== null;
  if (data_available) {
    tValues = stockData.bars.map(bar => bar.t);
    cValues = stockData.bars.map(bar => bar.c);
  }

  return (
    <div className="stock-price d-flex justify-content-center align-items-center">
      {error && <p>Error: {error}</p>}
      {isLoading ? (
        <Spinner animation="border" role="status" />
      ) : (
        data_available && !error ? (
          <StockChart
            title={title}
            timestamps={tValues}
            prices={cValues}
          />
        ) : null
      )}
    </div>
  );
}

StockPrice.propTypes = {
  symbol: PropTypes.string.isRequired,
  stockData: PropTypes.object,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default StockPrice;