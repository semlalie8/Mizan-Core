import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import MurabahaPage from './pages/MurabahaPage';
import TakafulPage from './pages/TakafulPage';
import MudarabaPage from './pages/MudarabaPage';
import MusharakaPage from './pages/MusharakaPage';
import IjarahPage from './pages/IjarahPage';
import WaqfPage from './pages/WaqfPage';
import SukukPage from './pages/SukukPage';
import IntelligencePage from './pages/IntelligencePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<MurabahaPage />} />
            <Route path="/mudaraba" element={<MudarabaPage />} />
            <Route path="/musharaka" element={<MusharakaPage />} />
            <Route path="/ijarah" element={<IjarahPage />} />
            <Route path="/takaful" element={<TakafulPage />} />
            <Route path="/waqf" element={<WaqfPage />} />
            <Route path="/sukuk" element={<SukukPage />} />
            <Route path="/intelligence" element={<IntelligencePage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
