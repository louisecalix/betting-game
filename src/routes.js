import { createRoutesFromElements, Route } from 'react-router-dom';
import App from './App';

const routes = createRoutesFromElements(
  <Route path="/*" element={<App />} />
);

export default routes;
