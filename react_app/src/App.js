import { ThemeProvider } from '@emotion/react';
import './App.css';
import DetailTable from './components/detailTable';
import InteractiveList from './components/interactivelist';
import ResponsiveAppBar from './components/responsiveappbar';
import theme from './theme';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <ResponsiveAppBar />
                <div className='container'>
                    <InteractiveList />
                    <DetailTable />
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
