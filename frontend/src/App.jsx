import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from './pages/dashboard';
import SignUpPage from './pages/signupPage'
import Verify from './pages/verify';
import CreateInterview from './pages/create-interview'
import SignInPage from './pages/signinPage';
import UserNavigate from './components/userNavigate'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<UserNavigate />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/create-interview' element={<CreateInterview />} />

          <Route path='/create-interview/:id' element={<CreateInterview />} />


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
