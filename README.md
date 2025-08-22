# Lindholmen Gems

A location based interactive walking game that transforms Lindholmen into an engaging adventure. Players walk between real locations, complete fun challenges, and collect puzzle pieces together.

## Features

### Location-Based Gameplay

- Real-time GPS tracking with high accuracy
- Interactive map with Leaflet integration
- Automatic location unlocking when players reach targets
- Distance calculation and progress tracking

### Multiplayer Experience

- Real-time collaboration with Supabase
- Session-based gameplay with unique codes
- Live participant tracking
- Synchronized progress across devices

### Interactive Challenges

- Unique locations around Lindholmen
- Creative team-building activities
- Progressive difficulty and engagement
- Achievement system with puzzle pieces

### Modern Web App

- Responsive design for mobile and desktop
- Offline-capable with service workers
- Real-time updates without page refresh
- Smooth animations and transitions

## How It Works

1. **Start a Walk**: Create a new session or join with a team code
2. **Navigate**: Follow the map to reach marked locations
3. **Unlock**: Get close enough to unlock challenges
4. **Complete**: Work together to solve fun team activities
5. **Collect**: Gather puzzle pieces and track progress
6. **Finish**: Complete all locations to finish the adventure

## Architecture

### Frontend

- **Next.js 15** with App Router
- **React 19** with modern hooks
- **Tailwind CSS** for styling
- **Leaflet** for interactive maps

### Backend

- **Supabase** for real-time database
- **PostgreSQL** for data storage
- **Real Time subscriptions** for live updates
- **Row Level Security** for data protection

### Key Technologies

- **Geolocation API** for location tracking
- **WebSocket** connections for real-time features
- **Progressive Web App** capabilities
- **Vercel** for deployment

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- npm or yarn package manager
- Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone (https://github.com/maxjvjohansson/lindholmen-gems)
   cd lindholmen-gems
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
lindholmen-gems/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── explore/           # Main game interface
│   │   ├── start/             # Session start page
│   │   └── config/            # Game configuration
│   ├── components/            # Reusable React components
│   │   ├── Map/              # Interactive map component
│   │   ├── Button/           # Custom button components
│   │   ├── Modal/            # Modal dialogs
│   │   └── ...               # Other UI components
│   ├── lib/                  # Utility functions and hooks
│   │   ├── supabaseClient.js # Supabase client configuration
│   │   ├── sessionApi.js     # Session management API
│   │   ├── useSessionProgress.js # Real-time progress hook
│   │   └── taskContents.js   # Game content and challenges
│   └── assets/               # Static assets and icons
├── public/                   # Public static files
└── package.json             # Dependencies and scripts
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Components

- **ExploreClient** - Main game logic and GPS tracking
- **Map** - Interactive map with Leaflet
- **useSessionProgress** - Real-time session management
- **useParticipants** - Multiplayer participant tracking

### Customization

- **Locations**: Modify `taskContents.js` for new locations
- **Challenges**: Add new activities in the content array
- **Styling**: Update Tailwind classes for visual changes
- **Database**: Extend Supabase schema for new features

1. **Connect Repository**

   - Fork or push your code to GitHub
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect it's a Next.js project

2. **Environment Variables**
   Add the following environment variables in your Vercel project settings:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

3. **Deploy**

   - Vercel will automatically deploy on every push to the main branch
   - Preview deployments are created for pull requests
   - Custom domains can be configured in the Vercel dashboard

4. **Performance Optimizations**
   - Vercel automatically optimizes Next.js applications
   - Edge functions for global performance
   - Automatic image optimization
   - CDN distribution worldwide

## Authors

- **Johan Hagman**
- **Max Johansson**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
