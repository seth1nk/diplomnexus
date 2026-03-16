import React from 'react';
import styled from 'styled-components';

const Mesto = () => {
  return (
    <StyledWrapper>
      <div className="map-container glass">
        
        {/* ФОН КАРТЫ */}
        <div className="map-background-wrapper">
            <svg viewBox="0 0 600 500" className="map-svg">
              <defs>
                <pattern id="lawn" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="#7ec850" />
                  <circle cx="5" cy="5" r="1.5" fill="#6db743" />
                  <circle cx="15" cy="15" r="1.5" fill="#6db743" />
                </pattern>
                <linearGradient id="water" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2980b9" />
                  <stop offset="100%" stopColor="#6dd5fa" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dx="3" dy="3" result="offsetblur" />
                  <feMerge>
                    <feMergeNode in="offsetblur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* === СЛОЙ 1: ЛАНДШАФТ === */}
              <rect width="600" height="500" fill="url(#lawn)" />
              <rect x="10" y="10" width="580" height="480" fill="none" stroke="#5d4037" strokeWidth="6" rx="5" />
              
              {/* Дорожки */}
              <path d="M50,490 L50,300 L180,300 L180,490 Z" fill="#94a3b8" /> {/* Парковка */}
              <path d="M180,400 L300,400 L300,320" fill="none" stroke="#cbd5e1" strokeWidth="30" strokeLinecap="round" />
              <rect x="380" y="50" width="180" height="220" rx="10" fill="#e2e8f0" /> {/* Патио */}

              {/* === СЛОЙ 2: СТРОЕНИЯ === */}
              
              {/* ГАРАЖ */}
              <g transform="translate(80, 150)" filter="url(#shadow)">
                <rect width="120" height="150" fill="#64748b" />
                <line x1="60" y1="0" x2="60" y2="150" stroke="#475569" strokeWidth="2" />
                <rect x="10" y="10" width="100" height="130" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="5,5"/>
              </g>

              {/* ДОМ */}
              <g transform="translate(200, 100)" filter="url(#shadow)">
                <rect x="0" y="0" width="200" height="220" fill="#fff" />
                <path d="M0,0 L100,110 L0,220" fill="#c2410c" />
                <path d="M200,0 L100,110 L200,220" fill="#ea580c" />
                <rect x="20" y="20" width="60" height="80" fill="#1e293b" stroke="#475569" />
                <rect x="120" y="120" width="60" height="80" fill="#1e293b" stroke="#475569" />
              </g>

              {/* БАССЕЙН */}
              <rect x="400" y="70" width="140" height="160" rx="10" fill="url(#water)" stroke="#fff" strokeWidth="5" filter="url(#shadow)"/>

              {/* === СЛОЙ 3: ОБЪЕКТЫ === */}

              {/* МАШИНА */}
              <g transform="translate(95, 360)" filter="url(#shadow)">
                <rect x="0" y="0" width="70" height="120" rx="12" fill="#dc2626" />
                <path d="M5,20 L65,20 L60,40 L10,40 Z" fill="#1e293b" />
                <path d="M10,90 L60,90 L65,110 L5,110 Z" fill="#1e293b" />
                <rect x="10" y="42" width="50" height="46" fill="#b91c1c" />
              </g>

              {/* МАНГАЛЬНАЯ ЗОНА (Отодвинул вниз на траву - координаты 500, 300) */}
              <g transform="translate(500, 300)" filter="url(#shadow)">
                 {/* Плитка под мангал */}
                 <rect x="-10" y="-10" width="60" height="45" rx="5" fill="#78716c" />
                 {/* Сам мангал */}
                 <rect x="0" y="0" width="40" height="25" fill="#171717" />
                 <line x1="5" y1="5" x2="35" y2="5" stroke="#404040" strokeWidth="2" />
                 <line x1="5" y1="12" x2="35" y2="12" stroke="#404040" strokeWidth="2" />
                 {/* Дым */}
                 <circle cx="20" cy="-5" r="3" fill="#fff" opacity="0.4">
                    <animate attributeName="cy" from="-5" to="-15" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="1s" repeatCount="indefinite" />
                 </circle>
              </g>

              {/* ЧЕЛОВЕК (Вид СВЕРХУ) - Сдвинул ближе к центру дорожки */}
              <g transform="translate(320, 380)">
                <ellipse cx="0" cy="0" rx="14" ry="8" fill="#2563eb" stroke="#1e293b" strokeWidth="1" />
                <circle cx="0" cy="0" r="6" fill="#fcd34d" stroke="#1e293b" strokeWidth="1" />
              </g>

              {/* СОБАКА (Вид СВЕРХУ) */}
              <g transform="translate(450, 350) rotate(30)">
                 <ellipse cx="0" cy="0" rx="12" ry="6" fill="#78350f" />
                 <circle cx="10" cy="0" r="5" fill="#78350f" />
                 <path d="M-10,0 L-16,0" stroke="#78350f" strokeWidth="2" strokeLinecap="round"/>
              </g>

              {/* ДЕРЕВЬЯ */}
              <circle cx="40" cy="40" r="30" fill="#166534" opacity="0.8" filter="url(#shadow)"/>
              <circle cx="550" cy="450" r="40" fill="#166534" opacity="0.8" filter="url(#shadow)"/>

            </svg>
        </div>

        {/* === ПИНЫ ДАТЧИКОВ === */}
        <div className="map-cities">
          
          <div style={{'--x': 23, '--y': 82}} className="map-city" data-status="active">
            <div className="map-city__label"><span data-icon="🚗" className="map-city__sign">Ворота: Открыто</span></div>
          </div>
          
          <div style={{'--x': 60, '--y': 65}} className="map-city" data-status="active">
            <div className="map-city__label"><span data-icon="📹" className="map-city__sign">Камера: Запись</span></div>
          </div>
          
          <div style={{'--x': 50, '--y': 40}} className="map-city main-hub">
            <div className="map-city__label"><span data-icon="🧠" className="map-city__sign">Центральный HUB</span></div>
          </div>
          
          <div style={{'--x': 75, '--y': 30}} className="map-city" data-status="normal">
            <div className="map-city__label"><span data-icon="🌡️" className="map-city__sign">Бассейн: 24°C</span></div>
          </div>
          
          <div style={{'--x': 75, '--y': 70}} className="map-city" data-status="warning">
            <div className="map-city__label"><span data-icon="🐕" className="map-city__sign">GPS: Бобик</span></div>
          </div>
          
          {/* ЧЕЛОВЕК: Точка ровно над головой (320/600=53.3%, 380/500=76%) */}
          <div style={{'--x': 53.3, '--y': 76}} className="map-city" data-status="normal">
             <div className="map-city__label"><span data-icon="🚶" className="map-city__sign">Движение: Гость</span></div>
          </div>

          <div style={{'--x': 50, '--y': 65}} className="map-city" data-status="normal">
            <div className="map-city__label"><span data-icon="🔔" className="map-city__sign">Домофон</span></div>
          </div>
          
          {/* СОЛНЕЧНЫЕ ПАНЕЛИ */}
          <div style={{'--x': 35, '--y': 25}} className="map-city" data-status="active">
            <div className="map-city__label"><span data-icon="⚡" className="map-city__sign">Электричество: 4.2 kW</span></div>
          </div>

          <div style={{'--x': 45, '--y': 50}} className="map-city" data-status="active">
             <div className="map-city__label"><span data-icon="💧" className="map-city__sign">Протечка: Кухня</span></div>
          </div>
          
          {/* МАНГАЛ: Точка над мангалом (500/600=83.3%, 300/500=60%) */}
          <div style={{'--x': 83.3, '--y': 60}} className="map-city" data-status="warning">
             <div className="map-city__label"><span data-icon="🔥" className="map-city__sign">Мангал: 180°C</span></div>
          </div>

          <div style={{'--x': 35, '--y': 55}} className="map-city" data-status="normal">
             <div className="map-city__label"><span data-icon="🛡️" className="map-city__sign">Охрана: Периметр</span></div>
          </div>
          
          <div style={{'--x': 90, '--y': 10}} className="map-city" data-status="normal">
            <div className="map-city__label"><span data-icon="🌪️" className="map-city__sign">Анемометр: 3 м/с</span></div>
          </div>

          {/* ДАТЧИК ВЛАЖНОСТИ (ВЕРНУЛ) */}
          <div style={{'--x': 15, '--y': 15}} className="map-city" data-status="normal">
             <div className="map-city__label"><span data-icon="🌱" className="map-city__sign">Влага (Газон): 65%</span></div>
          </div>

        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  .map-container {
    --city-sign-color-back: rgba(15, 23, 42, 0.95);
    --city-sign-color-font: #fff;
    position: relative;
    width: 100%;
    max-width: 650px;
    aspect-ratio: 4 / 3; 
    background: transparent;
  }

  .map-background-wrapper {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0,0,0,0.4), inset 0 0 0 2px rgba(255,255,255,0.1);
    background: #7ec850;
    z-index: 1;
  }

  .map-svg { width: 100%; height: 100%; object-fit: cover; }
  .map-cities { width: 100%; height: 100%; position: relative; z-index: 10; overflow: visible; }

  /* ПИНЫ (Маленькие точки) */
  .map-city {
    position: absolute;
    left: calc(var(--x) * 1%);
    top: calc(var(--y) * 1%);
    width: 12px; height: 12px;
    background: #ef4444; 
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    transform: translate(-50%, -50%);
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 20;
  }

  .map-city[data-status="active"] { background: #22c55e; }
  .map-city[data-status="normal"] { background: #3b82f6; }
  .map-city[data-status="warning"] { background: #f59e0b; animation: pulse-warning 1s infinite; }

  .map-city.main-hub {
    width: 18px; height: 18px;
    background: #a855f7;
    border-radius: 4px;
    transform: translate(-50%, -50%) rotate(45deg);
  }

  .map-city:hover {
    transform: translate(-50%, -50%) scale(1.5);
    z-index: 100;
    border-color: #fbbf24;
  }

  .map-city__label {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    bottom: 20px; 
    left: 50%;
    transform: translateX(-50%) translateY(5px);
    white-space: nowrap;
    z-index: 50;
    transition: all 0.2s ease;
    pointer-events: none;
  }

  .map-city:hover .map-city__label {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }

  .map-city__sign {
    background: var(--city-sign-color-back);
    color: var(--city-sign-color-font);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    display: flex; align-items: center; gap: 6px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.2);
  }
  
  .map-city__sign::before { content: attr(data-icon); font-size: 12px; }

  .map-city__sign::after {
    content: ''; position: absolute; bottom: -4px; left: 50%;
    transform: translateX(-50%);
    border-left: 4px solid transparent; border-right: 4px solid transparent;
    border-top: 4px solid var(--city-sign-color-back);
  }

  @keyframes pulse-warning {
    0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
    70% { box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
    100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
  }
`;

export default Mesto;