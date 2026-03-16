import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import Radar from '../components/Radar';
import Social from '../components/Social';
import Telephone from '../components/Telephone';

const Contact = () => {
  return (
    <div className="pt-24 min-h-screen px-4 md:px-8 max-w-[1600px] mx-auto pb-20 overflow-x-hidden relative">
      
      {/* === ПЛАВАЮЩИЙ SOCIAL (FIXED) === */}
      <motion.div 
         initial={{ opacity: 0, scale: 0 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: 1, type: "spring" }}
         className="fixed bottom-6 left-6 z-[100] md:bottom-8 md:left-8 pointer-events-none"
      >
         {/* pointer-events-auto нужен, чтобы клики работали, но контейнер не мешал */}
         <div className="pointer-events-auto transform scale-75 origin-bottom-left hover:scale-90 transition-transform duration-300">
            <Social />
         </div>
      </motion.div>

      {/* ЗАГОЛОВОК */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="mb-12 max-w-2xl"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-4 text-[var(--text-color)] uppercase tracking-tighter leading-none">
          Центр <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] to-purple-600">Связи</span>
        </h1>
        <p className="text-[var(--text-color)] opacity-60 text-lg border-l-4 border-[var(--accent-color)] pl-4 mt-6">
          Ангарский политехнический техникум. <br />
          Техническая поддержка систем Smart Nexus.
        </p>
      </motion.div>

      {/* ГЛАВНАЯ СЕТКА */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* === ЛЕВАЯ КОЛОНКА (Форма) === */}
        {/* Добавлен flex и h-full, чтобы колонка тянулась вниз */}
        <div className="lg:col-span-5 flex flex-col z-20">
          
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-[2rem] border border-[var(--glass-border)] h-full flex flex-col"
          >
            <h3 className="text-2xl font-bold mb-6 text-[var(--text-color)]">Входящий сигнал</h3>
            <form className="flex flex-col flex-grow gap-5">
              <div className="group">
                <label className="text-xs font-bold text-[var(--text-color)] opacity-50 ml-2 mb-1 block uppercase">Ваше Имя</label>
                <input type="text" className="contact-input" placeholder="Введите имя..." />
              </div>
              <div className="group">
                <label className="text-xs font-bold text-[var(--text-color)] opacity-50 ml-2 mb-1 block uppercase">Email</label>
                <input type="email" className="contact-input" placeholder="mail@example.com" />
              </div>
              {/* Textarea растягивается на всю доступную высоту (flex-grow) */}
              <div className="group flex-grow flex flex-col">
                <label className="text-xs font-bold text-[var(--text-color)] opacity-50 ml-2 mb-1 block uppercase">Сообщение</label>
                <textarea className="contact-input flex-grow resize-none min-h-[200px]" placeholder="Опишите задачу..." />
              </div>
              <button className="btn-neon w-full py-4 text-lg tracking-widest flex justify-center items-center gap-2 mt-auto">
                <Send size={18} /> ОТПРАВИТЬ
              </button>
            </form>
          </motion.div>
        </div>

        {/* === ПРАВАЯ КОЛОНКА (Карта + Контакты) === */}
        <div className="lg:col-span-7 flex flex-col gap-8 relative z-10">
          
          {/* 1. КАРТА */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass p-2 rounded-[2.5rem] border border-[var(--glass-border)] relative group overflow-hidden h-[450px]"
          >
            {/* Плашка адреса */}
            <div className="absolute top-6 left-8 z-20 flex items-center gap-3 bg-[var(--card-bg)]/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-[var(--glass-border)] shadow-xl">
               <div className="bg-red-500/20 p-2 rounded-full text-red-500 animate-pulse">
                  <MapPin size={20} />
               </div>
               <div>
                 <span className="text-[var(--text-color)] font-bold text-sm block leading-none mb-1">АПТ</span>
                 <span className="text-[var(--text-color)] text-[10px] opacity-60 font-mono block">52.549955, 103.885752</span>
               </div>
            </div>

            {/* Радар */}
            <div className="absolute bottom-8 right-8 z-20 scale-75 drop-shadow-2xl pointer-events-none">
               <Radar />
            </div>

            {/* Карта */}
            <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-[var(--bg-color)]">
              <iframe 
                src="https://yandex.ru/map-widget/v1/?ll=103.885752%2C52.549955&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NzM1NjAyNBJK0KDQvtGB0YHQuNGPLCDQmdGA0LrRg9GC0YHQutCw0Y8g0L7QsdC70LDRgdGC0YwsIDEsINCg0LDQsdC%2B0YfQuNC5INC60LLQsNGA0YLQsNC7LCDQkNC90LPQsNGA0YHQuiIKDS9uV0IV58lWQg%2C%2C&z=17"
                width="100%" 
                height="100%" 
                frameBorder="0"
                className="grayscale invert brightness-[0.85] contrast-[1.1] group-hover:grayscale-0 group-hover:invert-0 group-hover:brightness-100 transition-all duration-700"
                style={{ filter: 'var(--map-filter)' }} 
                title="Yandex Map"
              ></iframe>
            </div>
          </motion.div>

          {/* 2. БЛОК КОНТАКТОВ + ТЕЛЕФОН */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass px-8 py-6 rounded-[2rem] border border-[var(--glass-border)] flex flex-col xl:flex-row justify-between items-center gap-6 relative overflow-hidden"
          >
            
            {/* Текстовые данные: В ОДНУ СТРОКУ (Flex Row) */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 z-20 w-full xl:w-auto text-center md:text-left">
               
               {/* Телефон */}
               <div className="group">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-[var(--accent-color)] mb-1">
                    <Phone size={16} />
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-70">ЭКСТРЕННАЯ СВЯЗЬ</p>
                  </div>
                  <p className="text-[var(--text-color)] font-black font-mono text-xl md:text-2xl group-hover:text-[var(--accent-color)] transition-colors cursor-pointer tracking-tight whitespace-nowrap">
                    +7 (999) 000-NEXUS
                  </p>
               </div>

               {/* Вертикальный разделитель (только на десктопе) */}
               <div className="hidden md:block w-px h-10 bg-[var(--glass-border)]" />

               {/* Почта */}
               <div className="group">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-[var(--accent-color)] mb-1">
                    <Mail size={16} />
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-70">ЦИФРОВАЯ ПОЧТА</p>
                  </div>
                  <p className="text-[var(--text-color)] font-bold font-mono text-lg md:text-xl group-hover:text-[var(--accent-color)] transition-colors cursor-pointer">
                    core@nexus.tech
                  </p>
               </div>
            </div>

            {/* Анимация Телефона: УМЕНЬШЕНА И СДВИНУТА */}
            {/* pr-8 md:pr-12 создает отступ от правого края блока */}
            <div className="shrink-0 relative z-20 pr-0 md:pr-12 flex justify-center w-full md:w-auto">
               <div className="transform scale-75 md:scale-90">
                  <Telephone />
               </div>
            </div>

            {/* Фон */}
            <div className="absolute right-0 top-0 w-3/4 h-full bg-gradient-to-l from-[var(--accent-color)]/10 to-transparent pointer-events-none z-0" />
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default Contact;