import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Chat from '../components/Chat';
import SearchBar from "../components/SearchBar";
import StockPrice from "../components/StockPrice";
import TopBar from "../components/TopBar";
import { fetchBars, fetchSymbols } from '../components/api';
import { getTokens } from '../components/auth';

function HomePage() {
    const [symbolsData, setSymbolsData] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [stockData, setStockData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {   
        const fetchSymbolsData = async () => {
            try {
                const data = await fetchSymbols();
                setSymbolsData(data);
            } catch (error) {
                setError(error);
            }
        };
        fetchSymbolsData();
    }, []);

    const { token, role, username } = getTokens();

    const isLoggedIn = Boolean(token);

    const handleAssetSelect = async (asset) => {
        setSelectedAsset(asset);
        setIsLoading(true);
        try {
            const data = await fetchBars(asset);
            setStockData(data);
        } catch (error) {
            setError(error);
        }
        setIsLoading(false);
    };

    return (
        <>
            <header>
                <TopBar isLoggedIn={isLoggedIn} username={username} role={role} />
            </header>
            <main>
                <Container fluid>
                    <Row>
                        <Col xs={12} md={8}>
                            <SearchBar onAssetSelect={handleAssetSelect} symbolsData={symbolsData} />
                            {selectedAsset && <StockPrice symbol={decodeURIComponent(selectedAsset.symbol)} stockData={stockData} error={error} isLoading={isLoading} />}
                        </Col>
                        <Col xs={12} md={4}>
                            {<Chat asset={selectedAsset} />}
                        </Col>
                    </Row>
                </Container>
            </main>
        </>
    );
}

export default HomePage;
