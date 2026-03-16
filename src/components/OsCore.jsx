import React from 'react';
import styled from 'styled-components';

const OsCore = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="inner one" />
        <div className="inner two" />
        <div className="inner three" />
        <div className="core-text">OS</div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    perspective: 800px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .inner {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: 50%;  
  }

  /* Внешнее кольцо */
  .inner.one {
    left: 0%;
    top: 0%;
    animation: rotate-one 1.5s linear infinite;
    border-bottom: 4px solid var(--accent-color);
    box-shadow: 0 0 10px var(--accent-color);
    filter: drop-shadow(0 0 5px var(--accent-color));
  }

  /* Среднее кольцо */
  .inner.two {
    right: 0%;
    top: 0%;
    animation: rotate-two 1.5s linear infinite;
    border-right: 4px solid var(--text-color);
    box-shadow: 0 0 10px var(--text-color);
    opacity: 0.8;
  }

  /* Внутреннее кольцо */
  .inner.three {
    right: 0%;
    bottom: 0%;
    width: 70%;
    height: 70%;
    margin: 15%; /* Центрирование (100-70)/2 */
    animation: rotate-three 1.5s linear infinite;
    border-top: 4px solid #a855f7; /* Purple */
    box-shadow: 0 0 10px #a855f7;
    filter: drop-shadow(0 0 5px #a855f7);
  }

  /* Текст в центре */
  .core-text {
    font-family: monospace;
    font-weight: 900;
    font-size: 24px;
    color: var(--text-color);
    animation: pulse 2s infinite;
    text-shadow: 0 0 10px var(--accent-color);
    z-index: 10;
  }

  @keyframes rotate-one {
    0% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg); }
    100% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg); }
  }

  @keyframes rotate-two {
    0% { transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg); }
    100% { transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg); }
  }

  @keyframes rotate-three {
    0% { transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg); }
    100% { transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.9); }
  }
`;

export default OsCore;