import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from "react-router-dom/server";


import App from './App.tsx'; 

import'./css/index.css';

export function render(url, context) {
  return ReactDOMServer.renderToString(
    <StaticRouter location={url} context={context}>
      {/* <AppRoutes /> */}
      <App />
    </StaticRouter>
  )
}
