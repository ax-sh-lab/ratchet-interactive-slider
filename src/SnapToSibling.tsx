import React, { useEffect, useRef, useState } from 'react';

const DraggableComponent = ({ id, children, onPositionChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setPosition({
      x: event.clientX - ref.current.offsetLeft,
      y: event.clientY - ref.current.offsetTop
    });
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const newX = event.clientX - position.x;
    const newY = event.clientY - position.y;

    // Calculate the position of the dragged element relative to its siblings
    const siblingElements = Array.from(ref.current.parentNode.children);
    const index = siblingElements.indexOf(ref.current);
    const siblingPositions = siblingElements.map((sibling) => ({
      element: sibling,
      top: sibling.offsetTop,
      bottom: sibling.offsetTop + sibling.offsetHeight
    }));

    // Determine the closest sibling element and the direction of the snap
    let snapToSibling = null;
    let snapDirection = null;
    siblingPositions.forEach((sibling, i) => {
      if (i === index) return;
      if (newY >= sibling.top && newY <= sibling.bottom) {
        if (newY < sibling.top + (sibling.bottom - sibling.top) / 2) {
          snapToSibling = sibling.element;
          snapDirection = 'above';
        } else {
          snapToSibling = sibling.element;
          snapDirection = 'below';
        }
      }
    });

    // Update the position of the dragged element to snap to the appropriate sibling
    if (snapToSibling) {
      if (snapDirection === 'above') {
        setPosition({
          x: newX,
          y: snapToSibling.offsetTop - ref.current.offsetHeight
        });
      } else {
        setPosition({
          x: newX,
          y: snapToSibling.offsetTop + snapToSibling.offsetHeight
        });
      }
    } else {
      setPosition({
        x: newX,
        y: newY
      });
    }

    onPositionChange({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'move' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};

export const DraggableComponenta = () => {
  return (
    <div style={{ position: 'relative', height: '500px' }}>
      <DraggableComponent id='1' onPositionChange={(pos) => console.log(pos)}>
        Item 1
      </DraggableComponent>
      <DraggableComponent id='2' onPositionChange={(pos) => console.log(pos)}>
        Item 2
      </DraggableComponent>
      <DraggableComponent id='3' onPositionChange={(pos) => console.log(pos)}>
        Item 3
      </DraggableComponent>
    </div>
  );
};
