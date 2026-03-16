import { motion } from 'framer-motion';
import { Activity, Shield, Cpu, Wifi } from 'lucide-react'; 
import Mesto from '../components/Mesto';
import Pogoda from '../components/Pogoda';
import Notebook from '../components/Notebook';
import Server from '../components/Server';
import Button from '../components/Record';
const About = () => {
  return (
    <div className="pt-24 min-h-screen px-4 md:px-8 max-w-[1600px] mx-auto pb-20 overflow-x-hidden relative">
      <motion.div initial={{ opacity: 0, x: -100 }}animate={{ opacity: 1, x: 0 }}transition={{ delay: 1, type: "spring" }}className="fixed bottom-6 left-6 z-[90] md:bottom-10 md:left-10">
         <div className="transform scale-75 origin-bottom-left hover:scale-90 transition-transform duration-300 drop-shadow-2xl">
            <Pogoda />
         </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 100 }}animate={{ opacity: 1, x: 0 }}transition={{ delay: 1.2, type: "spring" }}className="fixed bottom-6 right-6 z-[100] md:bottom-10 md:right-10 flex flex-col items-end pointer-events-none">
         <div className="pointer-events-auto relative group">
            <div className="absolute -top-12 right-0 flex items-center gap-3 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-auto">
                <div className="scale-75 origin-right"><Button /></div>
                <div className="bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                   LIVE MAP
                </div>
            </div>

            {/* Карта */}
            <div className="w-[280px] h-[200px] md:w-[320px] md:h-[240px] bg-[var(--card-bg)] rounded-3xl overflow-visible border-2 border-[var(--accent-color)] shadow-2xl transform transition-all duration-500 origin-bottom-right group-hover:scale-[1.8] group-hover:-translate-x-10 group-hover:-translate-y-10 group-hover:rounded-[2rem]">
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent z-10 transition-colors duration-300 pointer-events-none rounded-3xl" />
               <div className="w-full h-full flex items-center justify-center transform scale-[0.5] md:scale-[0.6] group-hover:scale-100 transition-transform duration-500">
                  <Mesto />
               </div>
            </div>
         </div>
      </motion.div>


      {/* === ОСНОВНОЙ КОНТЕНТ === */}
      
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center mb-16"
      >
        <h2 className="text-[var(--accent-color)] tracking-[0.2em] text-sm font-bold mb-4 uppercase">О Проекте</h2>
        <h1 className="text-5xl md:text-7xl font-black mb-6 text-[var(--text-color)] uppercase tracking-tighter">
          Экосистема <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] to-purple-600">Smart Nexus</span>
        </h1>
        <p className="text-[var(--text-color)] opacity-70 text-lg max-w-3xl mx-auto border-b border-[var(--glass-border)] pb-8">
          Интеллектуальное управление пространством. Мы превращаем квадратные метры в думающий организм.
        </p>
      </motion.div>

      {/* TEXT & DASHBOARD BLOCK */}
      <div className="flex flex-col items-center gap-16 mb-24">
        
        {/* Text */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl text-center space-y-6"
        >
           <h3 className="text-3xl font-bold text-[var(--text-color)]">Центральный нейро-хаб</h3>
           <p className="text-[var(--text-color)] leading-relaxed opacity-80 text-lg">
             В основе системы лежит локальный сервер обработки данных. В отличие от облачных решений, 
             <b> Smart Nexus</b> обрабатывает все сигналы внутри дома (Edge Computing), обеспечивая мгновенную реакцию 
             и полную безопасность.
           </p>
        </motion.div>

        {/* === БОЛЬШАЯ ПАНЕЛЬ МОНИТОРИНГА === */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="glass p-8 md:p-10 rounded-[3rem] border border-[var(--glass-border)] w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative overflow-hidden"
        >
             {/* Фон свечение */}
             <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-color)]/5 to-purple-500/5 pointer-events-none" />

             {/* ЛЕВАЯ ЧАСТЬ: ВИЗУАЛИЗАЦИЯ (СЕРВЕР) */}
             <div className="flex flex-col items-center justify-center relative">
                <div className="absolute top-0 left-0 bg-white/5 px-3 py-1 rounded-full text-[10px] font-mono text-[var(--text-color)] border border-white/10">
                  UNIT: ALPHA-01
                </div>
                <div className="transform scale-110 hover:scale-125 transition-transform duration-700 cursor-pointer">
                   <Server />
                </div>
                <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-[#0f172a] rounded-full border border-green-500/30 shadow-[0_0_15px_rgba(74,222,128,0.2)] z-10">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-xs font-mono text-green-400">SYSTEM ONLINE</span>
                </div>
             </div>

             {/* ПРАВАЯ ЧАСТЬ: МЕТРИКИ (НОВОЕ) */}
             <div className="flex flex-col gap-6 z-10">
                
                <h4 className="text-[var(--text-color)] font-bold text-xl flex items-center gap-2">
                  <Activity size={20} className="text-[var(--accent-color)]"/>
                  Телеметрия Ядра
                </h4>

                {/* Progress Bars */}
                <div className="space-y-4">
                   {/* CPU */}
                   <div className="group">
                      <div className="flex justify-between text-xs font-mono text-[var(--text-color)] opacity-70 mb-1">
                         <span className="flex items-center gap-1"><Cpu size={12}/> CPU LOAD</span>
                         <span>12%</span>
                      </div>
                      <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }} whileInView={{ width: '12%' }} 
                           className="h-full bg-blue-500 rounded-full relative"
                         >
                            <div className="absolute right-0 top-0 h-full w-2 bg-white/50 blur-[2px]" />
                         </motion.div>
                      </div>
                   </div>

                   {/* RAM */}
                   <div className="group">
                      <div className="flex justify-between text-xs font-mono text-[var(--text-color)] opacity-70 mb-1">
                         <span className="flex items-center gap-1"><Shield size={12}/> SECURITY LAYER</span>
                         <span className="text-green-400">ACTIVE</span>
                      </div>
                      <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }} whileInView={{ width: '100%' }} 
                           className="h-full bg-green-500 rounded-full relative"
                         />
                      </div>
                   </div>

                   {/* NETWORK */}
                   <div className="group">
                      <div className="flex justify-between text-xs font-mono text-[var(--text-color)] opacity-70 mb-1">
                         <span className="flex items-center gap-1"><Wifi size={12}/> UPLINK</span>
                         <span>1.2 Gbps</span>
                      </div>
                      {/* График полосочками */}
                      <div className="flex gap-1 h-4 items-end">
                         {[40, 70, 30, 80, 50, 90, 60, 40, 70, 50, 80, 60].map((h, i) => (
                            <motion.div 
                              key={i}
                              initial={{ height: 0 }}
                              whileInView={{ height: `${h}%` }}
                              transition={{ delay: i * 0.05 }}
                              className="w-1 bg-[var(--accent-color)]/50 rounded-t-sm"
                            />
                         ))}
                      </div>
                   </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                   <div className="bg-[var(--bg-color)]/50 p-3 rounded-xl border border-[var(--glass-border)]">
                      <p className="text-[10px] text-[var(--text-color)] opacity-50 uppercase">Requests</p>
                      <p className="text-lg font-mono font-bold text-[var(--text-color)]">8,432<span className="text-[10px] opacity-50">/sec</span></p>
                   </div>
                   <div className="bg-[var(--bg-color)]/50 p-3 rounded-xl border border-[var(--glass-border)]">
                      <p className="text-[10px] text-[var(--text-color)] opacity-50 uppercase">Ping</p>
                      <p className="text-lg font-mono font-bold text-green-400">3ms</p>
                   </div>
                </div>

             </div>
        </motion.div>

      </div>

      {/* ENGINEER TERMINAL SECTION */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center glass p-8 md:p-12 rounded-[2.5rem] border border-[var(--glass-border)] mb-20"
      >
         <div className="order-2 md:order-1">
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-color)] mb-4">Инженерный доступ</h3>
            <p className="text-[var(--text-color)] opacity-70 mb-6">
              Полный контроль над сценариями автоматизации. Доступ к логам системы, настройка чувствительности датчиков и обновление прошивок модулей.
            </p>
            <div className="bg-[#0b0c15] p-5 rounded-xl border border-white/10 font-mono text-xs text-green-400 shadow-inner overflow-hidden relative">
               <div className="absolute top-0 right-0 p-2 opacity-50 text-[10px] text-white">v.2.4.1</div>
               <p> connect --secure root@nexus</p>
               <p className="text-blue-400"> Authenticating...</p>
               <p> Access Granted.</p>
               <p className="animate-pulse"> _</p>
            </div>
         </div>
         <div className="flex justify-center order-1 md:order-2">
            <div className="transform scale-90 hover:scale-100 transition-transform duration-500">
               <Notebook />
            </div>
         </div>
      </motion.div>

    </div>
  );
};

export default About;