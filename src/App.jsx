// import { useState } from 'react';
// import { Register } from './components/Register';
// import { Login } from './components/Login';
// import { Dashboard } from './components/Dashboard';

// export default function App() {
//   const [page, setPage] = useState('login'); 

//   return (
//     <>
//       {page === 'register' && <Register />}
//       {page === 'login' && <Login onLogin={() => setPage('dashboard')} onRegisterClick={() => setPage('register')} />}
//       {page === 'dashboard' && <Dashboard />}
//     </>
//   );
// }

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { Register } from './components/Register';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [page, setPage] = useState('loading'); // loading مؤقت قبل التحقق
  // eslint-disable-next-line no-unused-vars
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setPage('dashboard');
      } else {
        setPage('login');
      }
    };
    getSession();

    // الاستماع لتغيرات الجلسة
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setPage(session ? 'dashboard' : 'login');
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (page === 'loading') return <div>جاري التحميل...</div>;

  return (
    <>
      {page === 'register' && <Register onBackToLogin={() => setPage('login')} />}
      {page === 'login' && <Login 
        onLogin={() => setPage('dashboard')} 
        onRegisterClick={() => setPage('register')} 
      />}
      {page === 'dashboard' && (
        <Dashboard 
          onLogout={async () => {
            await supabase.auth.signOut();
            setPage('login');
          }} 
        />
      )}
    </>
  );
}
