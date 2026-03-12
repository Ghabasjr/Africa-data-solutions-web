import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Landing from './pages/Landing'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

import Profile from './pages/account/Profile'
import Upgrade from './pages/account/Upgrade'
import KYC from './pages/account/KYC'
import PinManagement from './pages/account/PinManagement'
import ChangePassword from './pages/account/ChangePassword'

import FundWallet from './pages/services/FundWallet'
import BuyData from './pages/services/BuyData'
import BuyAirtime from './pages/services/BuyAirtime'
import Bills from './pages/services/Bills'

import Transactions from './pages/other/Transactions'
import WalletSummary from './pages/other/WalletSummary'
import Others from './pages/other/Others'
import Pricing from './pages/other/Pricing'
import Settings from './pages/other/Settings'

import DashboardLayout from './components/DashboardLayout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboard Routes with Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Account Pages */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/pin-management" element={<PinManagement />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Service Pages */}
          <Route path="/fund-wallet" element={<FundWallet />} />
          <Route path="/buy-data" element={<BuyData />} />
          <Route path="/buy-airtime" element={<BuyAirtime />} />
          <Route path="/bills/:type" element={<Bills />} />

          {/* Other Pages */}
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/wallet-summary" element={<WalletSummary />} />
          <Route path="/others/:type" element={<Others />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/pricing" element={<Pricing />} />
        </Route>
        {/* Add more routes as we build them */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
