import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, History, Trash2, Plus, Minus, ArrowLeft, ArrowRight, Package, Cpu, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Status from '../components/Status';

const API_URL = 'https://diplomreact.apt142.ru';

// Категории для кнопок
const categoryMap = [
  { label: 'ВСЕ', value: 'Все' },
  { label: 'ДАТЧИКИ', value: 'sensors' },
  { label: 'КАМЕРЫ', value: 'cameras' },
  { label: 'ОСВЕЩЕНИЕ', value: 'lighting' },
  { label: 'ХАБЫ', value: 'hubs' }
];

// Перевод категорий для плашек на карточках
const translateCategory = (cat) => {
  const map = {
    sensors: 'ДАТЧИКИ',
    cameras: 'КАМЕРЫ',
    lighting: 'ОСВЕЩЕНИЕ',
    hubs: 'ХАБЫ'
  };
  return map[cat] || cat.toUpperCase();
};

const Dashboard = ({ user }) => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('Все');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [orderIndex, setOrderIndex] = useState(0);

  const itemsPerPage = 9;
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [prodRes, orderRes] = await Promise.all([
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setItems(prodRes.data);
        setOrders(orderRes.data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCat]);

  // Логика карусели заказов
  useEffect(() => {
    if (orders.length <= 5 || isPaused) return; 
    const interval = setInterval(() => {
      setOrderIndex((prev) => (prev + 1) % orders.length);
    }, 2000); 
    return () => clearInterval(interval);
  }, [orders, isPaused]);

  const nextOrder = () => setOrderIndex((prev) => (prev + 1) % orders.length);
  const prevOrder = () => setOrderIndex((prev) => (prev - 1 + orders.length) % orders.length);

  const visibleOrders = (() => {
    if (orders.length === 0) return [];
    if (orders.length < 5) return orders; 
    const res = [];
    for (let i = 0; i < 5; i++) {
      res.push(orders[(orderIndex + i) % orders.length]);
    }
    return res;
  })();

  // Корзина с учетом ID + Категория
  const addToCart = (item) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === item.id && i.category === item.category);
      if (exist) return prev.map(i => (i.id === item.id && i.category === item.category) ? {...i, qty: i.qty + 1} : i);
      return [...prev, {...item, qty: 1}];
    });
  };

  const removeFromCart = (id, category) => setCart(prev => prev.filter(i => !(i.id === id && i.category === category)));
  
  const updateQty = (id, category, delta) => {
    setCart(prev => prev.map(i => (i.id === id && i.category === category) ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const handlePayment = () => {
    if(cart.length === 0) return;
    localStorage.setItem('tempCart', JSON.stringify(cart));
    navigate('/payment');
  };

  const filteredItems = selectedCat === 'Все' ? items : items.filter(i => i.category === selectedCat);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[var(--bg-color)]">
       <div className="w-16 h-16 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin mb-4"/>
       <span className="text-[var(--accent-color)] font-mono animate-pulse uppercase">Загрузка терминала...</span>
    </div>
  );

  return (
    <div className="pt-28 pb-20 max-w-[1900px] mx-auto px-4 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-end border-b border-[var(--glass-border)] pb-8 mb-10 gap-6">
        <div>
          <h1 className="text-5xl font-black text-[var(--text-color)] mb-2 uppercase tracking-tighter">
            ТЕРМИНАЛ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] to-purple-600">NEXUS</span>
          </h1>
          <p className="text-[var(--text-color)] opacity-60 font-mono text-sm uppercase">:: Оператор: {user?.name} :: Статус: ONLINE</p>
        </div>

        {/* Фильтры категорий */}
        <div className="flex flex-wrap gap-2">
          {categoryMap.map(cat => (
            <button 
              key={cat.value}
              onClick={() => setSelectedCat(cat.value)}
              className={`px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all border ${
                selectedCat === cat.value 
                ? 'bg-[var(--accent-color)] text-black border-[var(--accent-color)] shadow-[0_0_20px_rgba(var(--accent-color),0.4)]' 
                : 'glass text-[var(--text-color)] hover:bg-white/5 border-[var(--glass-border)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* КОНТЕНТ: Сетка товаров + Корзина */}
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* ТОВАРЫ (flex-1 заставляет этот блок занимать всё место, кроме корзины) */}
        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            <AnimatePresence mode='wait'>
              {currentItems.map((item) => (
                <motion.div 
                  key={`${item.category}-${item.id}`}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="uiverse-card group h-[400px] w-full border border-[var(--glass-border)] hover:border-[var(--accent-color)]/30 transition-colors"
                >
                  <div className="uiverse-card-content p-5 flex flex-col h-full justify-between bg-[var(--card-bg)]">
                    <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-white p-4">
                      <img 
                        src={item.image.startsWith('http') ? item.image : `${API_URL}/${item.image}`} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                        alt={item.name} 
                      />
                      <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-[9px] text-white font-bold uppercase border border-white/10">
                        {translateCategory(item.category)}
                      </div>
                      <div className="absolute top-3 right-3 bg-black/80 px-3 py-1 rounded-lg text-[var(--accent-color)] font-bold font-mono border border-[var(--accent-color)]/30">
                        {item.price} ₽
                      </div>
                    </div>

                    <div className="mt-4">
                       <h3 className="font-black text-lg text-[var(--text-color)] uppercase leading-none truncate">{item.name}</h3>
                       <p className="text-xs text-[var(--text-color)] opacity-50 mt-2 line-clamp-2 h-8">{item.description}</p>
                    </div>

                    <button 
                      onClick={() => addToCart(item)}
                      className="mt-4 w-full py-3 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] font-bold text-xs tracking-[0.2em] border border-[var(--accent-color)]/20 hover:bg-[var(--accent-color)] hover:text-black transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      {cart.some(c => c.id === item.id && c.category === item.category) ? 'В ХРАНИЛИЩЕ' : 'ИНТЕГРИРОВАТЬ'} <Plus size={14} /> 
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3 glass rounded-xl hover:text-[var(--accent-color)] disabled:opacity-20 transition-all"><ArrowLeft/></button>
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-12 h-12 rounded-xl font-bold font-mono transition-all ${currentPage === i + 1 ? 'bg-[var(--accent-color)] text-black shadow-[0_0_15px_var(--accent-color)]' : 'glass opacity-50'}`}>{i + 1}</button>
                ))}
              </div>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-3 glass rounded-xl hover:text-[var(--accent-color)] disabled:opacity-20 transition-all"><ArrowRight/></button>
            </div>
          )}
        </div>

        {/* КОРЗИНА (Жестко закрепленная ширина 400px на больших экранах) */}
        <aside className="w-full xl:w-[400px] shrink-0">
          <div className="glass p-6 rounded-[2rem] sticky top-28 border border-[var(--glass-border)] shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--glass-border)]">
              <h3 className="text-xl font-black text-[var(--text-color)] flex items-center gap-3 tracking-wider uppercase">
                <ShoppingCart size={22} className="text-[var(--accent-color)]" /> КОРЗИНА
              </h3>
              <span className="text-[10px] font-mono bg-black/40 px-2 py-1 rounded text-[var(--accent-color)] border border-[var(--glass-border)] uppercase">
                {cart.length} units
              </span>
            </div>
            
            <div className="flex flex-col gap-3 mb-6 max-h-[400px] overflow-y-auto pr-1 custom-scroll">
              {cart.length === 0 ? (
                <div className="text-center py-16 opacity-20 flex flex-col items-center border-2 border-dashed border-[var(--glass-border)] rounded-3xl">
                   <Package size={48} className="mb-2" />
                   <p className="font-mono text-[10px] tracking-widest uppercase">Хранилище пусто</p>
                </div>
              ) : cart.map(c => (
                <div key={`${c.category}-${c.id}`} className="flex gap-3 items-center bg-black/20 p-3 rounded-2xl border border-[var(--glass-border)]">
                  <img src={c.image.startsWith('http') ? c.image : `${API_URL}/${c.image}`} className="w-14 h-14 rounded-lg bg-white object-contain p-1" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold block text-[var(--text-color)] truncate uppercase">{c.name}</span>
                    <span className="text-xs text-[var(--accent-color)] font-mono">{c.price * c.qty} ₽</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => removeFromCart(c.id, c.category)} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                    <div className="flex items-center gap-1 bg-black/40 rounded-lg px-2 py-1 border border-[var(--glass-border)]">
                      <button onClick={() => updateQty(c.id, c.category, -1)} className="hover:text-[var(--accent-color)]"><Minus size={12}/></button>
                      <span className="font-mono text-xs font-bold w-4 text-center">{c.qty}</span>
                      <button onClick={() => updateQty(c.id, c.category, 1)} className="hover:text-[var(--accent-color)]"><Plus size={12}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--glass-border)] pt-5">
              <div className="flex justify-between mb-6 items-end">
                <span className="text-[var(--text-color)] opacity-40 font-bold text-[10px] uppercase tracking-widest">Итого</span>
                <span className="text-3xl font-black text-[var(--accent-color)] font-mono">
                  {cart.reduce((a, c) => a + c.price * c.qty, 0).toLocaleString()} ₽
                </span>
              </div>
              <button 
                onClick={handlePayment} 
                disabled={cart.length === 0} 
                className="w-full py-5 bg-[var(--accent-color)] text-black font-black tracking-[0.3em] rounded-2xl uppercase text-[11px] shadow-[0_0_30px_rgba(var(--accent-color),0.4)] hover:shadow-[0_0_50px_rgba(var(--accent-color),0.6)] transition-all flex justify-center items-center gap-3 active:scale-95 disabled:opacity-20"
              >
                <Cpu size={18} /> ИНИЦИАЛИЗАЦИЯ
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* НИЖНЯЯ КАРУСЕЛЬ */}
      {orders.length > 0 && (
        <div className="mt-20 border-t border-[var(--glass-border)] pt-12" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <div className="flex justify-between items-center mb-8 px-4">
            <h3 className="text-3xl font-black text-[var(--text-color)] flex items-center gap-4 uppercase tracking-widest">
              <History className="text-[var(--accent-color)]" size={32} /> ЛОГ ОПЕРАЦИЙ
            </h3>
            <div className="flex gap-2">
              <button onClick={prevOrder} className="p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--glass-border)] hover:text-[var(--accent-color)] transition-all"><ChevronLeft size={24} /></button>
              <button onClick={nextOrder} className="p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--glass-border)] hover:text-[var(--accent-color)] transition-all"><ChevronRight size={24} /></button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 overflow-hidden px-4">
             <AnimatePresence mode='popLayout'>
               {visibleOrders.map((order, i) => (
                 <motion.div 
                   key={`${order.id}-${orderIndex}-${i}`} 
                   initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }}
                   transition={{ duration: 0.4 }}
                   className="glass p-6 rounded-[2rem] border border-[var(--glass-border)] relative flex flex-col justify-between min-h-[220px] bg-[var(--card-bg)]/50"
                 >
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${order.status === 'completed' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-blue-500 shadow-[0_0_10px_#3b82f6]'}`} />
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="font-mono text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 opacity-60">#{order.order_number}</span>
                        <span className="font-bold text-lg text-[var(--text-color)]">{order.total}₽</span>
                      </div>
                      <p className="text-xs text-[var(--text-color)] opacity-70 font-bold line-clamp-3">{order.content}</p>
                    </div>
                    <div className="w-full mt-auto">
                      <Status status={order.status} date={new Date(order.created_at).toLocaleDateString()} />
                    </div>
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
