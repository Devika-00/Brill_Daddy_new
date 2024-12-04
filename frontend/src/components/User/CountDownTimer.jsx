import React, { useState, useEffect } from "react";

const CountdownTimer = ({ voucher }) => {
    const [timeLeft, setTimeLeft] = useState({});
    useEffect(() => {
      const calculateTimeLeft = () => {
        // Determine the correct end time based on rebid_active
        const endTime = voucher.rebid_active
          ? new Date(voucher.rebid_end_time).getTime()
          : new Date(voucher.end_time).getTime();
          
        const difference = endTime - new Date().getTime();
  
        if (difference > 0) {
          return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          };
        }
        return null;
      };
  
      const updateTimer = () => {
        const timeLeft = calculateTimeLeft();
        setTimeLeft(timeLeft);
      };
  
      updateTimer(); // Initial call
      const timer = setInterval(updateTimer, 1000);
  
      return () => clearInterval(timer);
    }, [voucher]);
  
  
    if (!timeLeft) return null;
  
    return (
      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg font-mono text-sm z-50">
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {`${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
      </div>
    );
  };

export default CountdownTimer;  