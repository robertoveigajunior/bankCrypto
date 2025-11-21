import React, { useState } from 'react';
import { useApiKey } from '../context/ApiKeyContext';

const ApiKeyModal: React.FC = () => {
  const { apiKey, setApiKey } = useApiKey();
  const [input, setInput] = useState(apiKey);
  const [show, setShow] = useState(!apiKey);
  const [remember, setRemember] = useState(true); // Novo: opção de lembrar

  const handleSave = () => {
    setApiKey(input.trim());
    if (remember) {
      localStorage.setItem('coingeckoApiKey', input.trim());
    } else {
      localStorage.removeItem('coingeckoApiKey');
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#222', padding: 32, borderRadius: 8, minWidth: 320, color: '#fff', boxShadow: '0 2px 16px #0008' }}>
        <h2>CoinGecko API Key</h2>
        <p>Informe sua chave de API do CoinGecko para acessar notícias e dados.</p>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="CG-..."
          style={{ width: '100%', padding: 8, margin: '16px 0', borderRadius: 4, border: '1px solid #555' }}
        />
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 14 }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Lembrar esta chave neste dispositivo
          </label>
        </div>
        <button onClick={handleSave} style={{ padding: '8px 24px', borderRadius: 4, background: '#00ff88', color: '#222', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          Salvar
        </button>
      </div>
    </div>
  );
};

export default ApiKeyModal;
