import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Form from './pages/Form';
import Verification from './pages/Verification';
import MinistryOverride from './components/MinistryOverride';
import DiagnosticsPanel from './components/DiagnosticsPanel';
import SoundToggle from './components/SoundToggle';
import CursorChaos from './components/CursorChaos';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0a0a0a',
            color: '#00ff41',
            border: '1px solid #00ff41',
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '12px',
          },
        }}
      />

      {/* Global persistent overlays */}
      <MinistryOverride />
      <DiagnosticsPanel />
      <SoundToggle />
      <CursorChaos />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<Form />} />
        <Route path="/verification" element={<Verification />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

