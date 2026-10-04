import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import IntroGate from "./components/IntroGate";
import ErrorBoundary from "./components/ErrorBoundary";

const MainContainer = lazy(() => import("./components/MainContainer"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Home = () => (
  <IntroGate>
    <Suspense>
      <MainContainer />
    </Suspense>
  </IntroGate>
);

/** Sub-pages use native scrolling; start each one at the top. */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname !== "/") window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/projects"
          element={
            <Suspense>
              <ProjectsPage />
            </Suspense>
          }
        />
        <Route
          path="/projects/:slug"
          element={
            <Suspense>
              <ProjectPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
    {/* Vercel visitor and page-view counts (only reports on the live site) */}
    <Analytics />
  </ErrorBoundary>
);

export default App;
