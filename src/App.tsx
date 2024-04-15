import { useEffect, useState } from 'react';

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
  useEffect(() => {
    const slider = document.querySelector<HTMLDivElement>('.slider');
    const handle = document.querySelector<HTMLDivElement>('.slider-handle');
    const measure = document.querySelector<HTMLDivElement>('.measure');
    if (!slider) return;
    if (!handle) return;

    // Define slider properties
    const sliderWidth = slider.offsetWidth;
    const handleWidth = handle.offsetWidth;
    const intervals = 10; // Number of intervals on the slider
    const intervalWidth = (sliderWidth - handleWidth) / intervals;

    // Function to calculate nearest interval and update measure
    function updateMeasure() {
      const percent = (handle.offsetLeft / (sliderWidth - handleWidth)) * 100;
      const position = Math.round((percent / 100) * intervals);
      measure.textContent = position;
      handle.style.left = position * intervalWidth + 'px';
    }

    // Event listeners for dragging the handle
    let isDragging = false;
    let startX: number;
    let startLeft: number;
    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startLeft = handle.offsetLeft;
    });

    handle.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        const newLeft = startLeft + deltaX;
        if (newLeft >= 0 && newLeft <= sliderWidth - handleWidth) {
          handle.style.left = newLeft + 'px';
        }
      }
      updateMeasure();
    });

    handle.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }, []);

  return (
    <main className={'container m-auto'}>
      <div className={'h-32'}></div>
      <div className='slider'>
        <div className='slider-handle'></div>
      </div>
      <div className='measure'>0</div>
    </main>
  );
}

export default App;
