import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component scrolls the window to the top every time the route changes.
 * It should be placed inside the Router component, but outside the Routes.
 */
function ScrollToTop() {
  // The useLocation hook returns the location object that represents the current URL.
  const { pathname } = useLocation();

  // The useEffect hook will run this side effect whenever the pathname changes.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // The dependency array ensures this effect runs ONLY when the pathname changes.

  // This component does not render any visible UI, so it returns null.
  return null;
}

export default ScrollToTop;