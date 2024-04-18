import { Dispatch, ElementRef, SetStateAction, useEffect, useRef } from 'react';

export function RatchetSlider({ onChange }: { onChange: Dispatch<SetStateAction<string>> }) {
  const sliderRef = useRef<ElementRef<'div'>>(null);
  // Event listeners for dragging the handle
  const stateRef = useRef({ isDragging: false, startX: 0, startLeft: 0 });

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handle = sliderRef.current.querySelector<HTMLDivElement>('.slider-handle');
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
      onChange(position);
      handle.style.left = position * intervalWidth + 'px';
    }

    handle.addEventListener('mousedown', (e) => {
      stateRef.current.isDragging = true;
      stateRef.current.startX = e.clientX;
      stateRef.current.startLeft = handle.offsetLeft;
    });

    document.addEventListener('mousemove', (e) => {
      const state = stateRef.current;
      if (state.isDragging) {
        const deltaX = e.clientX - state.startX;
        const newLeft = state.startLeft + deltaX;
        if (newLeft >= 0 && newLeft <= sliderWidth - handleWidth) {
          handle.style.left = newLeft + 'px';
        }
      }
      updateMeasure();
    });

    document.addEventListener('mouseup', () => {
      stateRef.current.isDragging = false;
    });
  }, [onChange]);

  return (
    <div className='slider relative w-[500px] h-[20px] bg-[#ccc]' ref={sliderRef}>
      <div className='slider-handle absolute w-[20px] top-1/2 -translate-y-1/2 h-[20px] bg-[#333]'></div>
    </div>
  );
}
