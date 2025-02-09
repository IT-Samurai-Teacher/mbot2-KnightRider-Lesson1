import React, { useState, useEffect } from 'react';
import { Moon, Sun, Power, ArrowDownToLine, ArrowUpFromLine, Youtube, Code, Lock, Unlock, Copy, Check, ChevronLeft } from 'lucide-react';

// Protected Code Component
const ProtectedMBotCode = ({ onBack }) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const correctPassword = '1234';
  
  const mbotScript = `"""
MBot2 Knight Rider LED Pattern Control
Created by: Shihab Doole (IT Samurai Teacher)

🎥 Follow my YouTube channel for more tutorials:
   https://youtube.com/@ITSamuraiTeacher

🌐 More resources and tutorials:
   - Website: https://samuraiteacher.com/
   - TikTok: https://www.tiktok.com/@shihabdoole
   - LinkedIn: https://www.linkedin.com/in/sdoole/
   - Email: Hello@samuraiteacher.com

© 2025 IT Samurai Teacher. All rights reserved.
Feel free to use this code for educational purposes!
"""

import mbuild
import mbot2
import event
import time
import cyberpi

def do_knight_rider_scan(color):
    # Forward scan
    for i in range(8):
        cyberpi.led.on(color, id=i)
        time.sleep(0.05)
        cyberpi.led.off(id=i)
    
    # Backward scan
    for i in range(6, -1, -1):
        cyberpi.led.on(color, id=i)
        time.sleep(0.05)
        cyberpi.led.off(id=i)

@event.start
def on_start():
    while True:
        # Get distance from ultrasonic sensor
        distance = mbuild.ultrasonic2.get(1)
        
        if distance < 10:  # Obstacle detected
            # Stop movement
            mbot2.forward(0)
            # Do red scanning effect
            do_knight_rider_scan('red')
        else:
            # Move forward
            mbot2.forward(30)
            # Do green scanning effect
            do_knight_rider_scan('green')
        
        time.sleep(0.01)  # Small delay to prevent processor overload`;

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mbotScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 mb-4 px-4 py-2 text-gray-600 hover:text-gray-800"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Demo</span>
      </button>

      {!isUnlocked ? (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold">Enter Password to View Code</h2>
          </div>
          
          <input
            type="password"
            value={password}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setPassword(value);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handlePasswordSubmit();
              }
            }}
            placeholder="Enter numeric password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button 
            onClick={handlePasswordSubmit}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Unlock Code
          </button>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Unlock className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold">MBot2 Knight Rider Code</h2>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-4 py-2 border rounded hover:bg-gray-50"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm">{mbotScript}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

