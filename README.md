# neko.OS - Terminal Portfolio

An immersive, cinematic developer portfolio website designed to look like a futuristic operating system terminal. Experience an interactive 3D environment with a fully functional command-line interface.

## 🎨 Features

- **3D Animated Background**: Floating particles powered by Three.js and react-three-fiber
- **Terminal Emulation**: Full xterm.js terminal with command history and auto-complete
- **Command System**: Navigate your portfolio through Unix-like commands
- **Glassmorphism UI**: Modern, sleek terminal window with macOS-style controls
- **Boot Sequence**: Authentic OS boot animation on page load
- **Responsive Design**: Works seamlessly on desktop and tablet devices

## 🚀 Tech Stack

- **React 19** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Three.js / react-three-fiber** - 3D graphics and animations
- **xterm.js** - Terminal emulator
- **Framer Motion** - Smooth UI animations
- **Tailwind CSS** - Utility-first styling

## 📁 Project Structure

```
cli-port/
├── src/
│   ├── components/
│   │   ├── three/
│   │   │   ├── BackgroundScene.jsx    # Main 3D canvas
│   │   │   └── Particles.jsx          # Particle system
│   │   ├── Terminal.jsx               # Terminal emulator
│   │   └── TerminalWindow.jsx         # OS-style window chrome
│   ├── core/
│   │   ├── commandParser.js           # Command execution engine
│   │   └── fileSystem.js              # Virtual file system
│   ├── data/
│   │   ├── profile.json               # Personal information
│   │   ├── projects.json              # Project portfolio
│   │   └── skills.json                # Technical skills
│   ├── App.jsx                        # Main application
│   └── main.jsx                       # Entry point
└── package.json
```

## 🎮 Available Commands

Once the terminal loads, try these commands:

### Information Commands
- `help` - Display all available commands
- `about` - Learn about the developer
- `skills` - View technical skills
- `projects` - Browse portfolio projects
- `contact` - Get contact information
- `neofetch` - Display system information

### Navigation Commands
- `ls [path]` - List directory contents
- `cd [directory]` - Change directory
- `pwd` - Print working directory
- `clear` - Clear terminal screen

### Project Commands
- `run [project-name]` - Launch project demo (if deployed)
- `github [project-name]` - Open project repository

### System Commands
- `whoami` - Display current user
- `echo [text]` - Print text to terminal

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cli-port.git
   cd cli-port
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎨 Customization

### Update Your Information

1. **Profile Data**: Edit `src/data/profile.json`
   ```json
   {
     "name": "Your Name",
     "username": "yourusername",
     "title": "Your Title",
     "bio": "Your bio...",
     "email": "your@email.com",
     "github": "https://github.com/yourusername"
   }
   ```

2. **Projects**: Edit `src/data/projects.json`
   ```json
   [
     {
       "id": "project-id",
       "name": "Project Name",
       "description": "Description...",
       "technologies": ["React", "Node.js"],
       "github": "https://github.com/...",
       "deployed": true,
       "demoUrl": "https://..."
     }
   ]
   ```

3. **Skills**: Edit `src/data/skills.json`
   ```json
   {
     "languages": ["JavaScript", "Python"],
     "frontend": ["React", "Vue"],
     "backend": ["Node.js", "Django"]
   }
   ```

### Customize Theme Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  terminal: {
    bg: '#0a0e14',      // Terminal background
    text: '#00ff41',    // Primary text (green)
    cyan: '#00ffff',    // Accent color
    purple: '#bd93f9',  // Secondary accent
  },
}
```

### Modify Particle Count

In `src/components/three/BackgroundScene.jsx`:
```javascript
<FloatingParticles count={300} /> // Change count value
```

## 🎯 Key Features Explained

### Boot Sequence
The terminal displays an authentic OS boot sequence on initial load, creating an immersive experience.

### File System
A virtual file system allows navigation through your portfolio:
```
/home/chethan/
├── projects/
│   ├── dhcp-server/
│   ├── redis-cache/
│   └── ai-tutor/
├── about.txt
├── skills.txt
└── contact.txt
```

### Command History
Use arrow keys (↑/↓) to navigate through previously executed commands.

### 3D Background
Lightweight particle system with smooth animations that doesn't impact terminal performance.

## 🚀 Performance

- Optimized particle rendering (~300 particles)
- Efficient terminal updates
- Lazy-loaded 3D canvas
- Minimal bundle size

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 📝 License

MIT License - feel free to use this for your own portfolio!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📧 Contact

For questions or feedback, reach out via the contact information in the terminal!

---

Built with ❤️ using React, Three.js, and xterm.js
