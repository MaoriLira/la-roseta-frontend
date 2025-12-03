import { useState } from 'react'
import axios from 'axios'
import { Flower, CheckCircle, Send } from 'lucide-react'

// 👇 ¡PEGA TU URL DE AWS AQUÍ! 👇
const API_URL = "https://hd8pl54r6k.execute-api.us-east-1.amazonaws.com/Prod/orders/";

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', description: '' });
  const [status, setStatus] = useState('idle');
  const [orderId, setOrderId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await axios.post(API_URL, formData);
      setOrderId(response.data.orderId);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', description: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-roseta-bg font-sans text-gray-800">
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 text-roseta-primary font-bold text-2xl tracking-tighter">
          <Flower className="w-8 h-8" />
          <span>La Roseta Studio</span>
        </div>
      </nav>

      <header className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-6">
            Arte en Papel <span className="text-roseta-primary">Eterno</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Diseño exclusivo de flores gigantes para eventos en México y USA.
          </p>
          <a href="#contact" className="inline-block bg-roseta-primary text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-pink-800 transition">
            Cotizar Evento
          </a>
        </div>
        {/* Placeholder visual simple */}
        <div className="bg-pink-200 h-64 md:h-96 rounded-2xl flex items-center justify-center text-pink-700 font-bold text-xl shadow-inner">
           [ Foto de Flores Gigantes ]
        </div>
      </header>

      <section id="contact" className="bg-white py-20 px-6">
        <div className="max-w-xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100">
          {status === 'success' ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">¡Solicitud Recibida!</h3>
              <p className="mb-4">Tu ID de orden es: <span className="font-mono bg-white px-2 py-1 rounded border">{orderId}</span></p>
              <button onClick={() => setStatus('idle')} className="text-roseta-primary underline font-bold">Enviar otra solicitud</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Inicia tu Proyecto</h2>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-roseta-primary outline-none" placeholder="Tu nombre" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-roseta-primary outline-none" placeholder="correo@ejemplo.com" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-roseta-primary outline-none" placeholder="(555) 000-0000" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                <textarea name="description" required rows="3" value={formData.description} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-roseta-primary outline-none" placeholder="Detalles de las flores, colores, fecha..."></textarea>
              </div>

              <button type="submit" disabled={status === 'loading'} className="w-full bg-roseta-primary text-white font-bold p-4 rounded-lg hover:bg-pink-800 transition flex justify-center items-center gap-2 disabled:opacity-50">
                {status === 'loading' ? 'Enviando...' : <><Send size={18} /> Enviar Solicitud</>}
              </button>
              
              {status === 'error' && <p className="text-red-500 text-center text-sm mt-2">Error de conexión. Intenta de nuevo.</p>}
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

export default App