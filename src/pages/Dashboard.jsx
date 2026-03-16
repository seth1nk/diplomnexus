import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, History, Trash2, Plus, Minus, ArrowLeft, ArrowRight, Package, Cpu, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Status from '../components/Status';

const API_URL = 'https://diplomreact.apt142.ru';

// Категории для фильтрации (сопоставляем с именами таблиц в БД)
const categories = [
  { label: 'Все', value: 'Все' },
  { label: 'Датчики', value: 'sensors' },
  { label: 'Камеры', value: 'cameras' },
  { label: 'Освещение', value: 'lighting' },
  { label: 'Хабы', value: 'hubs' }
];

const Dashboard = ({ user }) => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('Все');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [orderIndex, setOrderIndex] = useState(0);

  const itemsPerPage = 9;
  const navigate = useNavigate();
  
  // ЗАГРУЗКА ДАННЫХ
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        // На бэкенде GET /products теперь собирает данные из 4-х таблиц через UNION ALL
        const [prodRes, orderRes] = await Promise.all([
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setItems(prodRes.data);
        setOrders(orderRes.data);
        setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
      } catch (e) { 
          console.error("Ошибка загрузки данных:", e); 
      } finally { 
          setLoading(false); 
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCat]);

  // КАРУСЕЛЬ ЗАКАЗОВ
  useEffect(() => {
    if (orders.length <= 5 || isPaused) return; 
    const interval = setInterval(() => {
      setOrderIndex((prev) => (prev + 1) % orders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [orders, isPaused]);

  const nextOrder = () => setOrderIndex((prev) => (prev + 1) % orders.length);
  const prevOrder = () => setOrderIndex((prev) => (prev - 1 + orders.length) % orders.length);

  const getVisibleOrders = () => {
    if (orders.length === 0) return [];
    if (orders.length < 5) return orders;
    const result = [];
    for (let i = 0; i < 5; i++) {
      result.push(orders[(orderIndex + i) % orders.length]);
    }
    return result;
  };

  // ЛОГИКА КОРЗИНЫ (С учетом категории, так как ID могут дублироваться в разных таблицах)
  const addToCart = (item) => {
    setCart(prev => {
      // Ищем товар по связке ID + категория
      const exist = prev.find(i => i.id === item.id && i.category === item.category);
      if (exist) {
        return prev.map(i => (i.id === item.id && i.category === item.category) ? {...i, qty: i.qty + 1} : i);
      }
      return [...prev, {...item, qty: 1}];
    });
  };

  const removeFromCart = (id, category) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.category === category)));
  };

  const updateQty = (id, category, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id && i.category === category) {
          return { ...i, qty: Math.max(1, i.qty + delta) };
      }
      return i;
    }));
  };

  const handlePayment = () => {
    if(cart.length === 0) return;
    localStorage.setItem('tempCart', JSON.stringify(cart));
    navigate('/payment');
  };

  // ФИЛЬТРАЦИЯ
  const filteredItems = selectedCat === 'Все' 
    ? items 
    : items.filter(i => i.category === selectedCat);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getImageUrl = (img) => {
    if (!img) return null;
    return img.startsWith('http') ? img : `${API_URL}/${img}`;
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[var(--bg-color)]">
       <div className="w-16 h-16 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"/>
       <span className="text-[var(--accent-color)] font-mono text-xl animate-pulse uppercase tracking-widest">Nexus System Loading...</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-12 pb-20 max-w-[1900px] mx-auto min-h-screen px-4 pt-24">
      
      {/* HEADER & CATEGORIES */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="flex flex-col xl:flex-row justify-between items-end border-b border-[var(--glass-border)] pb-8 gap-6"
      >
        <div>
          <h1 className="text-5xl font-black text-[var(--text-color)] mb-2 uppercase tracking-tighter">
            ТЕРМИНАЛ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] to-blue-400">NEXUS</span>
          </h1>
          <p className="text-[var(--text-color)] opacity-60 font-mono text-xs">
            :: АВТОРИЗОВАН: {user?.name?.toUpperCase() || 'GUEST'} :: СЕТЬ: ONLINE
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button 
              key={cat.value}
              onClick={() => setSelectedCat(cat.value)}
              className={`px-5 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border ${
                selectedCat === cat.value 
                ? 'bg-[var(--accent-color)] text-black border-[var(--accent-color)] shadow-[0_0_20px_var(--accent-color)]' 
                : 'glass text-[var(--text-color)] hover:bg-[var(--input-bg)] border-[var(--glass-border)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>
      
      <div className="flex flex-col xl:flex-row gap-8 relative items-start">
        
        {/* CATALOG */}
        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 mb-12">
            <AnimatePresence mode='wait'>
              {currentItems.map((item) => (
                <motion.div 
                  key={`${item.category}-${item.id}`}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className="glass group h-[400px] w-full border border-[var(--glass-border)] hover:border-[var(--accent-color)]/50 transition-all duration-500 rounded-3xl overflow-hidden relative flex flex-col"
                >
                    {/* Image Area */}
                    <div className="h-48 w-full relative p-4 bg-black/20">
                      <img 
                        src={getImageUrl(item.image)} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                        alt={item.name} 
                      />
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded border border-[var(--glass-border)] text-[9px] text-[var(--accent-color)] font-bold uppercase">
                        {item.category}
                      </div>
                      <div className="absolute bottom-3 right-3 text-xl font-black text-white drop-shadow-lg">
                        {item.price} ₽
                      </div>
                    </div>

                    {/* Info Area */}
                    <div className="p-6 flex flex-col flex-1 justify-between">
                       <div>
                          <h3 className="font-black text-lg text-[var(--text-color)] uppercase truncate mb-2">{item.name}</h3>
                          <p className="text-xs text-[var(--text-color)] opacity-50 line-clamp-3 leading-relaxed">
                            {item.description || 'Описание оборудования в процессе загрузки...'}
                          </p>
                       </div>

                       <button 
                        onClick={() => addToCart(item)}
                        className={`w-full py-3 rounded-xl font-bold text-[10px] tracking-[0.2em] border transition-all flex items-center justify-center gap-2 mt-4 ${
                          cart.some(c => c.id === item.id && c.category === item.category)
                          ? 'bg-green-500/20 border-green-500/50 text-green-400'
                          : 'bg-[var(--accent-color)]/10 text-[var(--accent-color)] border-[var(--accent-color)]/30 hover:bg-[var(--accent-color)] hover:text-black'
                        }`}
                      >
                        {cart.some(c => c.id === item.id && c.category === item.category) ? 'ДОБАВЛЕНО' : 'В КОРЗИНУ'} <Plus size={14} /> 
                      </button>
                    </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 items-center mb-8">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 glass hover:text-[var(--accent-color)] transition-all disabled:opacity-20"><ArrowLeft/></button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold font-mono transition-all ${currentPage === i + 1 ? 'bg-[var(--accent-color)] text-black' : 'glass opacity-50 hover:opacity-100'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 glass hover:text-[var(--accent-color)] transition-all disabled:opacity-20"><ArrowRight/></button>
            </div>
          )}
        </div>

        {/* CART (ХРАНИЛИЩЕ) */}
        <div className="w-full xl:w-[400px] shrink-0">
          <div className="glass p-6 rounded-[2.5rem] sticky top-28 border border-[var(--glass-border)]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--glass-border)]">
              <h3 className="text-xl font-black text-[var(--text-color)] flex items-center gap-3 tracking-widest uppercase">
                <ShoppingCart size={20} className="text-[var(--accent-color)]" /> КОРЗИНА
              </h3>
              <span className="text-[10px] font-mono bg-black/40 px-2 py-1 rounded border border-[var(--glass-border)] text-[var(--accent-color)]">
                {cart.reduce((a,c) => a + c.qty, 0)} UNITS
              </span>
            </div>
            
            <div className="flex flex-col gap-3 mb-6 max-h-[450px] overflow-y-auto pr-2 custom-scroll">
              {cart.length === 0 ? (
                <div className="text-center py-16 opacity-20 flex flex-col items-center border-2 border-dashed border-[var(--glass-border)] rounded-3xl">
                   <Package size={48} className="mb-2" />
                   <p className="font-mono text-[10px] tracking-widest uppercase">Хранилище пусто</p>
                </div>
              ) : cart.map(c => (
                <div key={`${c.category}-${c.id}`} className="flex gap-4 items-center bg-black/20 p-3 rounded-2xl border border-[var(--glass-border)] group">
                  <img src={getImageUrl(c.image)} className="w-12 h-12 rounded-lg bg-white object-contain p-1" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold block text-[var(--text-color)] truncate uppercase">{c.name}</span>
                    <span className="text-xs text-[var(--accent-color)] font-mono">{(c.price * c.qty).toFixed(0)} ₽</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => removeFromCart(c.id, c.category)} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                    <div className="flex items-center gap-2 bg-black/40 rounded-lg px-2 py-1 border border-[var(--glass-border)]">
                      <button onClick={() => updateQty(c.id, c.category, -1)} className="hover:text-[var(--accent-color)]"><Minus size={12}/></button>
                      <span className="font-mono text-xs font-bold w-4 text-center">{c.qty}</span>
                      <button onClick={() => updateQty(c.id, c.category, 1)} className="hover:text-[var(--accent-color)]"><Plus size={12}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--glass-border)]">
              <div className="flex justify-between items-end mb-6">
                <span className="text-[var(--text-color)] opacity-40 font-bold text-[10px] uppercase tracking-widest">Общий итог</span>
                <span className="text-3xl font-black text-[var(--accent-color)] font-mono tracking-tighter">
                  {cart.reduce((a, c) => a + c.price * c.qty, 0).toLocaleString()} <span className="text-sm">₽</span>
                </span>
              </div>
              <button 
                onClick={handlePayment} 
                disabled={cart.length === 0} 
                className="w-full py-5 bg-[var(--accent-color)] text-black font-black tracking-[0.3em] rounded-2xl uppercase text-xs shadow-[0_0_30px_rgba(var(--accent-color),0.4)] hover:shadow-[0_0_50px_rgba(var(--accent-color),0.6)] transition-all flex justify-center items-center gap-3 active:scale-95 disabled:opacity-20"
              >
                <Cpu size={18} /> ОФОРМИТЬ ЗАКАЗ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ORDERS HISTORY CAROUSEL */}
      {orders.length > 0 && (
        <div 
          className="mt-12 border-t border-[var(--glass-border)] pt-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex justify-between items-center mb-8 px-4">
            <h3 className="text-3xl font-black text-[var(--text-color)] flex items-center gap-4 uppercase tracking-widest">
              <History className="text-[var(--accent-color)]" size={36} /> ИСТОРИЯ ОПЕРАЦИЙ
            </h3>
            <div className="flex gap-2">
              <button onClick={prevOrder} className="p-3 rounded-xl glass hover:text-[var(--accent-color)] transition-all"><ChevronLeft size={24} /></button>
              <button onClick={nextOrder} className="p-3 rounded-xl glass hover:text-[var(--accent-color)] transition-all"><ChevronRight size={24} /></button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 px-2 overflow-hidden">
             <AnimatePresence mode='popLayout'>
               {getVisibleOrders().map((order, i) => (
                 <motion.div 
                   key={`${order.id}-${orderIndex}-${i}`} 
                   initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
                   className="glass p-6 rounded-[2rem] border border-[var(--glass-border)] relative flex flex-col justify-between min-h-[200px] hover:border-[var(--accent-color)]/30 transition-colors"
                 >
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-mono text-[9px] px-2 py-1 rounded bg-white/5 border border-white/10 opacity-60">
                        #{order.order_number}
                      </span>
                      <span className="font-black text-lg text-[var(--accent-color)]">{order.total} ₽</span>
                    </div>
                    
                    <p className="text-[11px] text-[var(--text-color)] opacity-70 font-bold mb-6 line-clamp-2">
                      {order.content || 'Модули Nexus System'}
                    </p>
                    
                    <Status status={order.status} date={new Date(order.created_at).toLocaleDateString()} />
                 </motion.div>
               ))}
             </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;