import { Outlet } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Admin from './pages/Admin';

function App() {
  return (
    < >
     {/* <Admin/> */}
     <Outlet />
     <Footer/>
    </>
  );
}

export default App;
