import './App.css';
import DetailTable from './components/detailTable';
import InteractiveList from './components/interactivelist';
import ResponsiveAppBar from './components/responsiveappbar';

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar />
      <div className='container'>
        <InteractiveList />
        <DetailTable />
      </div>
    </div>
  );
}

export default App;
