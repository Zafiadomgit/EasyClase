import React, { useState, useEffect } from 'react';

const RotatingText = ({ 
  texts = [],
  rotationInterval = 2000,
  className = '',
  ...props 
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    console.log('RotatingText mounted with texts:', texts);
    if (texts.length <= 1) return;
    
    const interval = setInterval(() => {
      console.log('Rotating text...');
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) => {
          const nextIndex = prevIndex === texts.length - 1 ? 0 : prevIndex + 1;
          console.log('Text changed to:', texts[nextIndex]);
          return nextIndex;
        });
        setIsAnimating(false);
      }, 300);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [texts.length, rotationInterval]);

  const currentText = texts[currentTextIndex] || texts[0] || '';
  console.log('Current text:', currentText, 'Index:', currentTextIndex);

  return (
    <span className={className} {...props}>
      <span 
        className={`inline-block transition-all duration-300 ease-out ${
          isAnimating ? 'opacity-0 transform translate-y-6 scale-95' : 'opacity-100 transform translate-y-0 scale-100'
        }`}
      >
        {currentText}
      </span>
    </span>
  );
};

export default RotatingText;