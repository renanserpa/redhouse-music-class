import React, { useState, useEffect } from 'react';
import App from './App';
import InstitutionalHome from './components/InstitutionalHome';
import PresentationPage from './components/PresentationPage';

export default function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Normalizar caminhos para evitar problemas com barras finais
  const path = currentPath.replace(/\/$/, '') || '/';

  // Braço 1: Portal Institucional (Pai)
  if (path === '/') {
    return <InstitutionalHome />;
  }

  // Braço 2: RedHouse Pública (Apresentação apenas)
  if (path === '/redhouse') {
    return (
      <div className="min-h-screen bg-redhouse-bg overflow-auto">
        <PresentationPage />
        {/* Link escondido para voltar ao portal ou ir pro dev */}
        <div className="fixed bottom-4 right-4 z-50">
           <a href="/" className="text-[8px] font-black uppercase text-white/20 hover:text-white transition-colors">OlieMusic Home</a>
        </div>
      </div>
    );
  }

  // Braço 3: Laboratório Dev (App Completo)
  // Nota: O App.tsx já possui a trava de e-mail que configuramos!
  if (path === '/dev' || path === '/app') {
    return <App />;
  }

  // Fallback para página inicial se a rota não existir
  return <InstitutionalHome />;
}
