import { ThemeProvider } from '@emotion/react';
import './App.css';
import DetailTable from './components/DetailTable';
import InteractiveList from './components/Interactivelist';
import ResponsiveAppBar from './components/AppBar';
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
