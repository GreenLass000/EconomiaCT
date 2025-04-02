import React, { useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import './App.css';

import theme from './theme';
import DetailTable from './components/DetailTable';
import InteractiveList from './components/Interactivelist';
import ResponsiveAppBar from './components/AppBar';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refetchData = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <ResponsiveAppBar onRefresh={refetchData} />
        <div className="container">
          <InteractiveList refreshKey={refreshKey} />
          <DetailTable key={refreshKey} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
