import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

console.log('Main: Starting app mount');
try {
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
  );
  console.log('Main: App mount called');
} catch (e) {
  console.error('Main: Error mounting app:', e);
}
