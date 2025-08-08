import React, { Suspense, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProductPage from './pages/productPage';
import HomeProvider from './context/HomeContext';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { Toaster as Toasters  } from "./components/ui/toaster"
import PrivateRoute from './pages/Auth/PrivateRoute';
import Search from './pages/Search';
import ReelsPage from './pages/Reels';
import Form_Perfil from './pages/Profile/form_perfil';
import FullScreenLoader from './components/loaders/FullScreenLoader';
import { useEffect } from 'react';
import RecoveryPasseword from './pages/Auth/RecoveryPasseword';
import Teste from './pages/teste';
import Sellers from './pages/sellers';
import MyProducts from './pages/myproducts';
import CategoryPage from './pages/CategoryPage';
import ProductProvince from './pages/firlterByProvince';
import BestBolada from './pages/bestbolada';
import Pedidos from './pages/pedidos';
import PublicProfile from './pages/Profile/PublicProfile';
import AnimatedBackground from './components/AnimatedBackground';
import Chat from './pages/chat';
import Notificacoes from './pages/notifications';
import Friends from './pages/friends';
import MobileMenu from './pages/mobilemenu';
import Logining from './pages/google/logining';
import SettingsPage from './pages/settings';
import Languages from './pages/languages';
import Help from './pages/help';
import InputSearchMobile from './pages/InputSearchMobile';
import SkAI from './pages/SkAI';
import { Bot, X } from 'lucide-react';
import Policies from './pages/policies';
import OneOrder from './pages/pedidos/pedido';
import Overview from './pages/Overview/index.jsx';
import Layout from './layout/layout';
import Home from './pages/Home/home';
import AdsMore from './components/ads/ads';
import Profile from './pages/Profile';
import Edit from './pages/settings/edit';
import SettingLayout from './layout/settingLayout';
import Privacy from './pages/settings/privacy';
import Blocked from './pages/settings/blocked';
import Comments from './pages/settings/comments';
import Language from './pages/settings/language';
import Verification from './pages/settings/verification';
import Layout2 from './layout/layout2';
import ChatLayout from './layout/ChatLayout';
import PublicationsPage from './pages/PublicationsPage';
import { WebSocketProvider } from './context/websoketContext';
import WalletPage from './pages/Wallet/index';
import Security from './pages/settings/security';
import PasswordSettings from './pages/settings/password';
import MeusAnuncios from './pages/MeusAnuncios';

function App() {
  

  return (
    <Router>
      <LoadingProvider>
        <div className="relative min-h-screen ">
          <Toaster position="top-right" />
          <AnimatedBackground/>
          <Toasters/>
          <AuthProvider>
            <HomeProvider>
              <WebSocketProvider>
              <Suspense fallback={<FullScreenLoader />}>
                <Routes>
                  {/* Auth Routes */}
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/recovery-password" element={<RecoveryPasseword />} />
                  <Route path="/auth/success" element={<Logining/>} />
                   
                  {/* Public Routes */}
                  <Route path="/" element={<Layout><Home/></Layout>} />
                  <Route path="/search" element={<Layout><Search /></Layout>} />
                  <Route path="/reels" element={<Layout header={false}><ReelsPage/></Layout>} />
                  <Route path="/post/:slug" element={<Layout><ProductPage /></Layout>} />
                  <Route path="/produtos/:categoria/:subcategoria" element={<CategoryPage/>} />
                  <Route path="/nhonguistas" element={<Layout><Layout2><Sellers/></Layout2></Layout>} />
                  <Route path="/p/:province" element={<Layout><ProductProvince/></Layout>} />
                  <Route path="/melhores-boladas" element={<Layout><Layout2><BestBolada/></Layout2></Layout>} />
                  <Route path="/posts" element={<Layout><Layout2><PublicationsPage/></Layout2></Layout>} />
                  <Route path="/notifications" element={<Layout><Notificacoes/></Layout>} /> 
                  <Route path="/menu" element={<Layout><MobileMenu/></Layout>} />
                  <Route path="/languages" element={<Languages/>} />
                  <Route path="/skai" element={<Layout header={false}><SkAI/></Layout>} />
                  <Route path="/policies" element={<Layout header={false}><Layout2><Policies/></Layout2></Layout>} />
                  <Route path="/help" element={<Help/>} />
                  <Route path="/teste" element={<Teste/>} />
                  <Route path="/wallet" element={
                    <PrivateRoute>
                      <Layout>
                        <Layout2>
                          <WalletPage />
                        </Layout2>
                      </Layout>
                    </PrivateRoute>
                  } />

                  <Route path="/m/search" element={<InputSearchMobile/>} />
                  
                  {/* Protected Routes */}
                  <Route path="/chat" element={<PrivateRoute><ChatLayout><Chat/></ChatLayout></PrivateRoute>} />
                  <Route path="/overview" element={
                    <PrivateRoute>
                      <Layout>
                        <Layout2>
                          <Overview />
                        </Layout2>
                      </Layout>
                    </PrivateRoute>
                  } />
                  <Route path="/:username" element={<PrivateRoute><Layout header={false}><Layout2><Profile/></Layout2></Layout></PrivateRoute>} />
                  <Route path="/settings" element={<PrivateRoute><SettingsPage/></PrivateRoute>} />
                  <Route path="/friends" element={<PrivateRoute><Layout><Friends/></Layout></PrivateRoute>} />
                  <Route path="/pedidos" element={<PrivateRoute><Layout><Layout2><Pedidos/></Layout2></Layout></PrivateRoute>} />
                  <Route path="/produtos" element={<PrivateRoute><Layout><Layout2><MyProducts/></Layout2></Layout></PrivateRoute>} />
                  <Route path="/ads" element={<PrivateRoute><Layout><Layout2><MeusAnuncios/></Layout2></Layout></PrivateRoute>} />
                  <Route path="/:username/seguidores" element={<PrivateRoute><Layout header={false}><Layout2><Profile/></Layout2></Layout></PrivateRoute>} />
                  <Route path="/:username/orders" element={<PrivateRoute><Layout header={false}><Layout2><Profile/></Layout2></Layout></PrivateRoute>} />
                  <Route path="/:username/publicacoes" element={<PrivateRoute><Layout header={false}><Layout2><Profile/></Layout2></Layout></PrivateRoute>} />
                  <Route path="/accounts/edit/" element={<PrivateRoute><Layout header={false}><SettingLayout><Edit/></SettingLayout></Layout></PrivateRoute>} />
                  <Route path="/accounts/notifications/" element={<PrivateRoute><Layout header={false}><SettingLayout><Notificacoes/></SettingLayout></Layout></PrivateRoute>} />
                  <Route path="/accounts/privacy/" element={<PrivateRoute><Layout header={false}><SettingLayout><Privacy/></SettingLayout></Layout></PrivateRoute>} />
                  <Route path="/accounts/blocked/" element={<PrivateRoute><Layout header={false}><SettingLayout><Blocked/></SettingLayout></Layout></PrivateRoute>} />
                  <Route path="/accounts/comments/" element={<PrivateRoute><Layout header={false}><SettingLayout><Comments/></SettingLayout></Layout></PrivateRoute>} />
                  <Route path="/accounts/language/" element={<PrivateRoute><Layout header={false}><SettingLayout><Language/></SettingLayout></Layout></PrivateRoute>} />
                  <Route path="/accounts/verification/" element={<PrivateRoute><Layout header={false}><SettingLayout><Verification/></SettingLayout></Layout></PrivateRoute>} />          
                  <Route path="/settings/security" element={<PrivateRoute><Layout header={false}><SettingLayout><Security/></SettingLayout></Layout></PrivateRoute>} />
                  <Route path="/settings/password" element={<PrivateRoute><Layout header={false}><SettingLayout><PasswordSettings/></SettingLayout></Layout></PrivateRoute>} />
                  <Route path="/pedido/:id" element={<PrivateRoute><Layout><Layout2><OneOrder/></Layout2></Layout></PrivateRoute>} />
                  <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
                  <Route path="/profile/review" element={<PrivateRoute><Layout header={false}><SettingLayout><Form_Perfil /></SettingLayout></Layout></PrivateRoute>} />
                  
                </Routes>
              </Suspense>
              </WebSocketProvider>
            </HomeProvider>
          </AuthProvider>
        </div>
      </LoadingProvider>
    </Router>
  );
}

export default App;