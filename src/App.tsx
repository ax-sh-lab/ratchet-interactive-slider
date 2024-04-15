import { useCallback, useEffect, useState } from 'react';

function Slider({ onChange }: { onChange: (value: number) => void }) {
  useEffect(() => {
    const slider = document.querySelector<HTMLDivElement>('.slider');
    const handle = document.querySelector<HTMLDivElement>('.slider-handle');
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
      onChange(position);
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

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        const newLeft = startLeft + deltaX;
        if (newLeft >= 0 && newLeft <= sliderWidth - handleWidth) {
          handle.style.left = newLeft + 'px';
        }
      }
      updateMeasure();
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }, []);

  return (
    <div className='slider'>
      <div className='slider-handle'></div>
    </div>
  );
}

function Slidera({ onChange }: { onChange: (value: number) => void }) {
  const [position, setPosition] = useState(0);

  // Calculate slider properties whenever position changes
  useEffect(() => {
    const intervals = 10; // Number of intervals on the slider
    const intervalWidth = (100 - (1 / intervals) * 100) / intervals; // Adjust for handle width

    // Update measure whenever position changes
    onChange(position);
  }, [position, onChange]);

  // Handle mouse down event for dragging the handle
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const startLeft = e.currentTarget.offsetLeft;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newLeft = startLeft + deltaX;

      // Update position within slider bounds
      if (newLeft >= 0 && newLeft <= 100) {
        const newPosition = Math.round((newLeft / 100) * 10); // 10 intervals
        setPosition(newPosition);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div className='slider'>
      <div
        style={{ left: `${(position / 10) * 100}%` }} // Set handle position dynamically
        onMouseDown={handleMouseDown}
        className='slider-handle'
      ></div>
    </div>
  );
}

function App() {
  const [value, setValue] = useState('');
  return (
    <main className={'container m-auto'}>
      <div className={'h-32'}></div>
      {/*<Slider onChange={setValue} />*/}
      <Slidera onChange={setValue} />
      <div className='measure'>{value}</div>
    </main>
  );
}

export default App;
