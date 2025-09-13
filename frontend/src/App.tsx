import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [token, setToken] = useState('');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');

  const handleLogin = async () => {
    const res = await axios.post('http://localhost:8000/login', null, {
      params: { username: 'auditor', password: 'password' }
    });
    setToken(res.data.access_token);
  };

  const handleQuery = async () => {
    const res = await axios.post('http://localhost:8000/query', null, {
      params: { query },
      headers: { Authorization: `Bearer ${token}` }
    });
    setResult(JSON.stringify(res.data, null, 2));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Evidence-on-Demand Bot</h1>
      <button onClick={handleLogin}>Login (Demo)</button>
      <br /><br />
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ask a question" style={{width: '300px'}}/>
      <button onClick={handleQuery}>Send</button>
      <pre>{result}</pre>
    </div>
  );
};

export default App;
