import React from 'react';
import ReactDOM from 'react-dom/client';
import { Footer, Navbar} from './pages/layout';
import { Manage_tasks } from './pages/manage_tasks';
import { Timeline_tasks } from './pages/Timeline_tasks';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  return(
    <>
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Manage_tasks/>}/>
        <Route path="/Timeline_tasks" element={<Timeline_tasks/>}/>
      </Routes>
    <Footer />
    </BrowserRouter>
    
    </>
    
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


