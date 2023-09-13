import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../../App.css'
import Header from '../Header';
import Landing from '../Landing';
import Footer from '../Footer';
import Welcome from '../Welcome';
import Login from '../Login';
import Signup from '../Signup';
import ErrorPage from '../ErrorPage';
import ForgetPassword from '../ForgetPassword';
import { IconContext } from 'react-icons';
function App() {
  return (
    <Router>
      <IconContext.Provider value={{ style:{verticalAlign: 'middle'}}}>
        <Header />

          <Routes>
            <Route path='/' element={<Landing/>}/>
            <Route path='/welcome' element={<Welcome/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path="*" element={<ErrorPage/>}/>
            <Route path="/forgetpassword" element={<ForgetPassword />}/>

          </Routes>
        
        
        <Footer />
      </IconContext.Provider>
    </Router>
  );
}

export default App;
