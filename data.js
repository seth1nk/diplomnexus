import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export const seedDatabase = async (pool) => {
  try {
    console.log('--- [DATA.JS] ГЕНЕРАЦИЯ УНИКАЛЬНЫХ ТОВАРОВ ПО КАТЕГОРИЯМ ---');

    // 0. ОЧИСТКА ТАБЛИЦ
    await pool.query('TRUNCATE hubs, cameras, lighting, sensors, users, orders, messages, logs RESTART IDENTITY CASCADE');
    
    console.log('> Регистрация главного администратора...');
    const adminPassword = await bcrypt.hash('Q1qqqqqq', 10);
    await pool.query(
      `INSERT INTO users (email, password, name, role, status, referral_code) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['admin@mail.ru', adminPassword, 'Admin Nexus', 'admin', 'active', uuidv4()]
    );
    // 2. ДАННЫЕ ТОВАРОВ (Уникальные для каждого фото)
    const catalog = {
      hubs: [
        { name: 'Умная колонка Nexus Speaker', desc: 'Центральный хаб с голосовым управлением и качественным звуком.', img: 'https://avatars.mds.yandex.net/get-mpic/5418200/2a000001919ec2eb22f7b7123b370fab2219/orig' },
        { name: 'Zigbee Мини-шлюз v3', desc: 'Компактный контроллер для подключения датчиков протечки и открытия.', img: 'https://avatars.mds.yandex.net/i?id=56d82da4ca7c0b223b6f34338dcb045f_l-8071172-images-thumbs&n=13' },
        { name: 'Мультипротокольный Gateway Pro', desc: 'Профессиональный хаб с поддержкой Bluetooth, Zigbee и Wi-Fi.', img: 'https://avatars.mds.yandex.net/i?id=d1bc4455ced4ac880c1349c6de03d38e_l-4904535-images-thumbs&n=13' },
        { name: 'Универсальный ИК-пульт Nexus', desc: 'Управляйте кондиционером и ТВ через приложение из любой точки мира.', img: 'https://avatars.mds.yandex.net/i?id=805da74e78d87c0d5b7c64fe33989659_l-10416881-images-thumbs&n=13' }
      ],
      cameras: [
        { name: 'Уличная PTZ камера 4K', desc: 'Поворотная камера с ночным видением и защитой IP66.', img: 'https://i.ebayimg.com/images/g/mNsAAOSwZFJi5gWb/s-l1600.jpg' },
        { name: 'Домашняя камера 360° Vision', desc: 'Автоматическое слежение за движением и двусторонняя аудиосвязь.', img: 'https://avatars.mds.yandex.net/i?id=0bde5e434bf13afe06ef2ae3a64fb5594a1efa65-5220428-images-thumbs&n=13' },
        { name: 'Цилиндрическая Pro Cam', desc: 'Стационарная камера для мониторинга фасадов и парковок.', img: 'https://avatars.mds.yandex.net/i?id=989e27dc58ea645d222a244084bd3f3e_l-5233238-images-thumbs&n=13' },
        { name: 'Компактная камера-сфера', desc: 'Малозаметная внутренняя камера с широким углом обзора.', img: 'https://avatars.mds.yandex.net/i?id=3a5cb4ccc57a36953da63dc498cde0273631adef-7047516-images-thumbs&n=13' }
      ],
      lighting: [
        { name: 'Ретро-лампа Эдисона Smart', desc: 'Винтажный стиль с современным управлением яркостью со смартфона.', img: 'https://avatars.mds.yandex.net/i?id=b5b8a2a789a1aeed94f7915b2970e4bd_l-4545543-images-thumbs&n=13' },
        { name: 'RGB Лампа Nexus Color', desc: 'Миллионы цветов и сценарии под музыку для вашей вечеринки.', img: 'https://cdn1.ozone.ru/s3/multimedia-5/6071763269.jpg' },
        { name: 'Настольная лампа WorkLight', desc: 'Регулировка цветовой температуры для комфортной работы и чтения.', img: 'https://cdn1.technopark.ru/technopark/photos_resized/product_interior/1000_1000/174868/2_174868.jpg' },
        { name: 'Потолочная RGB панель', desc: 'Равномерное освещение всей комнаты с эффектом мягкого заката.', img: 'https://avatars.mds.yandex.net/i?id=e90c441916042167c66133b105e733bf_l-12615496-images-thumbs&n=13' }
      ],
      sensors: [
        { name: 'Датчик движения и света', desc: 'Автоматически включает свет, когда вы входите в комнату.', img: 'https://rs-catalog.ru/images/detailed/574/7918260.jpg' },
        { name: 'Умный Термостат Climate Pro', desc: 'Контроль температуры и влажности в реальном времени на LCD экране.', img: 'https://avatars.mds.yandex.net/get-mpic/11740777/2a0000018b3aff8d4a325275f8a2a191589e/orig' },
        { name: 'Датчик открытия окна/двери', desc: 'Мгновенное уведомление на телефон при попытке проникновения.', img: 'https://cdn1.technopark.ru/technopark/photos_resized/product/1000_1000/648027/5_648027.jpg' },
        { name: 'Сенсор температуры и влажности', desc: 'Компактный датчик для создания идеального микроклимата.', img: 'https://avatars.mds.yandex.net/i?id=29e53e93cf7db90c291316784542d608_l-4815406-images-thumbs&n=13' }
      ]
    };

    // 4. ЗАПОЛНЕНИЕ 4-Х ТАБЛИЦ ПО 100 ТОВАРОВ (ИТОГО 400)
    const tables = ['hubs', 'cameras', 'lighting', 'sensors'];
    for (const table of tables) {
      console.log(`> Наполнение таблицы ${table} (загрузка 100 товаров)...`);
      const itemsTemplates = catalog[table];
      
      for (let i = 1; i <= 100; i++) {
        const prod = itemsTemplates[(i - 1) % 4]; // Чередуем 4 фото/описания
        const randomPrice = 1000 + (i * 50) + Math.floor(Math.random() * 500);
        
        await pool.query(
          `INSERT INTO ${table} (name, description, price, image, stock, rating, sku) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            `${prod.name} v.${i}`, 
            prod.desc, 
            randomPrice, 
            prod.img, 
            100, 
            (4.0 + Math.random()).toFixed(1), 
            `NX-${table.toUpperCase().slice(0,2)}-${i}`
          ]
        );
      }
    }

    console.log('--- [SUCCESS] БАЗА ДАННЫХ ПОЛНОСТЬЮ ОБНОВЛЕНА ---');
  } catch (e) {
    console.error('❌ ОШИБКА ЗАПОЛНЕНИЯ:', e.message);
  }
};