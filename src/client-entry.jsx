/* eslint no-restricted-globals: ["error", "event"] */
/* global document */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
 

import App from './App';
import './css/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
        {/* <AppRoutes /> */}
        <App />
      </BrowserRouter>
  </StrictMode>,
)
