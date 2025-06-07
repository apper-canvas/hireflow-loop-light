import HomePage from '@/components/pages/HomePage';
import Pipeline from '../pages/Pipeline';
import Assessments from '../pages/Assessments';
import Interviews from '../pages/Interviews';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

const routes = {
  dashboard: {
    id: 'dashboard',
    path: '/',
    component: HomePage,
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    layout: true
  },
  pipeline: {
    id: 'pipeline',
    label: 'Pipeline',
    path: '/pipeline',
    icon: 'GitBranch',
    component: Pipeline
  },
  assessments: {
    id: 'assessments',
    label: 'Assessments',
    path: '/assessments',
    icon: 'FileText',
    component: Assessments
  },
  interviews: {
    id: 'interviews',
    label: 'Interviews',
    path: '/interviews',
    icon: 'Calendar',
    component: Interviews
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
    component: Reports
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    component: NotFound
  }
};

export const routeArray = Object.values(routes);
export const navRoutes = [routes.pipeline, routes.assessments, routes.interviews, routes.reports, routes.settings];