import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function StockChart({ title, timestamps, prices }) {
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
                display: false,
            },
            title: {
                display: true,
                text: title,
            },
        },
    };

    const labels = timestamps;

    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: prices,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };

    return (
        <Line
            options={options}
            data={data}
        />
    );
}

StockChart.propTypes = {
    title: PropTypes.string.isRequired,
    timestamps: PropTypes.arrayOf(PropTypes.string).isRequired,
    prices: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default StockChart;
