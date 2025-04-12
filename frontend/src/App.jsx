import './App.css';
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from './components/ForgotPassword';
import { ThemeProvider } from './context/ThemeContext';
import HomeLayout from './pages/HomeLayout';
import HomeMain from './pages/HomeMain';
import Features from './components/Features';
import Feedback from './components/Feedback';
import Settings from './components/Settings';
import GenerateCaption from './components/GenerateCaption';
import CaptionTrain from './components/CaptionTrain';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/generate_caption" element={<GenerateCaption />} />
          <Route path="/caption_train" element={<CaptionTrain />} />

          {/* Nested routes under /home */}
          <Route path="/home" element={<HomeLayout />}>
            <Route index element={<HomeMain />} />
            <Route path="features" element={<Features />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