// Main Component
const MBot2Demo = () => {
  const [isDayMode, setIsDayMode] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [robotPosition, setRobotPosition] = useState(0);
  const [robotState, setRobotState] = useState('stopped');
  const [barrierPosition] = useState(70);
  const [isBarrierOpen, setIsBarrierOpen] = useState(false);
  const [ledPosition, setLedPosition] = useState(0);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    let ledInterval;
    if (isActive) {
      ledInterval = setInterval(() => {
        setLedPosition(prev => {
          if (prev >= 5) return 0;
          return prev + 1;
        });
      }, 100);
    }
    return () => clearInterval(ledInterval);
  }, [isActive]);

  useEffect(() => {
    let moveInterval;
    if (isActive && robotState === 'moving') {
      moveInterval = setInterval(() => {
        setRobotPosition(prev => {
          const nextPos = prev + 1;
          if (Math.abs(nextPos - barrierPosition) < 5 && !isBarrierOpen) {
            setRobotState('waiting');
            return prev;
          }
          if (nextPos > 100) return 0;
          return nextPos;
        });
      }, 50);
    }
    return () => clearInterval(moveInterval);
  }, [isActive, robotState, isBarrierOpen, barrierPosition]);

  const togglePower = () => {
    setIsActive(prev => !prev);
    if (!isActive) {
      setRobotState('moving');
    } else {
      setRobotState('stopped');
    }
  };

  const toggleBarrier = () => {
    setIsBarrierOpen(prev => !prev);
    if (!isBarrierOpen) {
      setTimeout(() => {
        if (robotState === 'waiting') {
          setRobotState('moving');
        }
      }, 1000);
    }
  };

  if (showCode) {
    return <ProtectedMBotCode onBack={() => setShowCode(false)} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className={`relative w-full h-96 rounded-xl shadow-xl overflow-hidden transition-colors duration-1000 ${
        isDayMode ? 'bg-gradient-to-b from-blue-200 to-blue-100' : 'bg-gradient-to-b from-gray-900 to-blue-900'
      }`}>
        
        {!isDayMode && (
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60}%`,
                  animation: 'twinkle 2s infinite',
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="absolute top-4 left-4 flex flex-col gap-4">
          <button
            onClick={() => setIsDayMode(prev => !prev)}
            className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center"
          >
            {isDayMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </button>
          <button
            onClick={togglePower}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            <Power className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={toggleBarrier}
            className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center"
          >
            {isBarrierOpen ? <ArrowDownToLine className="w-6 h-6" /> : <ArrowUpFromLine className="w-6 h-6" />}
          </button>
        </div>

        <div className="absolute top-4 right-4 text-lg font-bold text-gray-800">
          Status: {robotState.charAt(0).toUpperCase() + robotState.slice(1)}
        </div>

        <div className="absolute bottom-0 w-full h-32 bg-gray-800">
          <div className="absolute top-1/2 w-full h-2 bg-gray-300 opacity-50"></div>
        </div>

        <div className="absolute bottom-24 w-4 h-40" style={{ left: `${barrierPosition}%` }}>
          <div className="w-full h-full bg-gray-600"></div>
          <div 
            className={`absolute top-0 -left-24 w-28 h-4 bg-red-500 border-2 border-white transition-transform duration-1000 ${
              isBarrierOpen ? 'rotate-90' : 'rotate-0'
            }`}
          ></div>
        </div>

        <div 
          className={`absolute bottom-20 w-24 h-16 rounded-lg transition-all duration-50 ${
            isDayMode ? 'bg-blue-500' : 'bg-blue-700'
          }`}
          style={{ left: `${robotPosition}%` }}
        >
          <div className="absolute top-2 left-2 right-2 h-3 bg-gray-900 rounded-sm overflow-hidden flex">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex-1 h-full transition-colors duration-200"
                style={{
                  backgroundColor: !isActive ? '#666' :
                    (i === ledPosition) ? 
                      (robotState === 'waiting' ? '#ff0000' : '#00ff00') : 
                      '#000'
                }}
              />
            ))}
          </div>
          
          <div className="absolute bottom-0 left-2 w-4 h-4 bg-gray-700 rounded-full" />
          <div className="absolute bottom-0 right-2 w-4 h-4 bg-gray-700 rounded-full" />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            MBot2 Knight Rider Lessons Series
          </h1>
          <h2 className="text-xl text-gray-700">
            Lesson 1 - LED Pattern Control
          </h2>
        </div>

        <div className="text-center text-gray-600">
          Watch the Knight Rider lights scan in green while moving and red when stopped!
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowCode(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <Code className="w-5 h-5" />
            <span>View Code (Password Protected)</span>
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Youtube className="w-6 h-6 text-red-600" />
            <span className="font-bold text-gray-800">IT Samurai Teacher</span>
          </div>
          <a 
            href="https://www.youtube.com/@ITSamuraiTeacher" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
          >
            <span>@ITSamuraiTeacher</span>
          </a>
          <div className="text-sm text-gray-500">
            Subscribe for more robotics tutorials and projects!
          </div>
        </div>
      </div>
    </div>
  );
};

export default MBot2Demo;