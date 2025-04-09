import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Protected from './pages/Protected'
import { ReactNode } from 'react'
import NotFound from './pages/404'
import Navbar from './components/Navbar'

const ProtectedRoute: React.FC<{children: ReactNode}> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('access-token') !== null;
  return isAuthenticated ? children : <Navigate to='/login'/>
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/content' element={
          <ProtectedRoute>
            <Protected />
          </ProtectedRoute>
        } />
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
