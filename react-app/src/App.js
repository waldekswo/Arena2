import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PokemonDetail from './components/PokemonDetail';
import PokemonList from './components/PokemonList';
import './App.css';

function App() {
  const basename = process.env.PUBLIC_URL || '/';

  return (
    <BrowserRouter basename={basename}>
      <div className="app-shell">
        <header className="app-header">
          <div>
            <p className="label">Interaktywna encyklopedia</p>
            <h1>Pokédex</h1>
          </div>
        </header>
        <main className="content">
          <Routes>
            <Route path="/" element={<PokemonList />} />
            <Route path="/pokemon/:name" element={<PokemonDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
