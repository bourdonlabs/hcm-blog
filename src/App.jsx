import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ArticlePage from './pages/ArticlePage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import AdvertisePage from './pages/AdvertisePage.jsx'
import SubmitTipPage from './pages/SubmitTipPage.jsx'
import AdminGeneratorPage from './pages/AdminGeneratorPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/advertise" element={<AdvertisePage />} />
      <Route path="/submit-tip" element={<SubmitTipPage />} />
      <Route path="/admin/generator" element={<AdminGeneratorPage />} />
      <Route path="/:slug" element={<ArticlePage />} />
    </Routes>
  )
}
