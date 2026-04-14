import { useState, useEffect } from 'react'
import axios from 'axios'
import { Flower, CheckCircle, Send, Instagram, MapPin, Globe } from 'lucide-react'
import { translations } from './translations' // Importamos el archivo que acabas de crear

const API_URL = import.meta.env.VITE_API_URL;
const CDN_URL = import.meta.env.VITE_CDN_URL;

function App() {
  // 1. ESTADO DE IDIOMA
  // Detecta si el navegador está en español, si no, pone inglés por defecto
  const [lang, setLang] = useState(navigator.language.startsWith('es') ? 'es' : 'en');
  
  // Variable auxiliar para los textos estáticos (Navbar, Form, etc.)
  const t = translations[lang];

  // 2. ESTADO DE DATOS (FOTOS)
  const [portfolioItems, setPortfolioItems] = useState([]);
  
  // 3. ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', description: '' });
  const [status, setStatus] = useState('idle'); 
  const [orderId, setOrderId] = useState('');

  // --- EFECTO: CARGAR DATOS DE S3 AL INICIAR ---
  useEffect(() => {
    // Descarga el archivo data.json que subimos a S3
    fetch(`${CDN_URL}/data/data.json`)
      .then(response => response.json())
      .then(data => setPortfolioItems(data))
      .catch(error => console.error("Error cargando portafolio:", error));
  }, []);

  // Función para cambiar idioma
  const toggleLang = () => setLang(prev => prev === 'es' ? 'en' : 'es');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const payload = { ...formData, language: lang };
      const response = await axios.post(API_URL, payload);
      setOrderId(response.data.orderId);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', description: '' });
    } catch (error) {
      console.error("Error:", error);
      setStatus('error');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-roseta-bg font-sans text-gray-800">
      
      {/* --- NAVBAR --- */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-50 transition-all">
        <div className="flex items-center gap-2 text-roseta-primary font-bold text-2xl tracking-tighter">
          <Flower className="w-8 h-8" />
          <span>La Roseta Studio</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <a href="#portfolio" className="hover:text-roseta-primary transition">{t.nav.portfolio}</a>
            <a href="#contact" className="text-roseta-primary font-bold">{t.nav.quote}</a>
          </div>

          {/* BOTÓN DE IDIOMA */}
          <button 
            onClick={toggleLang}
            className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-roseta-primary transition border border-gray-200 px-3 py-1 rounded-full cursor-pointer select-none"
          >
            <Globe className="w-4 h-4" />
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="max-w-7xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight text-gray-900 mb-6">
            {t.hero.title1} <br/>
            <span className="text-roseta-primary">{t.hero.title2}</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
            {t.hero.description}
          </p>
          <div className="flex gap-4">
            <a href="#contact" className="inline-block bg-roseta-primary text-white px-8 py-4 rounded-full font-bold hover:bg-pink-800 transition shadow-lg transform hover:-translate-y-1">
              {t.hero.cta1}
            </a>
            <a href="#portfolio" className="inline-block bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition">
              {t.hero.cta2}
            </a>
          </div>
        </div>
        
        <div className="order-1 md:order-2 relative group">
          <div className="absolute inset-0 bg-roseta-primary rounded-3xl rotate-3 opacity-10 group-hover:rotate-6 transition duration-500"></div>
          <img 
            src={`${CDN_URL}/images/wedding-hall-white-luxury.jpg`}
            alt="Hero Decor" 
            className="relative rounded-3xl shadow-2xl object-cover h-[400px] md:h-[600px] w-full transform group-hover:-translate-y-2 transition duration-500"
            onError={(e) => { e.target.src = "https://via.placeholder.com/600x800" }}
          />
        </div>
      </header>

      {/* --- PORTAFOLIO DINÁMICO --- */}
      <section id="portfolio" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">{t.portfolio.title}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t.portfolio.subtitle}</p>
          </div>
          
          {/* Carga de items desde S3 */}
          {portfolioItems.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
               {lang === 'es' ? 'Cargando galería...' : 'Loading gallery...'}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {portfolioItems.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="overflow-hidden rounded-2xl shadow-lg h-80 mb-4 relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition z-10"></div>
                    <img 
                      src={`${CDN_URL}/images/${item.img}`} 
                      // El texto alt también cambia de idioma
                      alt={item[lang]?.title || "Decoración"} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x300" }}
                    />
                  </div>
                  {/* Títulos y descripción desde el JSON de S3 */}
                  <h3 className="font-serif font-bold text-xl text-gray-900">{item[lang]?.title}</h3>
                  <p className="text-sm text-gray-500">{item[lang]?.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- FORMULARIO --- */}
      <section id="contact" className="py-24 px-6 bg-roseta-bg">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden">
          
          <div className="bg-roseta-primary p-12 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">{t.form.title}</h2>
              <p className="mb-8 text-pink-100 leading-relaxed">
                {t.form.subtitle}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-pink-200" />
                  <span>Dallas, TX & Mexico City</span>
                </div>
                <div className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 text-pink-200" />
                  <span>@larosetastudio</span>
                </div>
              </div>
            </div>
            <div className="mt-12 text-pink-200 text-sm">
              {t.form.shipping}
            </div>
          </div>

          <div className="p-12">
            {status === 'success' ? (
              <div className="text-center py-12 h-full flex flex-col justify-center items-center">
                <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.form.successTitle}</h3>
                <p className="text-gray-500 mb-6">{t.form.successDesc}</p>
                <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 text-xs text-gray-400 font-mono mb-8">
                  ID: {orderId}
                </div>
                <button onClick={() => setStatus('idle')} className="text-roseta-primary font-bold hover:underline">
                  {t.form.retry}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t.form.name}</label>
                  <input 
                    type="text" name="name" required value={formData.name} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-roseta-primary focus:ring-2 focus:ring-pink-100 outline-none transition bg-gray-50"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t.form.email}</label>
                    <input 
                      type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-roseta-primary focus:ring-2 focus:ring-pink-100 outline-none transition bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t.form.phone}</label>
                    <input 
                      type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-roseta-primary focus:ring-2 focus:ring-pink-100 outline-none transition bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t.form.details}</label>
                  <textarea 
                    name="description" required rows="3" value={formData.description} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-roseta-primary focus:ring-2 focus:ring-pink-100 outline-none transition bg-gray-50"
                    placeholder={t.form.detailsPlaceholder}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full bg-roseta-primary text-white font-bold py-4 rounded-xl hover:bg-pink-800 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? t.form.loading : (
                    <> {t.form.submit} <Send className="w-5 h-5" /></>
                  )}
                </button>
                
                {status === 'error' && (
                  <p className="text-red-500 text-center text-sm bg-red-50 py-2 rounded">
                    {t.form.error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-white py-16 border-t border-gray-800 text-center">
        <div className="max-w-6xl mx-auto px-6">
           <div className="flex justify-center items-center gap-2 mb-6 text-2xl font-serif font-bold tracking-tight">
            <Flower className="text-roseta-primary" /> La Roseta Studio
          </div>
          <p className="text-gray-500 text-sm">{t.footer.rights}</p>
        </div>
      </footer>
    </div>
  )
}

export default App