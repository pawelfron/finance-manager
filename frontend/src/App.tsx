import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import { ReactNode, useContext } from 'react'
import NotFound from './pages/404'
import Navbar from './components/Navbar'
import Unauthorized from './pages/401'
import { AuthContext, AuthProvider } from './AuthContext'
import Account from './pages/Account'
import Categories from './pages/Categories'
import Dashboard from './pages/Dashboard'
import Table from './pages/Table'
import Analysis from './pages/Analysis'

const ProtectedRoute: React.FC<{children: ReactNode}> = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? children : <Unauthorized />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className='container-fluid'>
          <div className='row min-vh-100'>
            <Navbar />

            <div className='col'>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/dashboard' element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path='/table' element={
                  <ProtectedRoute>
                    <Table />
                  </ProtectedRoute>
                } />
                <Route path='/analysis' element={
                  <ProtectedRoute>
                    <Analysis />
                  </ProtectedRoute>
                } />
                <Route path='/categories' element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                } />
                <Route path='/account' element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } />
                <Route path='*' element={<NotFound />}/>
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
