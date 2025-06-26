import RegisterPage from '../pages/auth/register/register-page';
import LoginPage from '../pages/auth/login/login-page';
import HomePage from '../pages/home/home-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page';
import NewStoryPage from '../pages/new/new-story-page';
import InDEvelopmentPage from '../pages/story-detail/story-detail-page';
import NotFoundPage from '../pages/404/404-page';
import BookmarksPage from '../pages/bookmarks/bookmarks-page';

import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';

export const routeHandlers = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/add': () => checkAuthenticatedRoute(new NewStoryPage()),
  '/bookmarks': () => checkAuthenticatedRoute(new BookmarksPage()),
  '/stories/:id': () => checkAuthenticatedRoute(new StoryDetailPage()),
  '/my-stories': () => checkAuthenticatedRoute(new InDEvelopmentPage()),
};

export const routes = {
  getPage: (url) => {
    // Check exact matches first
    if (routeHandlers[url]) {
      return routeHandlers[url]();
    }

    // Check for dynamic routes (like /stories/:id)
    const urlSegments = url.split('/');
    for (const [routePath, handler] of Object.entries(routeHandlers)) {
      const routeSegments = routePath.split('/');

      if (routeSegments.length === urlSegments.length) {
        const params = {};
        let isMatch = true;

        for (let i = 0; i < routeSegments.length; i++) {
          if (routeSegments[i].startsWith(':')) {
            params[routeSegments[i].substring(1)] = urlSegments[i];
          } else if (routeSegments[i] !== urlSegments[i]) {
            isMatch = false;
            break;
          }
        }

        if (isMatch) {
          return handler(params);
        }
      }
    }

    // No match found, return 404 page
    return new NotFoundPage();
  },
};
