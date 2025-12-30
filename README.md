# Pomodoro Timer

A simple, beautiful Pomodoro timer that runs in your browser.

## Features

- **25-minute work sessions** - Focus on your tasks
- **5-minute short breaks** - Quick rest between sessions
- **15-minute long breaks** - Extended rest after 4 pomodoros
- **Visual countdown timer** - See time remaining at a glance
- **Start/Pause/Reset controls** - Full control over your timer
- **Daily pomodoro counter** - Track your productivity
- **Sound notifications** - Audio alert when timer completes
- **Browser notifications** - Optional desktop notifications (requires permission)
- **Responsive design** - Works on desktop and mobile
- **Local storage** - Pomodoro count persists across sessions and resets daily

## How to Use

1. Open `index.html` in your web browser
2. Select your mode: Work, Short Break, or Long Break
3. Click "Start" to begin the timer
4. Click "Pause" to pause if needed
5. Click "Reset" to restart the current session
6. When the timer completes, it will automatically switch to the next mode (work → break → work)

## Tips

- The timer automatically switches from work sessions to breaks (long break after every 4 pomodoros)
- Your pomodoro count resets daily at midnight
- Allow browser notifications for alerts when the timer completes
- The timer will play a sound notification when it completes

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- CSS Grid/Flexbox
- LocalStorage API
- Web Audio API (for notifications)

