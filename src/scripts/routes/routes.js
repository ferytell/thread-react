import RegisterPage from '../pages/auth/register/register-page';
import LoginPage from '../pages/auth/login/login-page';
import HomePage from '../pages/home/home-page';
//import BookmarkPage from '../pages/bookmark/bookmark-page';
//import ReportDetailPage from '../pages/report-detail/report-detail-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page';
//import NewPage from '../pages/new/new-page';
import NewStoryPage from '../pages/new/new-story-page';
import InDEvelopmentPage from '../pages/story-detail/story-detail-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';

export const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  '/': () => checkAuthenticatedRoute(new HomePage()),
  //'/new': () => checkAuthenticatedRoute(new NewPage()),
  '/add': () => checkAuthenticatedRoute(new NewStoryPage()),
  '/stories/:id': () => checkAuthenticatedRoute(new StoryDetailPage()),
  '/my-stories': () => checkAuthenticatedRoute(new InDEvelopmentPage()),
};
