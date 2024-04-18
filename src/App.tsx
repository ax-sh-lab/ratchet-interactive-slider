import { useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DraggableComponent } from './SnapToSibling.tsx';
import { RatchetSlider } from './ratchetSlider.tsx';

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
      <div className='measure'>{value}</div>
      <RatchetSlider onChange={setValue} />
      {/*<Slidera onChange={setValue} />*/}

      {/*<DraggableComponenta />*/}
    </main>
  );
}

export default App;
