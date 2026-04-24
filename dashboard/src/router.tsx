import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Overview } from './pages/Overview';
import { Leads } from './pages/Leads';
import { Emails } from './pages/Emails';
import { Settings } from './pages/Settings';
import { BusinessOverview } from './pages/BusinessOverview';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Overview /> },
      { path: 'business', element: <BusinessOverview /> },
      { path: 'leads', element: <Leads /> },
      { path: 'emails', element: <Emails /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);
