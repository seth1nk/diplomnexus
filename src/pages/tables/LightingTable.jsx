import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, Eye, ChevronLeft, ChevronRight, AlertCircle, Lightbulb } from 'lucide-react';
import ActionMenu from '../../components/ActionMenu';

const API_URL = 'https://diplomreact.apt142.ru';

const LightingTable = ({ user }) => {
  const [lighting, setLighting] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [formData, setFormData] = useState({ id: null, name: '', price: '', category: 'lighting', description: '', image: null });
  
  // ПАГИНАЦИЯ
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // ОПРЕДЕЛЕНИЕ ПРАВ
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@mail.ru';

  useEffect(() => { 
      fetchLighting(); 
  }, []);

  const fetchLighting = async () => { 
      setLoading(true);
      try {
        // Запрос именно к таблице lighting
        const res = await axios.get(`${API_URL}/api/lighting`); 
        setLighting(res.data); 
      } catch(e) { 
        console.error("Ошибка при загрузке освещения:", e); 
      } finally { 
        setLoading(false); 
      }
  };

  const handleDelete = async (id) => { 
      if (!isAdmin) return;
      if(window.confirm('Удалить осветительный прибор из базы?')) { 
          try {
            await axios.delete(`${API_URL}/admin/lighting/${id}`, { 
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
            }); 
            fetchLighting(); 
          } catch(e) { alert("Ошибка удаления"); }
      }
  };

  const handleSubmit = async (e) => { 
      e.preventDefault(); 
      if (!isAdmin) return;

      const data = new FormData(); 
      Object.keys(formData).forEach(k => {
          if (formData[k] !== null) data.append(k, formData[k]);
      });
      
      const cfg = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }; 
      try {
        if(formData.id) {
            await axios.put(`${API_URL}/admin/lighting/${formData.id}`, formData, cfg); 
        } else {
            await axios.post(`${API_URL}/admin/lighting`, data, cfg); 
        }
        setIsModalOpen(false); 
        fetchLighting(); 
      } catch(e) { alert("Ошибка сохранения"); }
  };

  const getImageUrl = (img) => {
      if (!img) return null;
      if (img.startsWith('http')) return img; 
      return `${API_URL}/${img}`; 
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = lighting.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(lighting.length / itemsPerPage);

  return (
    <div className="pt-28 pb-10 min-h-screen px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-end mb-6 border-b border-[var(--glass-border)] pb-4">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                <Lightbulb size={32}/>
             </div>
             <div>
                <h2 className="text-3xl font-black text-[var(--accent-color)] uppercase tracking-widest leading-none">
                    УМНОЕ ОСВЕЩЕНИЕ
                </h2>
                <p className="text-[10px] opacity-50 mt-1 font-mono uppercase tracking-tighter">Управление светом и атмосферой ({lighting.length} поз.)</p>
             </div>
          </div>
          {isAdmin && (
            <button 
                onClick={() => { setFormData({ id: null, name: '', price: '', category: 'lighting', description: '', image: null }); setIsModalOpen(true); }} 
                className="btn-neon px-4 py-2 text-xs font-bold flex gap-2"
            >
                <Plus size={16}/> ДОБАВИТЬ ЛАМПУ
            </button>
          )}
        </div>

        <div className="glass overflow-hidden rounded-lg shadow-xl min-h-[400px]">
          {loading ? (
             <div className="p-10 text-center opacity-50 font-mono tracking-widest">LIGHT_INIT_DATABASE...</div>
          ) : (
            <>
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--accent-color)]/10 text-[var(--text-color)] uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                        <th className="p-4">ФОТО</th>
                        <th className="p-4">Наименование</th>
                        <th className="p-4">SKU / Арт.</th>
                        <th className="p-4">Стоимость</th>
                        <th className="p-4 text-right">Инфо</th>
                    </tr>
                    </thead>
                    <tbody className="text-sm text-[var(--text-color)]">
                    {currentItems.map((p) => (
                        <tr key={p.id} className="hover:bg-[var(--accent-color)]/5 border-b border-[var(--glass-border)] last:border-0 transition-colors">
                        <td className="p-4">
                            {p.image ? (
                                <img src={getImageUrl(p.image)} className="w-10 h-10 object-cover rounded shadow-[0_0_10px_rgba(255,255,255,0.1)] bg-black/20" alt={p.name} />
                            ) : (
                                <div className="w-10 h-10 bg-[var(--glass-border)] rounded flex items-center justify-center text-[10px] opacity-50 italic">DARK</div>
                            )}
                        </td>
                        <td className="p-4 font-bold">{p.name}</td>
                        <td className="p-4 font-mono opacity-60 text-xs">{p.sku || `LUM-${p.id}`}</td>
                        <td className="p-4 text-[var(--accent-color)] font-mono font-bold">{p.price} ₽</td>
                        <td className="p-4 text-right flex justify-end gap-2 items-center">
                            <button onClick={() => setViewData(p)} className="p-2 text-gray-400 hover:text-[var(--accent-color)] transition-colors">
                                <Eye size={18}/>
                            </button>
                            {isAdmin && (
                                <ActionMenu 
                                    onEdit={() => { setFormData({...p, category: 'lighting'}); setIsModalOpen(true); }} 
                                    onDelete={() => handleDelete(p.id)} 
                                />
                            )}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                
                {totalPages > 1 && (
                    <div className="flex justify-between items-center p-4 border-t border-[var(--glass-border)] bg-[var(--input-bg)]">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 disabled:opacity-30 hover:text-[var(--accent-color)]"><ChevronLeft/></button>
                        <span className="text-xs font-mono">STATION {currentPage} / {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 disabled:opacity-30 hover:text-[var(--accent-color)]"><ChevronRight/></button>
                    </div>
                )}
            </>
          )}
        </div>
      </div>
      
      {/* MODAL EDIT/CREATE */}
      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass p-6 w-full max-w-md relative border border-[var(--accent-color)] rounded-xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-[var(--text-color)] hover:text-red-500"><X size={20}/></button>
            <h3 className="text-xl font-bold text-[var(--accent-color)] mb-4 uppercase tracking-tighter">
                {formData.id ? 'Корректировка яркости/данных' : 'Добавление источника света'}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input 
                className="bg-[var(--input-bg)] border border-[var(--glass-border)] p-2 rounded text-[var(--text-color)] focus:border-[var(--accent-color)] outline-none" 
                placeholder="Название лампы/панели" 
                value={formData.name} 
                onChange={e=>setFormData({...formData, name:e.target.value})} 
                required
              />
              <div className="flex gap-2">
                  <input 
                    className="bg-[var(--input-bg)] border border-[var(--glass-border)] p-2 rounded text-[var(--text-color)] w-full focus:border-[var(--accent-color)] outline-none" 
                    placeholder="Цена (₽)" 
                    type="number" 
                    value={formData.price} 
                    onChange={e=>setFormData({...formData, price:e.target.value})} 
                    required
                  />
              </div>
              <textarea 
                className="bg-[var(--input-bg)] border border-[var(--glass-border)] p-2 rounded text-[var(--text-color)] h-24 focus:border-[var(--accent-color)] outline-none text-sm" 
                placeholder="Описание световых характеристик (Люмены, RGB, цветовая температура)..." 
                value={formData.description} 
                onChange={e=>setFormData({...formData, description:e.target.value})}
              />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] opacity-50 uppercase ml-1 font-bold">Изображение товара</span>
                <input type="file" className="text-xs text-[var(--text-color)] file:bg-[var(--accent-color)] file:border-0 file:rounded file:px-2 file:py-1 file:mr-2 file:text-black file:font-bold cursor-pointer" onChange={e=>setFormData({...formData, image: e.target.files[0]})}/>
              </div>
              <button className="btn-neon py-3 mt-2 font-bold rounded uppercase tracking-widest text-sm">СОХРАНИТЬ ЛАМПУ</button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="glass p-0 w-full max-w-2xl relative border border-[var(--glass-border)] text-[var(--text-color)] rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl">
                <button onClick={() => setViewData(null)} className="absolute top-2 right-2 z-10 bg-black/50 p-1 rounded-full text-white hover:bg-[var(--accent-color)] hover:text-black transition-colors"><X size={20}/></button>
                
                <div className="w-full md:w-1/2 h-64 md:h-auto bg-black relative flex items-center justify-center">
                    {viewData.image ? (
                        <img src={getImageUrl(viewData.image)} className="w-full h-full object-cover opacity-90 shadow-[0_0_60px_rgba(255,255,255,0.05)]" alt={viewData.name} />
                    ) : (
                        <div className="text-[var(--glass-border)]"><AlertCircle size={48}/></div>
                    )}
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-[var(--accent-color)] text-black px-3 py-1 font-bold rounded text-sm shadow-[0_0_15px_var(--accent-color)]">
                            {viewData.price} ₽
                        </span>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-6 flex flex-col gap-4 bg-[var(--bg-color)]/95">
                    <div>
                        <h3 className="text-2xl font-black text-[var(--accent-color)] uppercase leading-tight mb-1">{viewData.name}</h3>
                        <p className="text-[10px] opacity-40 font-mono tracking-widest uppercase">ID_SOURCE: {viewData.id} / {viewData.sku || 'NEXUS_LIGHT'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold">
                        <div className="p-2 bg-[var(--input-bg)] rounded border border-[var(--glass-border)] flex flex-col">
                            <span className="opacity-50 text-[8px]">Спектр</span>
                            <span className="text-yellow-400">RGB + White</span>
                        </div>
                        <div className="p-2 bg-[var(--input-bg)] rounded border border-[var(--glass-border)] flex flex-col">
                            <span className="opacity-50 text-[8px]">Ресурс</span>
                            <span className="text-blue-400">50,000 Часов</span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <span className="text-[9px] uppercase opacity-40 font-bold block mb-1">Световая схема и описание:</span>
                        <p className="text-sm opacity-80 bg-black/20 p-3 rounded border border-[var(--glass-border)] h-32 overflow-y-auto custom-scroll leading-relaxed">
                            {viewData.description || 'Сведения об интенсивности и цветопередаче отсутствуют.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default LightingTable;