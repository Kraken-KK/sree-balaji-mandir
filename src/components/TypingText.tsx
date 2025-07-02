
import React, { useEffect, useState } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number; // ms per character
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 18 }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}<span className="animate-blink">|</span></span>;
};

export default TypingText;
