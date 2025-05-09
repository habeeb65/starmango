import React from 'react';
import ReactDOM from 'react-dom/client';
import { initApp } from './initApp';
import './index.css';

// Initialize app with all providers and proper multi-tenant isolation
const appComponent = initApp();

ReactDOM.createRoot(document.getElementById('root')!).render(appComponent);
