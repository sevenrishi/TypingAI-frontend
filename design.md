# Design Document

## Architecture Overview

### Frontend Architecture
- **Framework**: React with TypeScript
- **State Management**: Redux Toolkit with feature-based slices
- **Routing**: React Router with protected routes
- **Styling**: Tailwind CSS with custom theme
- **Build Tool**: Vite

### Folder Structure
```
src/
├── api/              # API clients and services
├── assets/           # Static assets (images, icons)
├── components/       # Shared components
├── features/         # Feature-based modules
│   ├── ai/          # AI typing features
│   ├── auth/        # Authentication
│   ├── learn/       # Learning modules
│   ├── multiplayer/ # Multiplayer functionality
│   ├── practice/    # Practice mode
│   ├── typing/      # Core typing logic
│   └── user/        # User profile
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── providers/       # Context providers
├── store/           # Redux store configuration
└── utils/           # Utility functions
```

## Component Design

### Core Components

#### TypingLoader
- Displays loading animation with typing effect
- Used across the application for loading states

#### AnimatedTypingTitle
- Animated title component with typing animation
- Provides visual engagement on landing pages

#### ProtectedRoute
- Route wrapper for authentication
- Redirects unauthorized users to login

#### UserHistory
- Displays user's typing history
- Shows performance metrics over time

### Feature Modules

#### Authentication (auth/)
- SignIn, SignUp components
- Password reset flow
- JWT token management
- Redux slice for auth state

#### Typing (typing/)
- Core typing logic and state
- Real-time WPM/accuracy calculation
- Input handling and validation
- Performance metrics

#### Multiplayer (multiplayer/)
- Room management
- Real-time opponent tracking
- Socket.io integration
- Battleground UI

#### AI Features (ai/)
- AI test generation
- AI practice mode
- AI multiplayer integration

#### Practice (practice/)
- Solo practice mode
- Customizable practice sessions
- Progress tracking

#### Learning (learn/)
- Interactive lessons
- Learning guides
- Skill progression

## State Management

### Redux Store Structure
```
store/
├── auth          # Authentication state
├── typing        # Typing session state
├── practice      # Practice mode state
├── multiplayer   # Room and opponent state
├── ai            # AI features state
└── user          # User profile state
```

### State Flow
1. User actions dispatch Redux actions
2. Reducers update state immutably
3. Components subscribe to state changes
4. UI re-renders based on state updates

## Real-time Features

### Socket.io Integration
- SocketProvider wraps the application
- Real-time multiplayer synchronization
- Room events handling
- Connection state management

### Socket Events
- Room creation/joining
- Typing progress updates
- Player state changes
- Game start/end events

## Styling System

### Tailwind CSS
- Utility-first CSS framework
- Custom theme configuration
- Dark/light mode support
- Responsive design patterns

### Theme Provider
- Global theme state
- Theme switching functionality
- Persistent theme preferences

## API Integration

### Axios Configuration
- Centralized API client
- Request/response interceptors
- JWT token injection
- Error handling

### API Services
- Authentication endpoints
- User data endpoints
- Session management
- Results tracking
- Password reset service

## Routing

### Route Structure
```
/                  # Home page
/login             # Login page
/signup            # Signup page
/practice          # Practice mode
/battleground      # Multiplayer mode
/learn             # Learning page
/profile           # User profile
/activate/:token   # Email activation
/reset-password    # Password reset
```

### Route Protection
- Public routes: home, login, signup
- Protected routes: practice, battleground, profile
- Redirect logic for unauthorized access

## Performance Optimizations

### Code Splitting
- Lazy loading of route components
- Dynamic imports for heavy features
- Reduced initial bundle size

### State Optimization
- Memoized selectors
- Efficient re-render prevention
- Debounced input handling

### Asset Optimization
- Optimized images
- Tree-shaking unused code
- Minified production builds

## Testing Strategy

### Unit Tests
- Component testing with Vitest
- Redux slice testing
- Utility function testing
- Hook testing

### Integration Tests
- Feature flow testing
- API integration testing
- Socket event testing

## Accessibility

### WCAG Compliance
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

### User Experience
- Clear error messages
- Loading states
- Success feedback
- Intuitive navigation
