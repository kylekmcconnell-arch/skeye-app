import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Camera, TrendingUp, Users, Bell, Play, Eye, Zap, Globe, Radio, Wifi, MapPin, ThumbsUp, MessageCircle, Share2, Download, X, Settings, ChevronLeft, ChevronRight, Volume2, CreditCard, HardDrive, User, LogOut, ChevronDown, ChevronUp, Send, Film, SkipBack, Plus, Filter, List, Grid, Mail, Lock, EyeOff, Loader, Pencil, Upload, Search } from 'lucide-react';
import logo from './logo.png';
import cameraImg from './camera.png';
import profileImg from './profile.jpg';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Supabase Configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Upload image to Supabase Storage
const uploadAvatar = async (file, userId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;

  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/avatars/${fileName}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': file.type,
      'x-upsert': 'true'
    },
    body: file
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Upload error:', error);
    throw new Error('Failed to upload avatar');
  }

  // Return public URL
  return `${SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;
};

// Auth Context
const AuthContext = createContext(null);

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skeye_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password, avatarUrl) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, avatarUrl })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    localStorage.setItem('skeye_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signin = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signin failed');
    localStorage.setItem('skeye_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('skeye_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!user, signup, signin, logout, API_URL }}>
      {children}
    </AuthContext.Provider>
  );
}

// Auth Modal Component
function AuthModal({ isOpen, onClose, canClose = true }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const { signin, signup } = useAuth();

  // Default avatar options
  const defaultAvatars = [
    'https://api.dicebear.com/7.x/bottts/svg?seed=robot1&backgroundColor=0a5c36',
    'https://api.dicebear.com/7.x/bottts/svg?seed=robot2&backgroundColor=0a5c36',
    'https://api.dicebear.com/7.x/bottts/svg?seed=robot3&backgroundColor=0a5c36',
    'https://api.dicebear.com/7.x/bottts/svg?seed=alien1&backgroundColor=0a5c36',
    'https://api.dicebear.com/7.x/bottts/svg?seed=alien2&backgroundColor=0a5c36',
    'https://api.dicebear.com/7.x/bottts/svg?seed=ufo1&backgroundColor=0a5c36',
  ];

  if (!isOpen) return null;

  // Convert data URL to File for upload
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, {type: mime});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signin(email, password);
      } else {
        let finalAvatarUrl = avatarPreview;
        
        // If avatar is a data URL (custom upload), upload to Supabase first
        if (avatarPreview && avatarPreview.startsWith('data:')) {
          const file = dataURLtoFile(avatarPreview, `avatar-${Date.now()}.jpg`);
          finalAvatarUrl = await uploadAvatar(file, username);
        }
        
        await signup(username, email, password, finalAvatarUrl);
      }
      if (canClose) onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[20000] flex items-center justify-center p-4">
      <div className="bg-[#141414] rounded-2xl w-full max-w-md overflow-hidden border border-gray-700" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-gray-800 text-center">
          <img src={logo} alt="SKEYE.AI" className="h-8 mx-auto mb-4" />
          <p className="text-xs text-gray-400">
            {mode === 'signin' ? 'Sign in to access the global sky-watching network' : 'Create an account to start tracking the skies'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
          )}

          {mode === 'signup' && (
            <>
              {/* Avatar Selection */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Choose Avatar</label>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Upload custom avatar button */}
                  <label className={`w-12 h-12 rounded-full border-2 border-dashed transition-all cursor-pointer flex items-center justify-center ${avatarPreview && !defaultAvatars.includes(avatarPreview) ? 'border-green-500 bg-green-500/20' : 'border-gray-600 hover:border-gray-500 bg-white/5'}`}>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setAvatarPreview(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {avatarPreview && !defaultAvatars.includes(avatarPreview) ? (
                      <img src={avatarPreview} alt="Custom" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Upload className="w-5 h-5 text-gray-400" />
                    )}
                  </label>
                  {defaultAvatars.map((avatar, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatarPreview(avatar)}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${avatarPreview === avatar ? 'border-green-500 scale-110' : 'border-gray-700 hover:border-gray-500'}`}
                    >
                      <img src={avatar} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Upload your own or choose a preset</p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" required minLength={3} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'Create a password (min 6 chars)' : 'Enter your password'} required minLength={6} className="w-full pl-10 pr-12 py-3 bg-white/5 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-colors">
            {loading ? (<><Loader className="w-5 h-5 animate-spin" />{mode === 'signin' ? 'Signing in...' : 'Creating account...'}</>) : (mode === 'signin' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="relative flex items-center justify-center py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
            <span className="relative px-4 bg-[#141414] text-sm text-gray-500">or</span>
          </div>
          <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-gray-700 rounded-xl font-medium text-white transition-colors">
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

      </div>
    </div>
  );
}

const mockDevices = [
  { id: 1, name: 'Home (Rooftop)', location: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393, status: 'online', detections: 127, signal: 98, serial: 'SKY-2024-0847-A1' },
  { id: 2, name: 'Home (Barn)', location: 'Lisbon, Portugal', lat: 38.7220, lng: -9.1390, status: 'online', detections: 89, signal: 92, serial: 'SKY-2024-1293-B2' },
  { id: 3, name: 'Lake House (Roof)', location: 'Austin, TX', lat: 30.2672, lng: -97.7431, status: 'offline', detections: 203, signal: 0, serial: 'SKY-2024-0156-C3' },
  { id: 4, name: 'Beach House (Roof)', location: 'San Diego, CA', lat: 32.7157, lng: -117.1611, status: 'online', detections: 56, signal: 87, serial: 'SKY-2024-2048-D4' },
];

const myClips = [
  { id: 1, device: 'Home (Rooftop)', time: 'Today, 9:34 PM', type: 'UAP', confidence: 87, duration: '0:32', videoId: 'QKHg-vnTFsM', likes: 24, commentsCount: 8 },
  { id: 2, device: 'Home (Rooftop)', time: 'Today, 8:12 PM', type: 'Aircraft', confidence: 94, duration: '0:18', videoId: 'u1hNYs55sqs', likes: 12, commentsCount: 3 },
  { id: 3, device: 'Home (Barn)', time: 'Today, 6:45 PM', type: 'Drone', confidence: 91, duration: '1:24', videoId: '2TumprpOwHY', likes: 45, commentsCount: 15 },
  { id: 4, device: 'Beach House (Roof)', time: 'Yesterday, 11:23 PM', type: 'UAP', confidence: 76, duration: '0:45', videoId: 'dGOXuuhYoLk', likes: 67, commentsCount: 22 },
];

const mockClips = [
  { id: 1, title: 'GIMBAL - Navy F/A-18 Encounter', location: 'East Coast, USA', timestamp: '2 min ago', views: 12400, classification: 'UAP', confidence: 87, verified: true, siteLikes: 234, siteComments: [{user: 'SkyWatcher_AZ', text: 'Incredible footage! The rotation is unmistakable.', time: '1h ago', avatar: 'S'}, {user: 'DataAnalyst99', text: 'I ran this through my tracking software - no conventional aircraft moves like this.', time: '45m ago', avatar: 'D'}], videoId: 'QKHg-vnTFsM', owner: { username: 'NavyLeak2024', avatar: 'N' } },
  { id: 2, title: 'GO FAST - High Speed Object', location: 'Atlantic Ocean', timestamp: '15 min ago', views: 8900, classification: 'UAP', confidence: 91, verified: true, siteLikes: 156, siteComments: [{user: 'PilotMike', text: 'As a commercial pilot, I can confirm this is not normal.', time: '2h ago', avatar: 'P'}], videoId: 'u1hNYs55sqs', owner: { username: 'PentagonFiles', avatar: 'P' } },
  { id: 3, title: 'FLIR1 Tic Tac - USS Nimitz', location: 'San Diego, CA', timestamp: '1 hour ago', views: 25600, classification: 'UAP', confidence: 96, verified: true, siteLikes: 445, siteComments: [{user: 'NavyVet2020', text: 'I was stationed on the Nimitz. This is real.', time: '3h ago', avatar: 'N'}, {user: 'SkepticalSam', text: 'Could this be a weather balloon?', time: '2h ago', avatar: 'S'}, {user: 'TruthSeeker', text: '@SkepticalSam No way, look at the movement patterns', time: '1h ago', avatar: 'T'}], videoId: '2TumprpOwHY', owner: { username: 'NimitzWitness', avatar: 'N' } },
  { id: 4, title: 'Jellyfish UAP - Iraq 2018', location: 'Iraq', timestamp: '3 hours ago', views: 21000, classification: 'UAP', confidence: 72, verified: true, siteLikes: 312, siteComments: [], videoId: 'dGOXuuhYoLk', owner: { username: 'MilitaryLeaks', avatar: 'M' } },
  { id: 5, title: 'Chilean Navy UFO', location: 'Chile', timestamp: '5 hours ago', views: 18700, classification: 'UAP', confidence: 84, verified: true, siteLikes: 189, siteComments: [{user: 'ChileanObserver', text: 'Finally getting international attention!', time: '4h ago', avatar: 'C'}], videoId: 'iEK3YC_BKTI', owner: { username: 'ChileNavy', avatar: 'C' } },
];

const classifyClips = [
  { id: 1, videoId: 'QKHg-vnTFsM', title: 'Rotating Object - East Coast', location: 'Virginia, USA', confidence: 78, owner: { username: 'SkyWatcher_AZ', avatar: 'S' } },
  { id: 2, videoId: 'u1hNYs55sqs', title: 'High Speed Target - Atlantic', location: 'Atlantic Ocean', confidence: 82, owner: { username: 'DroneHunter', avatar: 'D' } },
  { id: 3, videoId: '2TumprpOwHY', title: 'Tic Tac Shape - Pacific', location: 'San Diego, CA', confidence: 91, owner: { username: 'CosmicEye', avatar: 'C' } },
  { id: 4, videoId: 'dGOXuuhYoLk', title: 'Unknown Object - Middle East', location: 'Iraq', confidence: 67, owner: { username: 'NightOwl42', avatar: 'N' } },
  { id: 5, videoId: 'iEK3YC_BKTI', title: 'Navy Thermal Imaging', location: 'Chile', confidence: 85, owner: { username: 'StarGazer99', avatar: 'S' } },
];

const classificationOptions = [
  { id: 'UAP', label: 'UAP', color: '#a855f7', icon: '◆' },
  { id: 'Drone', label: 'Drone', color: '#3b82f6', icon: '■' },
  { id: 'Aircraft', label: 'Aircraft', color: '#22c55e', icon: '▲' },
  { id: 'Bird', label: 'Bird', color: '#eab308', icon: '●' },
  { id: 'Weather', label: 'Weather', color: '#06b6d4', icon: '○' },
];

const timeRanges = [
  { id: '24h', label: '24H', hours: 24 },
  { id: '7d', label: '7D', hours: 24 * 7 },
  { id: '30d', label: '30D', hours: 24 * 30 },
  { id: 'all', label: 'All', hours: Infinity },
];

const communityPosts = [
  { id: 1, title: 'Multiple sightings over Phoenix', author: 'SkyWatcher_AZ', avatar: 'S', time: '2h ago', upvotes: 234, comments: 89, content: 'Around 9:30 PM I captured a formation of 5 objects.' },
  { id: 2, title: 'Need help identifying this', author: 'NewObserver22', avatar: 'N', time: '4h ago', upvotes: 156, comments: 67, content: 'Object hovered for 2 minutes before accelerating.' },
  { id: 3, title: 'Best camera settings?', author: 'TechExplorer', avatar: 'T', time: '6h ago', upvotes: 89, comments: 45, content: 'What ISO settings work best?' },
];

const notifications = [
  { id: 1, type: 'detection', device: 'Home (Rooftop)', message: 'Unknown object detected', time: '2 min ago', read: false, videoId: 'QKHg-vnTFsM', classification: 'UAP', confidence: 87, location: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393 },
  { id: 2, type: 'detection', device: 'Beach House', message: 'Drone detected', time: '15 min ago', read: false, videoId: 'u1hNYs55sqs', classification: 'Drone', confidence: 92, location: 'San Diego, CA', lat: 32.7157, lng: -117.1611 },
];

const getTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const getPreciseTimeAgo = (timestamp) => {
  const totalSeconds = Math.floor((Date.now() - timestamp) / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  let parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  
  return parts.join(' ') + ' ago';
};

const generateSightings = () => {
  const cities = [
    { city: 'Los Angeles', lat: 34.0522, lng: -118.2437 }, { city: 'New York', lat: 40.7128, lng: -74.0060 },
    { city: 'Phoenix', lat: 33.4484, lng: -112.0740 }, { city: 'London', lat: 51.5074, lng: -0.1278 },
    { city: 'Tokyo', lat: 35.6762, lng: 139.6503 }, { city: 'Sydney', lat: -33.8688, lng: 151.2093 },
  ];
  const types = ['UAP', 'Drone', 'Aircraft', 'Bird', 'Weather'];
  const videoIds = ['QKHg-vnTFsM', 'u1hNYs55sqs', '2TumprpOwHY', 'dGOXuuhYoLk'];
  const owners = [
    { username: 'SkyWatcher_AZ', avatar: 'S' },
    { username: 'NightOwl42', avatar: 'N' },
    { username: 'DroneHunter', avatar: 'D' },
    { username: 'CosmicEye', avatar: 'C' },
    { username: 'StarGazer99', avatar: 'S' },
  ];
  const sampleComments = [
    { id: 1, user: 'Observer1', avatar: 'O', text: 'Incredible footage! Never seen anything like it.', time: '2h ago', likes: 23 },
    { id: 2, user: 'SkepticalSam', avatar: 'S', text: 'Could be a satellite or plane. Need more analysis.', time: '1h ago', likes: 8 },
    { id: 3, user: 'TruthSeeker', avatar: 'T', text: 'This is definitely not conventional aircraft.', time: '45m ago', likes: 15 },
  ];
  const sightings = [];
  const now = Date.now();
  for (let i = 0; i < 100; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const hoursAgo = Math.random() * 24 * 7;
    const timestamp = now - hoursAgo * 60 * 60 * 1000;
    const owner = owners[Math.floor(Math.random() * owners.length)];
    const numComments = Math.floor(Math.random() * 4);
    sightings.push({ 
      id: i + 1, 
      lat: city.lat + (Math.random() - 0.5) * 0.5, 
      lng: city.lng + (Math.random() - 0.5) * 0.5, 
      type: types[Math.floor(Math.random() * types.length)], 
      confidence: Math.floor(65 + Math.random() * 30),
      intensity: 0.5 + Math.random() * 0.5, 
      city: city.city, 
      timestamp, 
      time: getTimeAgo(timestamp), 
      videoId: videoIds[Math.floor(Math.random() * videoIds.length)],
      owner: owner,
      likes: Math.floor(Math.random() * 500),
      commentsCount: numComments,
      siteComments: sampleComments.slice(0, numComments),
    });
  }
  return sightings.sort((a, b) => b.timestamp - a.timestamp);
};

const allSightings = generateSightings();

function AppContent() {
  const { user, isAuthenticated, loading, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState('map');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationsList, setNotificationsList] = useState(notifications);
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);
  
  const [profileSubTab, setProfileSubTab] = useState('devices');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const unreadCount = notificationsList.filter(n => !n.read).length;
  const [currentTime, setCurrentTime] = useState(new Date());
  const liveDevices = mockDevices.filter(d => d.status === 'online').length;

  // Load notifications from user account
  useEffect(() => {
    const loadNotifications = async () => {
      if (!token || notificationsLoaded) return;
      try {
        const res = await fetch(`${API_URL}/api/users/me/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const saved = await res.json();
          if (saved && saved.list) {
            setNotificationsList(saved.list);
          }
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
      setNotificationsLoaded(true);
    };
    loadNotifications();
  }, [token, notificationsLoaded]);

  // Save notifications to user account when they change
  useEffect(() => {
    const saveNotifications = async () => {
      if (!token || !notificationsLoaded) return;
      try {
        await fetch(`${API_URL}/api/users/me/notifications`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ notifications: { list: notificationsList } })
        });
      } catch (err) {
        console.error('Failed to save notifications:', err);
      }
    };
    saveNotifications();
  }, [notificationsList, token, notificationsLoaded]);

  const handleNotificationClick = (notification) => {
    setNotificationsList(prev => prev.map(n => n.id === notification.id ? {...n, read: true} : n));
    setSelectedNotification(notification);
    setShowNotifications(false);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Prevent zoom on mobile
  useEffect(() => {
    // Fix viewport zoom issues on mobile
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(meta);
    }
  }, []);

  useEffect(() => {
    const preventZoom = (e) => {
      if (e.touches && e.touches.length > 1) e.preventDefault();
    };
    const preventDoubleTapZoom = (e) => {
      const now = Date.now();
      if (now - (window.lastTouchEnd || 0) < 300) e.preventDefault();
      window.lastTouchEnd = now;
    };
    document.addEventListener('touchmove', preventZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
    return () => {
      document.removeEventListener('touchmove', preventZoom);
      document.removeEventListener('touchend', preventDoubleTapZoom);
    };
  }, []);

  const baseTabs = [
    { id: 'map', label: 'Map', icon: Globe },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'classify', label: 'Classify', icon: Eye },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Add admin tab if user is admin
  const tabs = user?.role === 'admin' 
    ? [...baseTabs, { id: 'admin', label: 'Admin', icon: Settings }]
    : baseTabs;

  const utcTime = currentTime.toISOString().slice(11, 19) + ' UTC';

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <img src={logo} alt="SKEYE.AI" className="h-10 mx-auto mb-4" />
          <Loader className="w-8 h-8 text-green-400 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      {/* Auth Modal - shown when not authenticated */}
      <AuthModal isOpen={!isAuthenticated} onClose={() => {}} canClose={false} />
      
      {/* Main App - blurred when not authenticated */}
      <div className={`flex flex-col h-full ${!isAuthenticated ? 'blur-sm pointer-events-none' : ''}`}>
      {/* Header */}
      <header className="relative z-[60] border-b border-green-500/20 bg-[#0a0a0a] flex-shrink-0">
        <div className={`flex items-center justify-between ${isMobile ? 'px-3 py-1.5' : 'px-4 py-2 ml-16'}`}>
          <img src={logo} alt="SKEYE.AI" className={`${isMobile ? 'h-5' : 'h-6'} w-auto`} />
          
          {/* UTC Time & Live Devices - Centered */}
          <div className={`flex items-center gap-1.5 ${isMobile ? 'text-[9px]' : 'text-xs'}`}>
            <span className="text-gray-400 font-mono">{utcTime}</span>
            <span className="text-gray-600">•</span>
            <div className="flex items-center gap-1">
              <div className={`${isMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'} bg-green-500 rounded-full animate-pulse`} />
              <span className="text-green-400">{liveDevices} devices live</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }} className="relative p-2 hover:bg-white/5 rounded-lg z-[10001]">
              <Bell className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'} text-gray-400`} />
              {unreadCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>}
            </button>
            
            {/* User Avatar with Dropdown */}
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }}
                className="p-1 hover:bg-white/5 rounded-lg"
              >
                {(user?.avatar_url || user?.avatarUrl) ? (
                  <img src={user.avatar_url || user.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center text-xs font-bold text-green-400">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* User Menu Dropdown */}
      {showUserMenu && (
        <div className="fixed inset-0 z-[10000]" onClick={() => setShowUserMenu(false)}>
          <div className={`absolute ${isMobile ? 'right-2 top-12' : 'right-4 top-12'} w-48 bg-[#141414] border border-gray-700 rounded-xl shadow-2xl overflow-hidden`} onClick={e => e.stopPropagation()}>
            <div className="p-3 border-b border-gray-800">
              <p className="text-sm font-semibold text-white">{user?.username}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <div className="py-1">
              <button onClick={() => { setActiveTab('profile'); setShowUserMenu(false); }} className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2">
                <User className="w-4 h-4" />
                My Profile
              </button>
              <button onClick={() => { setProfileSubTab('devices'); setActiveTab('profile'); setShowUserMenu(false); }} className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                My Devices
              </button>
              <button onClick={() => { setProfileSubTab('settings'); setActiveTab('profile'); setShowUserMenu(false); }} className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
            <div className="border-t border-gray-800 py-1">
              <button onClick={() => { logout(); setShowUserMenu(false); }} className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5 flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Dropdown - At root level with highest z-index */}
      {showNotifications && (
        <div className="fixed inset-0 z-[10000]" onClick={() => setShowNotifications(false)}>
          <div className={`absolute ${isMobile ? 'left-2 right-2 top-14' : 'right-4 top-14 w-80'} bg-[#141414] border border-gray-700 rounded-xl shadow-2xl overflow-hidden`} onClick={e => e.stopPropagation()}>
            <div className="p-3 border-b border-gray-800 flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setNotificationsList(prev => prev.map(n => ({...n, read: true})))} className="text-xs text-gray-400 hover:text-green-400">Clear all</button>
                <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-white/10 rounded"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-dark">
              {notificationsList.map((n) => (
                <div key={n.id} onClick={() => handleNotificationClick(n)} className={`p-3 border-b border-gray-800/50 hover:bg-white/5 cursor-pointer ${!n.read ? 'bg-green-500/5' : ''}`}>
                  <p className="text-sm text-white font-medium">{n.device}</p>
                  <p className="text-sm text-gray-400">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 overflow-hidden relative ${!isMobile ? 'ml-16' : ''}`}>
        {activeTab === 'map' && <GlobalMapView isMobile={isMobile} onViewProfile={(username) => { setViewingProfile(username); setActiveTab('profile'); }} />}
        {activeTab === 'trending' && <TrendingView isMobile={isMobile} clips={mockClips} onViewProfile={(username) => { setViewingProfile(username); setActiveTab('profile'); }} />}
        {activeTab === 'classify' && <ClassifyView isMobile={isMobile} onViewProfile={(username) => { setViewingProfile(username); setActiveTab('profile'); }} />}
        {activeTab === 'community' && <CommunityView isMobile={isMobile} />}
        {activeTab === 'profile' && <ProfileView isMobile={isMobile} profileSubTab={profileSubTab} setProfileSubTab={setProfileSubTab} devices={mockDevices} clips={myClips} viewingProfile={viewingProfile} setViewingProfile={setViewingProfile} />}
        {activeTab === 'admin' && user?.role === 'admin' && <AdminView isMobile={isMobile} />}
      </main>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4" onClick={() => setSelectedNotification(null)}>
          <div className={`bg-[#141414] rounded-2xl ${isMobile ? 'w-full max-h-[85vh]' : 'w-full max-w-lg'} overflow-hidden`} onClick={e => e.stopPropagation()}>
            <div className="aspect-video bg-black relative">
              <iframe src={`https://www.youtube.com/embed/${selectedNotification.videoId}?autoplay=1&mute=0&rel=0`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Detection" />
              <button onClick={() => setSelectedNotification(null)} className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{selectedNotification.device}</h3>
                  <p className="text-sm text-gray-400">{selectedNotification.location}</p>
                  <p className="text-xs text-gray-500">{selectedNotification.time}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: `${classificationOptions.find(o => o.id === selectedNotification.classification)?.color}33`, color: classificationOptions.find(o => o.id === selectedNotification.classification)?.color }}>
                    <span>{classificationOptions.find(o => o.id === selectedNotification.classification)?.icon}</span>
                    <span>{selectedNotification.classification}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{isMobile ? 'AI:' : 'AI Confidence:'} <span className="text-green-400 font-bold">{selectedNotification.confidence}%</span></p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-2">Classify this detection:</p>
              <div className="flex gap-1">
                {classificationOptions.map(opt => (<button key={opt.id} onClick={() => setSelectedNotification(null)} className="flex-1 py-2 rounded-lg text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform flex flex-col items-center gap-0.5" style={{ backgroundColor: `${opt.color}20`, color: opt.color }}><span>{opt.icon}</span><span className="text-[8px]">{opt.label}</span></button>))}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => setSelectedNotification(null)} className="flex-1 py-2 rounded-lg text-sm text-gray-400 bg-white/5 hover:bg-white/10">Skip</button>
                <div className="flex items-center gap-1 bg-green-500/20 px-3 py-2 rounded-lg">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400 font-semibold">+50 $SKEYE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side Navigation - Desktop */}
      {!isMobile && (
        <nav className="fixed left-0 top-12 bottom-0 w-16 border-r border-green-500/10 bg-[#0a0a0a] flex flex-col items-center pt-4 z-40">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all mb-1 ${isActive ? 'bg-gradient-to-br from-green-500/20 to-green-600/10 text-green-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-r-full" />}
                <Icon className="w-5 h-5" />
                <span className="text-[8px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Bottom Navigation - Mobile */}
      {isMobile && (
        <nav className="flex-shrink-0 border-t border-green-500/20 bg-[#0a0a0a] z-50">
          <div className="flex items-center justify-around py-1" style={{ paddingBottom: 'max(4px, env(safe-area-inset-bottom))' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center py-2 px-3 ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
      </div>{/* End of blur wrapper */}
    </div>
  );
}

// Main App component with AuthProvider wrapper
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function GlobalMapView({ isMobile, onViewProfile }) {
  const { token, API_URL } = useAuth();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [sightings, setSightings] = useState([]);
  const [loadingSightings, setLoadingSightings] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [showSightingsList, setShowSightingsList] = useState(!isMobile);
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [typeFilters, setTypeFilters] = useState({ UAP: true, Drone: true, Aircraft: true, Bird: true, Weather: true });
  const [mapReady, setMapReady] = useState(false);
  const [sightingLikes, setSightingLikes] = useState({});
  const [swipeY, setSwipeY] = useState(0);
  const [swipeStartY, setSwipeStartY] = useState(null);
  const [showSightingComments, setShowSightingComments] = useState(false);
  const [newSightingComment, setNewSightingComment] = useState('');
  const [confidenceSort, setConfidenceSort] = useState('desc');
  const [locationSearch, setLocationSearch] = useState('');
  const [classifiedSightings, setClassifiedSightings] = useState({});

  // Handle classification
  const handleClassifySighting = (sightingId, classification) => {
    setClassifiedSightings(prev => ({ ...prev, [sightingId]: classification }));
  };

  // Fetch real sightings from API
  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/sightings`);
        if (res.ok) {
          const data = await res.json();
          console.log('Fetched sightings:', data); // Debug log
          // Transform API data to match expected format
          const transformed = data.map(s => {
            const createdAt = new Date(s.created_at);
            return {
              id: s.id,
              lat: parseFloat(s.latitude),
              lng: parseFloat(s.longitude),
              type: s.classification,
              confidence: s.ai_confidence || 85,
              city: s.location,
              title: s.title,
              timestamp: createdAt.getTime(),
              time: getTimeAgo(createdAt.getTime()),
              utcTime: createdAt.toISOString().slice(0, 19).replace('T', ' ') + ' UTC',
              videoUrl: s.video_url,
              thumbnailUrl: s.thumbnail_url,
              owner: { 
                username: s.uploader_username || 'Admin', 
                avatar: (s.uploader_username || 'A')[0].toUpperCase(),
                avatarUrl: s.uploader_avatar || null
              },
              likes: 0,
              commentsCount: 0,
              siteComments: [],
            };
          });
          console.log('Transformed sightings:', transformed); // Debug log
          setSightings(transformed);
        } else {
          console.error('Failed to fetch sightings, status:', res.status);
          setSightings([]);
        }
      } catch (err) {
        console.error('Failed to fetch sightings:', err);
        setSightings([]);
      } finally {
        setLoadingSightings(false);
      }
    };
    fetchSightings();
  }, [API_URL]);

  const toggleTypeFilter = (type) => setTypeFilters(prev => ({ ...prev, [type]: !prev[type] }));
  const handleLikeSighting = (id) => setSightingLikes(prev => ({ ...prev, [id]: !prev[id] }));

  const handlePostSightingComment = () => {
    if (!newSightingComment.trim() || !selectedSighting) return;
    const newComment = {
      id: Date.now(),
      user: 'You',
      avatar: 'Y',
      text: newSightingComment,
      time: 'Just now',
      likes: 0
    };
    // Update the sighting's comments
    setSightings(prev => prev.map(s => 
      s.id === selectedSighting.id 
        ? { ...s, siteComments: [...(s.siteComments || []), newComment], commentsCount: (s.commentsCount || 0) + 1 }
        : s
    ));
    // Update selected sighting to show new comment
    setSelectedSighting(prev => ({
      ...prev,
      siteComments: [...(prev.siteComments || []), newComment],
      commentsCount: (prev.commentsCount || 0) + 1
    }));
    setNewSightingComment('');
  };

  // Swipe to dismiss handlers
  const handleTouchStart = (e) => setSwipeStartY(e.touches[0].clientY);
  const handleTouchMove = (e) => {
    if (swipeStartY === null) return;
    const diff = e.touches[0].clientY - swipeStartY;
    if (diff > 0) setSwipeY(diff);
  };
  const handleTouchEnd = () => {
    if (swipeY > 100) { setSelectedSighting(null); setShowSightingComments(false); }
    setSwipeY(0);
    setSwipeStartY(null);
  };

  const getFiltered = () => {
    const range = timeRanges.find(r => r.id === timeRange);
    let filtered = sightings.filter(s => typeFilters[s.type]);
    if (range && range.hours !== Infinity) {
      const cutoff = Date.now() - range.hours * 60 * 60 * 1000;
      filtered = filtered.filter(s => s.timestamp >= cutoff);
    }
    // Sort by confidence if set, otherwise by timestamp
    if (confidenceSort === 'desc') {
      return filtered.sort((a, b) => b.confidence - a.confidence);
    } else if (confidenceSort === 'asc') {
      return filtered.sort((a, b) => a.confidence - b.confidence);
    }
    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  };

  const filteredSightings = getFiltered();

  // Handle location search
  const handleLocationSearch = (e) => {
    e.preventDefault();
    if (!locationSearch.trim() || !mapInstanceRef.current) return;
    
    // Simple geocoding using Nominatim
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          mapInstanceRef.current.flyTo([parseFloat(lat), parseFloat(lon)], 10, { duration: 1.5 });
        }
      })
      .catch(err => console.error('Search error:', err));
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const loadMap = async () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link'); link.id = 'leaflet-css'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; link.rel = 'stylesheet'; document.head.appendChild(link);
      }
      if (!window.L) {
        await new Promise(r => { const s = document.createElement('script'); s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.onload = r; document.head.appendChild(s); });
      }
      // Mobile: zoom 1 to show full world, Desktop: zoom 2
      const defaultZoom = isMobile ? 1 : 2;
      const map = window.L.map(mapRef.current, { center: [20, 0], zoom: defaultZoom, minZoom: 1, maxZoom: 18, zoomControl: false, attributionControl: false, worldCopyJump: true, tap: false });
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, subdomains: 'abcd' }).addTo(map);
      mapInstanceRef.current = map;
      setMapReady(true);
    };
    loadMap();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [isMobile]);

  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    mapInstanceRef.current.eachLayer(layer => { if (layer instanceof window.L.Marker || layer instanceof window.L.CircleMarker) mapInstanceRef.current.removeLayer(layer); });
    filteredSightings.slice(0, 30).forEach(item => {
      const opt = classificationOptions.find(o => o.id === item.type);
      const color = opt?.color || '#a855f7';
      const icon = opt?.icon || '◆';
      const customIcon = window.L.divIcon({
        className: 'custom-marker',
        html: `<div style="color: ${color}; font-size: 24px; text-shadow: 0 0 4px ${color}80; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">${icon}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      window.L.marker([item.lat, item.lng], { icon: customIcon }).addTo(mapInstanceRef.current).on('click', () => handleSelectSighting(item));
    });
  }, [filteredSightings, mapReady]);

  const handleSelectSighting = (sighting) => {
    setSelectedSighting(sighting);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([sighting.lat, sighting.lng], 8, { duration: 1.5 });
    }
  };

  // Desktop Layout
  if (!isMobile) {
    return (
      <div className="h-full flex" style={{ background: '#262626' }}>
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="absolute inset-0" style={{ background: '#262626' }} />
          
          {/* Time Range - Top Center */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
            <div className="bg-[#141414]/95 rounded-lg border border-gray-700 p-1 flex gap-1">
              {timeRanges.map(r => (<button key={r.id} onClick={() => setTimeRange(r.id)} className={`px-4 py-2 text-sm font-medium rounded ${timeRange === r.id ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'}`}>{r.label}</button>))}
            </div>
          </div>

          {/* Filter Panel - Bottom Left on Map (auto-expanded on desktop) */}
          <div className="absolute bottom-4 left-4 z-[1000]">
            <button onClick={() => setShowFilters(!showFilters)} className="bg-[#141414]/95 border border-gray-700 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-[#1a1a1a] mb-2">
              <Filter className="w-4 h-4 text-green-400" />
              <span className="text-sm">Filters</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {showFilters && (
              <div className="bg-[#141414]/95 border border-gray-700 rounded-lg p-3 w-48">
                <div className="space-y-1">
                  {classificationOptions.map(opt => (
                    <button key={opt.id} onClick={() => toggleTypeFilter(opt.id)} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${typeFilters[opt.id] ? 'bg-white/5' : 'opacity-40'}`}>
                      <span className="text-base" style={{ color: opt.color }}>{opt.icon}</span>
                      <span className="flex-1 text-left text-sm">{opt.label}</span>
                      {typeFilters[opt.id] && <span className="text-green-400 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar - Bottom Right */}
          <form onSubmit={handleLocationSearch} className="absolute bottom-4 right-4 z-[1000]">
            <div className="flex items-center bg-[#141414]/95 border border-gray-700 rounded-lg overflow-hidden">
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search location..."
                className="bg-transparent px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none w-48"
              />
              <button type="submit" className="px-3 py-2 hover:bg-white/10 transition-colors">
                <Search className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </form>

          {/* Sighting Detail Panel - On Map */}
          {selectedSighting && (
            <div className="absolute bottom-4 right-4 z-[1001] w-96 bg-[#141414] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="aspect-video bg-black relative">
                {selectedSighting.videoUrl ? (
                  <video 
                    key={selectedSighting.id}
                    src={selectedSighting.videoUrl} 
                    className="w-full h-full object-contain" 
                    controls 
                    autoPlay 
                    playsInline
                  />
                ) : selectedSighting.videoId ? (
                  <iframe key={selectedSighting.id} src={`https://www.youtube.com/embed/${selectedSighting.videoId}?autoplay=1&mute=0&rel=0`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Sighting" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Play className="w-12 h-12" />
                  </div>
                )}
                <button onClick={() => setSelectedSighting(null)} className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{selectedSighting.city}</h3>
                    <p className="text-xs text-gray-400">{selectedSighting.timestamp ? getPreciseTimeAgo(selectedSighting.timestamp) : selectedSighting.time}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{selectedSighting.utcTime || ''}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{selectedSighting.lat?.toFixed(4)}°, {selectedSighting.lng?.toFixed(4)}°</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: `${classificationOptions.find(o => o.id === selectedSighting.type)?.color}33`, color: classificationOptions.find(o => o.id === selectedSighting.type)?.color }}>
                      <span>{classificationOptions.find(o => o.id === selectedSighting.type)?.icon}</span>
                      <span>{selectedSighting.type}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">AI Confidence: <span className="text-green-400 font-bold">{selectedSighting.confidence}%</span></p>
                  </div>
                </div>
                {/* Owner link */}
                <button onClick={() => onViewProfile && onViewProfile(selectedSighting.owner.username)} className="flex items-center gap-2 mb-3 hover:bg-white/5 px-2 py-1 rounded-lg -ml-2">
                  {selectedSighting.owner.avatarUrl ? (
                    <img src={selectedSighting.owner.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] font-bold text-green-400">{selectedSighting.owner.avatar}</div>
                  )}
                  <span className="text-xs text-green-400">@{selectedSighting.owner.username}</span>
                </button>
                {/* Likes & Comments */}
                <div className="flex items-center gap-3 mb-3">
                  <button onClick={() => handleLikeSighting(selectedSighting.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${sightingLikes[selectedSighting.id] ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs font-medium">{(selectedSighting.likes || 0) + (sightingLikes[selectedSighting.id] ? 1 : 0)}</span>
                  </button>
                  <button onClick={() => setShowSightingComments(!showSightingComments)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${showSightingComments ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">{selectedSighting.commentsCount || 0}</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                {/* Comments Section */}
                {showSightingComments && (
                  <div className="mb-3 border-t border-gray-700 pt-3">
                    <h4 className="text-xs font-semibold text-gray-400 mb-2">COMMENTS ({selectedSighting.siteComments?.length || 0})</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto mb-2">
                      {selectedSighting.siteComments && selectedSighting.siteComments.length > 0 ? (
                        selectedSighting.siteComments.map(c => (
                          <div key={c.id} className="flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] font-bold text-green-400 flex-shrink-0">{c.avatar}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-semibold">{c.user}</span>
                                <span className="text-[9px] text-gray-500">{c.time}</span>
                              </div>
                              <p className="text-[10px] text-gray-300">{c.text}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-gray-500 text-center py-2">No comments yet</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <input type="text" value={newSightingComment} onChange={(e) => setNewSightingComment(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handlePostSightingComment()} placeholder="Add comment..." className="flex-1 px-2 py-1 bg-white/5 border border-gray-700 rounded text-[10px] text-white focus:outline-none focus:border-green-500/50" />
                      <button onClick={handlePostSightingComment} className="px-2 py-1 bg-green-500 rounded text-[10px] font-medium hover:bg-green-600">Post</button>
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-400 mb-2">Classify this sighting:</p>
                <div className="flex gap-1">
                  {classificationOptions.map(opt => (
                    <button 
                      key={opt.id} 
                      onClick={() => handleClassifySighting(selectedSighting.id, opt.id)}
                      disabled={!!classifiedSightings[selectedSighting.id]}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-transform flex flex-col items-center gap-0.5 ${classifiedSightings[selectedSighting.id] === opt.id ? 'ring-2 ring-white scale-105' : ''} ${classifiedSightings[selectedSighting.id] ? 'opacity-50' : 'hover:scale-[1.02] active:scale-[0.98]'}`} 
                      style={{ backgroundColor: `${opt.color}20`, color: opt.color }}
                    >
                      <span>{opt.icon}</span>
                      <span className="text-[8px]">{opt.label}</span>
                    </button>
                  ))}
                </div>
                {/* Close + Submitted indicator + Reward */}
                <div className="flex items-center gap-2 mt-3">
                  {classifiedSightings[selectedSighting.id] && (
                    <div className="flex items-center gap-1 text-green-400">
                      <span className="text-base">✓</span>
                      <span className="text-xs font-medium">Submitted</span>
                    </div>
                  )}
                  <button onClick={() => { setSelectedSighting(null); setShowSightingComments(false); }} className="flex-1 py-2 rounded-lg text-sm text-gray-300 bg-white/5 hover:bg-white/10">Close</button>
                  <div className={`flex items-center gap-1 px-3 py-2 rounded-lg ${classifiedSightings[selectedSighting.id] ? 'bg-green-500' : 'bg-green-500/20'}`}>
                    <Zap className={`w-4 h-4 ${classifiedSightings[selectedSighting.id] ? 'text-white' : 'text-green-400'}`} />
                    <span className={`text-sm font-semibold ${classifiedSightings[selectedSighting.id] ? 'text-white' : 'text-green-400'}`}>+50 $SKEYE</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Live Sightings Only */}
        <div className="w-72 bg-[#0a0a0a] border-l border-gray-800 flex flex-col">
          {/* Live Sightings Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Radio className="w-4 h-4 text-green-400 animate-pulse" />Live Sightings</h3>
              <span className="text-xs text-gray-400">{filteredSightings.length} total</span>
            </div>
            <div className="flex items-center justify-end mt-2">
              <button 
                onClick={() => setConfidenceSort(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-400 transition-colors"
              >
                <span>AI Confidence</span>
                {confidenceSort === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Sightings List */}
          <div className="flex-1 overflow-y-auto scrollbar-dark">
            {filteredSightings.slice(0, 30).map(s => (
              <div key={s.id} onClick={() => handleSelectSighting(s)} className={`flex items-center gap-3 p-3 border-b border-gray-800/50 cursor-pointer hover:bg-white/5 ${selectedSighting?.id === s.id ? 'bg-green-500/10' : ''}`}>
                <span className="text-base" style={{ color: classificationOptions.find(o => o.id === s.type)?.color }}>
                  {classificationOptions.find(o => o.id === s.type)?.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{s.city}</p>
                  <p className="text-xs text-gray-500">{s.type} • {s.time}</p>
                </div>
                <span className="text-[10px] text-green-400 font-bold">{s.confidence}%</span>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .leaflet-container { background: #262626 !important; }
          .scrollbar-dark::-webkit-scrollbar { width: 6px; }
          .scrollbar-dark::-webkit-scrollbar-track { background: #1a1a1a; }
          .scrollbar-dark::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
          .scrollbar-dark::-webkit-scrollbar-thumb:hover { background: #444; }
          * { scrollbar-width: thin; scrollbar-color: #333 #1a1a1a; }
        `}</style>
      </div>
    );
  }

  // Mobile Layout
  return (
    <div className="h-full relative" style={{ background: '#262626' }}>
      <div ref={mapRef} className="absolute inset-0" style={{ background: '#262626' }} />
      
      {/* Time Range */}
      <div className="absolute top-2 left-2 right-2 z-[1000]">
        <div className="bg-[#141414]/95 rounded-lg border border-gray-700 p-1 flex justify-between">
          {timeRanges.map(r => (<button key={r.id} onClick={() => setTimeRange(r.id)} className={`flex-1 py-2 text-xs font-medium rounded ${timeRange === r.id ? 'bg-green-500/20 text-green-400' : 'text-gray-400'}`}>{r.label}</button>))}
        </div>
      </div>

      {/* Search Bar - Below Time Range */}
      <form onSubmit={handleLocationSearch} className="absolute top-16 left-2 right-2 z-[1000]">
        <div className="flex items-center bg-[#141414]/95 border border-gray-700 rounded-lg overflow-hidden">
          <Search className="w-4 h-4 text-gray-500 ml-3" />
          <input
            type="text"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            placeholder="Search location..."
            className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
          />
        </div>
      </form>

      {/* Filter Button - Bottom Left */}
      <button onClick={() => setShowFilters(true)} className="absolute bottom-4 left-4 z-[1000] bg-[#141414]/95 border border-gray-700 rounded-full w-12 h-12 flex items-center justify-center active:scale-95">
        <Filter className="w-5 h-5 text-green-400" />
      </button>

      {/* Sightings List Button */}
      <button onClick={() => setShowSightingsList(true)} className="absolute bottom-4 right-4 z-[1000] bg-[#141414]/95 border border-gray-700 rounded-full px-4 py-2 flex items-center gap-2 active:scale-95">
        <Radio className="w-4 h-4 text-green-400 animate-pulse" />
        <span className="text-sm font-medium">{filteredSightings.length}</span>
        <span className="text-xs text-gray-400">sightings</span>
      </button>

      {/* Filter Panel - Mobile */}
      {showFilters && (
        <div className="absolute inset-0 z-[1001] bg-black/60" onClick={() => setShowFilters(false)}>
          <div className="absolute inset-x-0 bottom-0 bg-[#141414] rounded-t-3xl" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3" />
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-semibold">Filter Sightings</h3>
              <button onClick={() => setShowFilters(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-4 space-y-2">
              {classificationOptions.map(opt => (
                <button key={opt.id} onClick={() => toggleTypeFilter(opt.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${typeFilters[opt.id] ? 'bg-white/5' : 'opacity-40'}`}>
                  <div className="w-6 h-6 rounded flex items-center justify-center font-bold" style={{ backgroundColor: opt.color }}>{opt.icon}</div>
                  <span className="flex-1 text-left">{opt.label}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${typeFilters[opt.id] ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}>
                    {typeFilters[opt.id] && <span className="text-white text-sm">✓</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sightings List Panel */}
      {showSightingsList && (
        <div className="absolute inset-x-0 bottom-0 z-[1001] bg-[#141414] rounded-t-3xl max-h-[70vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h3 className="font-semibold flex items-center gap-2"><Radio className="w-4 h-4 text-green-400" />Recent Sightings</h3>
            <button onClick={() => setShowSightingsList(false)}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredSightings.slice(0, 20).map(s => (
              <div key={s.id} onClick={() => { handleSelectSighting(s); setShowSightingsList(false); }} className="flex items-center gap-3 p-3 border-b border-gray-800/50 active:bg-white/5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: classificationOptions.find(o => o.id === s.type)?.color }} />
                <div className="flex-1">
                  <p className="text-sm text-white">{s.city}</p>
                  <p className="text-xs text-gray-400">{s.type} • {s.time}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sighting Detail */}
      {selectedSighting && (
        <>
          {/* Backdrop - tap to close */}
          <div 
            className="absolute inset-0 z-[1000] bg-black/40"
            onClick={() => setSelectedSighting(null)}
          />
          <div 
            className="absolute inset-x-2 top-2 bottom-2 z-[1001] bg-[#141414] rounded-2xl flex flex-col overflow-hidden"
            style={{ transform: `translateY(${swipeY}px)` }}
          >
            {/* Video - takes most of the space */}
            <div className="flex-1 bg-black relative min-h-0">
              {selectedSighting.videoUrl ? (
                <video 
                  key={selectedSighting.id}
                  src={selectedSighting.videoUrl} 
                  className="w-full h-full object-contain"
                  style={{ position: 'relative', zIndex: 10 }}
                  controls 
                  autoPlay
                  muted 
                  loop
                  playsInline
                  webkit-playsinline="true"
                />
              ) : selectedSighting.videoId ? (
                <iframe key={selectedSighting.id} src={`https://www.youtube.com/embed/${selectedSighting.videoId}?autoplay=1&mute=1&playsinline=1&rel=0`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Sighting" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <Play className="w-12 h-12" />
                </div>
              )}
            </div>
            
            {/* Compact Info Panel */}
            <div className="flex-shrink-0 p-3 bg-[#141414]">
              {/* Top row: Location + Actions + Close */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate">{selectedSighting.city}</h3>
                  <p className="text-[10px] text-gray-500 font-mono">{selectedSighting.utcTime || ''}</p>
                  <p className="text-[10px] text-gray-500">{selectedSighting.timestamp ? getPreciseTimeAgo(selectedSighting.timestamp) : selectedSighting.time}</p>
                  <p className="text-[10px] text-gray-500 font-mono">{selectedSighting.lat?.toFixed(4)}°, {selectedSighting.lng?.toFixed(4)}°</p>
                </div>
                {/* Actions + Close button */}
                <div className="flex items-start gap-2 ml-2">
                  <button onClick={() => handleLikeSighting(selectedSighting.id)} className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${sightingLikes[selectedSighting.id] ? 'bg-green-500' : 'bg-white/10'}`}>
                      <ThumbsUp className="w-4 h-4" />
                    </div>
                    <span className="text-[9px]">{(selectedSighting.likes || 0) + (sightingLikes[selectedSighting.id] ? 1 : 0)}</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[9px]">{selectedSighting.commentsCount || 0}</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                      <Share2 className="w-4 h-4" />
                    </div>
                  </button>
                  {/* Close button */}
                  <button 
                    onClick={() => setSelectedSighting(null)} 
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Owner + Classification badge */}
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => onViewProfile && onViewProfile(selectedSighting.owner.username)} className="flex items-center gap-1.5">
                  {selectedSighting.owner.avatarUrl ? (
                    <img src={selectedSighting.owner.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] font-bold text-green-400">{selectedSighting.owner.avatar}</div>
                  )}
                  <span className="text-xs text-green-400">@{selectedSighting.owner.username}</span>
                </button>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: `${classificationOptions.find(o => o.id === selectedSighting.type)?.color}33`, color: classificationOptions.find(o => o.id === selectedSighting.type)?.color }}>
                  <span>{classificationOptions.find(o => o.id === selectedSighting.type)?.icon}</span>
                  <span>{selectedSighting.type}</span>
                </div>
                <span className="text-[10px] text-gray-400">AI: <span className="text-green-400 font-bold">{selectedSighting.confidence}%</span></span>
              </div>
              
              {/* Classify buttons */}
              <div className="flex gap-1 mb-2">
                {classificationOptions.map(opt => (
                  <button 
                    key={opt.id} 
                    onClick={() => handleClassifySighting(selectedSighting.id, opt.id)}
                    disabled={!!classifiedSightings[selectedSighting.id]}
                    className={`flex-1 py-1.5 rounded-lg flex flex-col items-center gap-0.5 ${classifiedSightings[selectedSighting.id] === opt.id ? 'ring-2 ring-white scale-105' : ''} ${classifiedSightings[selectedSighting.id] ? 'opacity-50' : 'active:scale-95'}`} 
                    style={{ backgroundColor: `${opt.color}20`, color: opt.color }}
                  >
                    <span className="text-sm">{opt.icon}</span>
                    <span className="text-[7px] font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Close + Submitted indicator + Reward */}
              <div className="flex items-center gap-2">
                {classifiedSightings[selectedSighting.id] && (
                  <div className="flex items-center gap-1 text-green-400">
                    <span className="text-base">✓</span>
                    <span className="text-xs font-medium">Submitted</span>
                  </div>
                )}
                <button 
                  onClick={() => { setSelectedSighting(null); }}
                  className="flex-1 py-2 rounded-lg text-sm font-medium bg-white/10 text-gray-300"
                >
                  Close
                </button>
                <div className={`flex items-center gap-1 px-3 py-2 rounded-lg ${classifiedSightings[selectedSighting.id] ? 'bg-green-500' : 'bg-green-500/20'}`}>
                  <Zap className={`w-4 h-4 ${classifiedSightings[selectedSighting.id] ? 'text-white' : 'text-green-400'}`} />
                  <span className={`text-sm font-semibold ${classifiedSightings[selectedSighting.id] ? 'text-white' : 'text-green-400'}`}>+50 $SKEYE</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .leaflet-container { background: #262626 !important; }
        .scrollbar-dark::-webkit-scrollbar { width: 6px; }
        .scrollbar-dark::-webkit-scrollbar-track { background: #1a1a1a; }
        .scrollbar-dark::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        .scrollbar-dark::-webkit-scrollbar-thumb:hover { background: #444; }
      `}</style>
    </div>
  );
}

function VideoFeedView({ clips, showReward = false, title = "Trending", isMobile = true, onViewProfile, onClassified, mode = "trending" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedClips, setLikedClips] = useState({});
  const [classified, setClassified] = useState(0);
  const [classifiedClips, setClassifiedClips] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const currentClip = clips[currentIndex];

  const isTrending = mode === "trending";
  const isClassifyMode = mode === "classify";

  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); setShowComments(false); };
  const handleNext = () => { 
    // For trending, loop infinitely
    if (isTrending) {
      setCurrentIndex((currentIndex + 1) % clips.length);
    } else {
      if (currentIndex < clips.length - 1) setCurrentIndex(currentIndex + 1); 
      else setCurrentIndex(0); 
    }
    setShowComments(false); 
  };
  const handleLike = () => setLikedClips(prev => ({ ...prev, [currentClip.id]: !prev[currentClip.id] }));
  const handleClassify = (type) => { 
    setClassified(prev => prev + 1);
    setClassifiedClips(prev => ({ ...prev, [currentClip.id]: type }));
    if (onClassified) onClassified(currentClip.id);
    // For trending: auto-advance after short delay
    // For classify: show "Submitted" state
    if (isTrending) {
      setTimeout(() => handleNext(), 500);
    }
  };

  const siteLikes = (currentClip.siteLikes || 0) + (likedClips[currentClip.id] ? 1 : 0);
  const siteComments = currentClip.siteComments || [];
  const isClassified = !!classifiedClips[currentClip.id];

  // Desktop Layout
  if (!isMobile) {
    return (
      <div className="h-full flex">
        {/* Main Video Area */}
        <div className="flex-1 relative bg-black">
          {currentClip.videoUrl ? (
            <video 
              key={currentClip.id}
              src={currentClip.videoUrl} 
              className="absolute inset-0 w-full h-full object-contain" 
              controls 
              autoPlay 
              loop
              playsInline
            />
          ) : currentClip.videoId ? (
            <iframe 
              key={currentClip.id} 
              src={`https://www.youtube.com/embed/${currentClip.videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&loop=1&playlist=${currentClip.videoId}`} 
              className="absolute inset-0 w-full h-full" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen 
              title={currentClip.title} 
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <Play className="w-16 h-16" />
            </div>
          )}}
          
          {/* Nav Arrows */}
          <button onClick={handlePrev} disabled={isTrending ? false : currentIndex === 0} className={`absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center z-10 transition-all ${!isTrending && currentIndex === 0 ? 'opacity-30' : ''}`}>
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center z-10">
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-[#0a0a0a] border-l border-gray-800 flex flex-col overflow-hidden">
          {/* Progress - only show for classify mode */}
          {isClassifyMode && (
            <div className="flex-shrink-0 p-4 border-b border-gray-800">
              <div className="flex gap-1 mb-3">
                {clips.map((_, i) => (<div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-green-400' : i < currentIndex ? 'bg-green-400/50' : 'bg-gray-700'}`} />))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{currentIndex + 1} of {clips.length}</span>
                {showReward && (
                  <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400 font-semibold">+50 $SKEYE</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clip Info */}
          <div className="flex-shrink-0 p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded text-xs font-bold flex items-center gap-1" style={{ backgroundColor: classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.color + '30', color: classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.color }}>
                  {classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.icon} {currentClip.classification || currentClip.type || 'UAP'}
                </span>
              </div>
              {currentClip.confidence && <span className="text-xs text-gray-400">AI Confidence: <span className="text-green-400 font-bold">{currentClip.confidence}%</span></span>}
            </div>
            <h3 className="font-semibold text-lg">{currentClip.location}</h3>
            {currentClip.utcTime && <p className="text-xs text-gray-500 font-mono mt-1">{currentClip.utcTime}</p>}
            {currentClip.timestamp && <p className="text-xs text-gray-500 mt-0.5">{getPreciseTimeAgo(currentClip.timestamp)}</p>}
            {/* Owner link */}
            {currentClip.owner && (
              <button onClick={() => onViewProfile && onViewProfile(currentClip.owner.username)} className="flex items-center gap-2 mt-2 hover:bg-white/5 px-2 py-1 rounded-lg -ml-2">
                {currentClip.owner.avatarUrl ? (
                  <img src={currentClip.owner.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] font-bold text-green-400">{currentClip.owner.avatar}</div>
                )}
                <span className="text-sm text-green-400">@{currentClip.owner.username}</span>
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 p-4 border-b border-gray-800 flex items-center gap-3">
            <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${likedClips[currentClip.id] ? 'bg-green-500 text-white' : 'bg-white/5 hover:bg-white/10'}`}>
              <ThumbsUp className="w-5 h-5" />
              <span>{siteLikes}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showComments ? 'bg-green-500/20 text-green-400' : 'bg-white/5 hover:bg-white/10'}`}>
              <MessageCircle className="w-5 h-5" />
              <span>{siteComments.length}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Comments Section - Shows when toggled */}
            {showComments && (
              <div className="p-4 border-b border-gray-800">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">COMMENTS ({siteComments.length})</h4>
                <div className="space-y-3 mb-3">
                  {siteComments.length === 0 ? (
                    <p className="text-center text-gray-500 py-4 text-sm">No comments yet. Be the first!</p>
                  ) : (
                    siteComments.map((c, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-xs font-bold text-green-400 flex-shrink-0">{c.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs">{c.user}</span>
                            <span className="text-[10px] text-gray-500">{c.time}</span>
                          </div>
                          <p className="text-xs text-gray-300 mt-0.5">{c.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-1 px-3 py-2 bg-white/5 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-green-500/50" />
                  <button className="px-3 py-2 bg-green-500 rounded-lg text-sm font-medium">Post</button>
                </div>
              </div>
            )}

            {/* Classify Section */}
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">CLASSIFY THIS SIGHTING</h4>
              <div className="space-y-2">
                {classificationOptions.map(opt => (
                  <button 
                    key={opt.id} 
                    onClick={() => !isClassified && handleClassify(opt.id)} 
                    disabled={isClassified && isClassifyMode}
                    className={`w-full py-3 rounded-xl font-semibold transition-transform flex items-center justify-center gap-2 ${isClassified && classifiedClips[currentClip.id] === opt.id ? 'ring-2 ring-white' : ''} ${isClassified && isClassifyMode ? 'opacity-60' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                    style={{ backgroundColor: `${opt.color}20`, color: opt.color }}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
              {/* Only show Skip/Submitted button for classify mode */}
              {isClassifyMode && (
                <button 
                  onClick={handleNext} 
                  className={`w-full mt-3 py-3 rounded-xl font-medium ${isClassified ? 'bg-green-500 text-white' : 'text-gray-400 bg-white/5 hover:bg-white/10'}`}
                >
                  {isClassified ? '✓ Submitted - Next' : 'Skip'}
                </button>
              )}
              {/* For trending, just show a simple next button */}
              {isTrending && (
                <button 
                  onClick={handleNext} 
                  className="w-full mt-3 py-3 rounded-xl font-medium text-gray-400 bg-white/5 hover:bg-white/10"
                >
                  Next
                </button>
              )}
              {classified > 0 && isClassifyMode && (
                <p className="text-center text-sm text-gray-500 mt-4">Classified today: <span className="text-green-400 font-bold">{classified}</span></p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile Layout with Swipe
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [swipeOffset, setSwipeOffset] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e) => {
    const deltaX = e.touches[0].clientX - touchStart.x;
    const deltaY = e.touches[0].clientY - touchStart.y;
    // Only track horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setSwipeOffset(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 80) {
      handlePrev();
    } else if (swipeOffset < -80) {
      handleNext();
    }
    setSwipeOffset(0);
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Top Progress Bar - only for classify mode */}
      {isClassifyMode && (
        <div className="flex-shrink-0 p-2 bg-black">
          <div className="flex gap-1 mb-1">
            {clips.map((_, i) => (<div key={i} className={`flex-1 h-1 rounded-full transition-all ${i === currentIndex ? 'bg-white' : i < currentIndex ? 'bg-white/50' : 'bg-white/20'}`} />))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{currentIndex + 1} / {clips.length}</span>
            {classified > 0 && <span className="text-xs text-gray-400">Classified: <span className="text-green-400 font-bold">{classified}</span></span>}
          </div>
        </div>
      )}

      {/* Video Section - takes about half the screen */}
      <div 
        className="flex-1 relative bg-black min-h-0"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="absolute inset-0 transition-transform duration-200"
          style={{ transform: `translateX(${swipeOffset * 0.3}px)` }}
        >
          {currentClip.videoUrl ? (
            <video 
              key={currentClip.id}
              src={currentClip.videoUrl} 
              className="w-full h-full object-contain"
              style={{ position: 'relative', zIndex: 20 }}
              controls 
              autoPlay 
              muted
              loop
              playsInline
              webkit-playsinline="true"
            />
          ) : currentClip.videoId ? (
            <iframe 
              key={currentClip.id} 
              src={`https://www.youtube.com/embed/${currentClip.videoId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${currentClip.videoId}`} 
              className="absolute inset-0 w-full h-full" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen 
              title={currentClip.location} 
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <Play className="w-16 h-16" />
            </div>
          )}
        </div>

        {/* Swipe Indicators */}
        {swipeOffset > 40 && (isTrending || currentIndex > 0) && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur rounded-full p-3">
            <ChevronLeft className="w-8 h-8" />
          </div>
        )}
        {swipeOffset < -40 && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur rounded-full p-3">
            <ChevronRight className="w-8 h-8" />
          </div>
        )}

        {/* Nav Arrows */}
        <button onClick={handlePrev} disabled={!isTrending && currentIndex === 0} className={`absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center z-30 transition-opacity ${!isTrending && currentIndex === 0 ? 'opacity-30' : 'active:scale-95'}`}><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center z-30 active:scale-95"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Info Panel Below Video */}
      <div className="flex-shrink-0 bg-[#0a0a0a] p-3">
        {/* Top row: Classification badge + AI + Actions */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1" style={{ backgroundColor: classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.color + '40', color: classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.color }}>
                {classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.icon} {currentClip.classification || currentClip.type || 'UAP'}
              </span>
              {currentClip.confidence && <span className="text-[10px] text-gray-400">AI: <span className="text-green-400 font-bold">{currentClip.confidence}%</span></span>}
            </div>
            {/* Location */}
            <h3 className="font-semibold text-sm">{currentClip.location}</h3>
            {/* UTC time */}
            {currentClip.utcTime && <p className="text-[10px] text-gray-500 font-mono">{currentClip.utcTime}</p>}
            {/* Precise time ago */}
            {currentClip.timestamp && <p className="text-[10px] text-gray-500">{getPreciseTimeAgo(currentClip.timestamp)}</p>}
            {/* Owner */}
            {currentClip.owner && (
              <button onClick={() => onViewProfile && onViewProfile(currentClip.owner.username)} className="flex items-center gap-1.5 mt-1">
                {currentClip.owner.avatarUrl ? (
                  <img src={currentClip.owner.avatarUrl} alt="" className="w-4 h-4 rounded-full object-cover" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-green-500/30 flex items-center justify-center text-[8px] font-bold text-green-400">{currentClip.owner.avatar}</div>
                )}
                <span className="text-xs text-green-400">@{currentClip.owner.username}</span>
              </button>
            )}
          </div>
          
          {/* Actions on right */}
          <div className="flex items-center gap-2">
            <button onClick={handleLike} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${likedClips[currentClip.id] ? 'bg-green-500' : 'bg-white/10'}`}><ThumbsUp className="w-4 h-4" /></div>
              <span className="text-[10px] mt-0.5">{siteLikes}</span>
            </button>
            <button onClick={() => setShowComments(true)} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><MessageCircle className="w-4 h-4" /></div>
              <span className="text-[10px] mt-0.5">{siteComments.length}</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Share2 className="w-4 h-4" /></div>
            </button>
          </div>
        </div>

        {/* Classify Bar */}
        <div className="flex items-stretch gap-1">
          {classificationOptions.map(opt => (
            <button 
              key={opt.id} 
              onClick={() => !(isClassified && isClassifyMode) && handleClassify(opt.id)} 
              disabled={isClassified && isClassifyMode}
              className={`flex-1 py-2 rounded-lg transition-transform flex flex-col items-center gap-0.5 ${isClassified && classifiedClips[currentClip.id] === opt.id ? 'ring-2 ring-white' : ''} ${isClassified && isClassifyMode ? 'opacity-60' : 'active:scale-95'}`}
              style={{ backgroundColor: `${opt.color}30` }}
            >
              <span className="text-base">{opt.icon}</span>
              <span className="text-[8px] font-medium" style={{ color: opt.color }}>{opt.label}</span>
            </button>
          ))}
          <div className="flex flex-col gap-1">
            {isClassifyMode && (
              <button 
                onClick={handleNext} 
                className={`px-2 py-1.5 rounded-lg text-[10px] active:scale-95 ${isClassified ? 'bg-green-500 text-white font-medium' : 'text-gray-400 bg-white/10'}`}
              >
                {isClassified ? '✓ Next' : 'Skip'}
              </button>
            )}
            {isTrending && (
              <button 
                onClick={handleNext} 
                className="px-2 py-1.5 rounded-lg text-[10px] active:scale-95 text-gray-400 bg-white/10"
              >
                Next
              </button>
            )}
            {showReward && !isClassified && isClassifyMode && (
              <div className="flex items-center justify-center gap-0.5 bg-green-500/20 px-2 py-1 rounded-lg">
                <Zap className="w-3 h-3 text-green-400" />
                <span className="text-[9px] text-green-400 font-semibold">+50</span>
              </div>
            )}
            {isClassified && isClassifyMode && (
              <div className="flex items-center justify-center gap-0.5 bg-green-500 px-2 py-1 rounded-lg">
                <Zap className="w-3 h-3 text-white" />
                <span className="text-[9px] text-white font-semibold">+50</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Panel - Mobile Bottom Sheet */}
      {showComments && (
        <div className="absolute inset-0 z-50 bg-black/60" onClick={() => setShowComments(false)}>
          <div className="absolute inset-x-0 bottom-0 bg-[#141414] rounded-t-3xl max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3" />
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-semibold">Comments ({siteComments.length})</h3>
              <button onClick={() => setShowComments(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
              {siteComments.length === 0 ? (<p className="text-center text-gray-500 py-8">No comments yet. Be the first!</p>) : (
                siteComments.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-xs font-bold text-green-400 flex-shrink-0">{c.avatar}</div>
                    <div className="flex-1"><div className="flex items-center gap-2"><span className="font-semibold text-sm">{c.user}</span><span className="text-[10px] text-gray-500">{c.time}</span></div><p className="text-sm text-gray-300 mt-1">{c.text}</p></div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-1 px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-green-500/50" />
                <button className="px-4 py-3 bg-green-500 rounded-xl text-sm font-medium">Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrendingView({ isMobile, clips, onViewProfile }) {
  const { API_URL } = useAuth();
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample comments and usernames for random assignment
  const sampleComments = [
    { user: 'SkyWatcher_AZ', text: 'Incredible footage! Never seen anything like this.', avatar: 'S' },
    { user: 'NightOwl42', text: 'This is definitely not a conventional aircraft.', avatar: 'N' },
    { user: 'DroneHunter', text: 'Could be military? Hard to tell.', avatar: 'D' },
    { user: 'CosmicEye', text: 'I saw something similar last week!', avatar: 'C' },
    { user: 'SkepticalSam', text: 'Need more analysis on this one.', avatar: 'S' },
    { user: 'TruthSeeker', text: 'The movement pattern is fascinating.', avatar: 'T' },
    { user: 'Observer1', text: 'What time was this captured?', avatar: 'O' },
    { user: 'StarGazer99', text: 'Amazing capture! What camera?', avatar: 'S' },
  ];

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/sightings`);
        if (res.ok) {
          const data = await res.json();
          // Transform and add random likes/comments
          const transformed = data.map((s, i) => {
            const numComments = Math.floor(Math.random() * 4);
            const randomComments = [];
            for (let j = 0; j < numComments; j++) {
              const comment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
              randomComments.push({
                ...comment,
                id: j,
                time: `${Math.floor(Math.random() * 12) + 1}h ago`,
                likes: Math.floor(Math.random() * 50)
              });
            }
            const createdAt = new Date(s.created_at);
            return {
              id: s.id,
              videoUrl: s.video_url,
              location: s.location,
              title: s.title || s.location,
              classification: s.classification,
              confidence: s.ai_confidence,
              siteLikes: Math.floor(Math.random() * 500) + 50,
              siteComments: randomComments,
              owner: { 
                username: s.uploader_username || 'Admin', 
                avatar: (s.uploader_username || 'A')[0].toUpperCase(),
                avatarUrl: s.uploader_avatar 
              },
              timestamp: createdAt.getTime(),
              utcTime: createdAt.toISOString().slice(0, 19).replace('T', ' ') + ' UTC',
              time: getTimeAgo(createdAt.getTime()),
            };
          });
          // Shuffle once when loading
          const shuffled = transformed.sort(() => Math.random() - 0.5);
          setSightings(shuffled);
        }
      } catch (err) {
        console.error('Failed to fetch sightings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSightings();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="w-8 h-8 text-green-400 animate-spin" />
      </div>
    );
  }

  if (sightings.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>No sightings yet</p>
      </div>
    );
  }

  return <VideoFeedView clips={sightings} showReward={false} title="Trending" isMobile={isMobile} onViewProfile={onViewProfile} mode="trending" />;
}

function ClassifyView({ isMobile, onViewProfile }) {
  const { API_URL, user } = useAuth();
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classifiedIds, setClassifiedIds] = useState(new Set());

  // Sample comments for random assignment
  const sampleComments = [
    { user: 'SkyWatcher_AZ', text: 'Incredible footage! Never seen anything like this.', avatar: 'S' },
    { user: 'NightOwl42', text: 'This is definitely not a conventional aircraft.', avatar: 'N' },
    { user: 'DroneHunter', text: 'Could be military? Hard to tell.', avatar: 'D' },
    { user: 'CosmicEye', text: 'I saw something similar last week!', avatar: 'C' },
  ];

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/sightings`);
        if (res.ok) {
          const data = await res.json();
          const transformed = data.map((s) => {
            const numComments = Math.floor(Math.random() * 3);
            const randomComments = [];
            for (let j = 0; j < numComments; j++) {
              const comment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
              randomComments.push({
                ...comment,
                id: j,
                time: `${Math.floor(Math.random() * 12) + 1}h ago`,
                likes: Math.floor(Math.random() * 50)
              });
            }
            const createdAt = new Date(s.created_at);
            return {
              id: s.id,
              videoUrl: s.video_url,
              location: s.location,
              title: s.title || s.location,
              classification: s.classification,
              confidence: s.ai_confidence,
              siteLikes: Math.floor(Math.random() * 200) + 20,
              siteComments: randomComments,
              owner: { 
                username: s.uploader_username || 'Admin', 
                avatar: (s.uploader_username || 'A')[0].toUpperCase(),
                avatarUrl: s.uploader_avatar 
              },
              timestamp: createdAt.getTime(),
              utcTime: createdAt.toISOString().slice(0, 19).replace('T', ' ') + ' UTC',
              time: getTimeAgo(createdAt.getTime()),
            };
          });
          // Shuffle for random order
          const shuffled = transformed.sort(() => Math.random() - 0.5);
          setSightings(shuffled);
        }
      } catch (err) {
        console.error('Failed to fetch sightings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSightings();
  }, [API_URL]);

  // Filter out already classified sightings
  const unclassifiedSightings = sightings.filter(s => !classifiedIds.has(s.id));

  const handleClassified = (id) => {
    setClassifiedIds(prev => new Set([...prev, id]));
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="w-8 h-8 text-green-400 animate-spin" />
      </div>
    );
  }

  if (unclassifiedSightings.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4">
        <Eye className="w-16 h-16 mb-4 text-green-400" />
        <h2 className="text-xl font-bold text-white mb-2">All Caught Up!</h2>
        <p className="text-center">You've classified all available sightings. Check back later for more!</p>
      </div>
    );
  }

  return <VideoFeedView clips={unclassifiedSightings} showReward={true} title="Classify" isMobile={isMobile} onViewProfile={onViewProfile} onClassified={handleClassified} mode="classify" />;
}

const communityTopics = [
  { id: 'all', label: 'All', icon: '🌐' },
  { id: 'sightings', label: 'Sightings', icon: '👁️' },
  { id: 'equipment', label: 'Equipment', icon: '📷' },
  { id: 'analysis', label: 'Analysis', icon: '📊' },
  { id: 'questions', label: 'Questions', icon: '❓' },
  { id: 'news', label: 'News', icon: '📰' },
];

const communityPostsData = [
  { id: 1, topic: 'sightings', title: 'Multiple sightings over Phoenix', content: 'Around 9:30 PM I captured a formation of 5 objects moving in perfect synchronization. Has anyone else seen this?', author: 'SkyWatcher_AZ', time: '2h ago', upvotes: 234, comments: 3, hasVideo: true, siteComments: [
    { id: 1, user: 'DesertWatcher', avatar: 'D', text: 'I saw the same thing from Scottsdale! Absolutely incredible.', time: '1h ago', likes: 45, replies: [
      { id: 11, user: 'SkyWatcher_AZ', avatar: 'S', text: 'What time exactly? Want to cross-reference our footage.', time: '45m ago', likes: 12 }
    ]},
    { id: 2, user: 'SkepticalSam', avatar: 'S', text: 'Could be Starlink satellites in formation.', time: '1h ago', likes: 8, replies: [] },
    { id: 3, user: 'PhoenixNights', avatar: 'P', text: 'Starlink doesnt move like that. This was completely different.', time: '30m ago', likes: 23, replies: [] },
  ]},
  { id: 2, topic: 'sightings', title: 'Need help identifying this', content: 'Object hovered for 2 minutes before accelerating at impossible speeds. Captured on my Skeye cam.', author: 'NewObserver22', time: '4h ago', upvotes: 156, comments: 2, hasVideo: true, siteComments: [
    { id: 1, user: 'TechAnalyst', avatar: 'T', text: 'Can you share the raw footage? Would love to run it through my analysis software.', time: '3h ago', likes: 34, replies: [] },
    { id: 2, user: 'DroneExpert', avatar: 'D', text: 'The acceleration pattern rules out any known drone technology.', time: '2h ago', likes: 56, replies: [] },
  ]},
  { id: 3, topic: 'equipment', title: 'Best camera settings?', content: 'What ISO settings work best for night captures? Getting a lot of noise in my footage.', author: 'TechExplorer', time: '6h ago', upvotes: 89, comments: 2, hasVideo: false, siteComments: [
    { id: 1, user: 'ProPhotographer', avatar: 'P', text: 'Try ISO 3200 with a 2-second exposure. Works great for me.', time: '5h ago', likes: 67, replies: [
      { id: 11, user: 'TechExplorer', avatar: 'T', text: 'Thanks! Will try this tonight.', time: '4h ago', likes: 5 }
    ]},
    { id: 2, user: 'NightOwl', avatar: 'N', text: 'Also make sure your lens is clean - dust shows up bad at night.', time: '4h ago', likes: 23, replies: [] },
  ]},
  { id: 4, topic: 'analysis', title: 'Speed analysis of recent Chile sighting', content: 'I ran frame-by-frame analysis and calculated the object was moving at approximately 4,500 mph based on reference points.', author: 'DataScientist_UAP', time: '8h ago', upvotes: 312, comments: 1, hasVideo: false, siteComments: [
    { id: 1, user: 'PhysicsProf', avatar: 'P', text: 'Your methodology is solid. Published similar findings in my analysis.', time: '6h ago', likes: 89, replies: [] },
  ]},
  { id: 5, topic: 'news', title: 'Congressional hearing scheduled for next month', content: 'New whistleblower testimony expected. This could be huge for disclosure.', author: 'NewsWatcher', time: '12h ago', upvotes: 567, comments: 4, hasVideo: false, siteComments: [
    { id: 1, user: 'DCInsider', avatar: 'D', text: 'Hearing from sources this will be bigger than Grusch testimony.', time: '10h ago', likes: 234, replies: [] },
    { id: 2, user: 'SkepticalVoice', avatar: 'S', text: 'Ill believe it when I see it. Been burned before.', time: '9h ago', likes: 45, replies: [] },
    { id: 3, user: 'TruthSeeker', avatar: 'T', text: 'Finally! The truth is coming out.', time: '8h ago', likes: 123, replies: [] },
    { id: 4, user: 'PoliticalWatcher', avatar: 'P', text: 'Mark your calendars folks!', time: '6h ago', likes: 67, replies: [] },
  ]},
  { id: 6, topic: 'questions', title: 'How do I calibrate my Skeye camera?', content: 'Just got my camera and want to make sure the motion detection is set up correctly.', author: 'NewUser2024', time: '1d ago', upvotes: 45, comments: 1, hasVideo: false, siteComments: [
    { id: 1, user: 'SkeyeSupport', avatar: 'S', text: 'Check out the setup guide in the app Settings > Calibration. Happy to help if you have questions!', time: '20h ago', likes: 12, replies: [] },
  ]},
  { id: 7, topic: 'sightings', title: 'Triangular craft over Texas', content: 'Silent, massive, three lights at each corner. My whole neighborhood saw it.', author: 'TexasSkies', time: '1d ago', upvotes: 445, comments: 3, hasVideo: true, siteComments: [
    { id: 1, user: 'TR3BExpert', avatar: 'T', text: 'Classic TR-3B description. Government craft or something else?', time: '20h ago', likes: 156, replies: [] },
    { id: 2, user: 'AustinWatcher', avatar: 'A', text: 'Saw the same thing! We need to compare notes.', time: '18h ago', likes: 78, replies: [] },
    { id: 3, user: 'MilitaryVet', avatar: 'M', text: 'Ive worked on classified projects. This isnt ours.', time: '12h ago', likes: 234, replies: [] },
  ]},
  { id: 8, topic: 'analysis', title: 'Debunked: Recent viral video was a drone', content: 'After careful analysis, the movement pattern and light signature clearly indicate a DJI drone.', author: 'SkepticalAnalyst', time: '2d ago', upvotes: 123, comments: 2, hasVideo: false, siteComments: [
    { id: 1, user: 'OpenMinded', avatar: 'O', text: 'Good analysis. We need more critical thinking in this community.', time: '1d ago', likes: 67, replies: [] },
    { id: 2, user: 'Believer99', avatar: 'B', text: 'Not everything is a drone...', time: '1d ago', likes: 12, replies: [] },
  ]},
];

function CommunityView({ isMobile }) {
  const [activeTopic, setActiveTopic] = useState('all');
  const [sortBy, setSortBy] = useState('hot');
  const [votedPosts, setVotedPosts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTopic, setNewPostTopic] = useState('sightings');
  const [likedComments, setLikedComments] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [newComment, setNewComment] = useState('');
  const [swipeY, setSwipeY] = useState(0);
  const [swipeStartY, setSwipeStartY] = useState(null);

  const handleVote = (id, e) => { e.stopPropagation(); setVotedPosts(prev => ({ ...prev, [id]: !prev[id] })); };
  const handleLikeComment = (commentId) => setLikedComments(prev => ({ ...prev, [commentId]: !prev[commentId] }));

  // Swipe to dismiss handlers
  const handleTouchStart = (e) => setSwipeStartY(e.touches[0].clientY);
  const handleTouchMove = (e) => {
    if (swipeStartY === null) return;
    const diff = e.touches[0].clientY - swipeStartY;
    if (diff > 0) setSwipeY(diff);
  };
  const handleTouchEnd = () => {
    if (swipeY > 100) setSelectedPost(null);
    setSwipeY(0);
    setSwipeStartY(null);
  };

  const filteredPosts = activeTopic === 'all' ? communityPostsData : communityPostsData.filter(p => p.topic === activeTopic);
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'hot') return (b.upvotes + b.comments) - (a.upvotes + a.comments);
    if (sortBy === 'new') return 0;
    if (sortBy === 'top') return b.upvotes - a.upvotes;
    return 0;
  });

  const CommentComponent = ({ comment, depth = 0 }) => (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-700 pl-4' : ''}`}>
      <div className="flex gap-3 py-3">
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-xs font-bold text-green-400 flex-shrink-0">{comment.avatar}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{comment.user}</span>
            <span className="text-xs text-gray-500">{comment.time}</span>
          </div>
          <p className="text-sm text-gray-300 mb-2">{comment.text}</p>
          <div className="flex items-center gap-4">
            <button onClick={() => handleLikeComment(comment.id)} className={`flex items-center gap-1 text-xs ${likedComments[comment.id] ? 'text-green-400' : 'text-gray-500 hover:text-white'}`}>
              <ThumbsUp className="w-3 h-3" />
              <span>{comment.likes + (likedComments[comment.id] ? 1 : 0)}</span>
            </button>
            <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="text-xs text-gray-500 hover:text-white">Reply</button>
          </div>
          {replyingTo === comment.id && (
            <div className="mt-2 flex gap-2">
              <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." className="flex-1 px-3 py-2 bg-white/5 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-green-500/50" />
              <button onClick={() => { setReplyingTo(null); setReplyText(''); }} className="px-3 py-2 bg-green-500 rounded-lg text-sm font-medium">Reply</button>
            </div>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.map(reply => (
        <CommentComponent key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );

  // Desktop Layout
  if (!isMobile) {
    return (
      <div className="h-full flex">
        {/* Left Sidebar - Topics */}
        <div className="w-56 bg-[#0a0a0a] border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-bold text-lg">Community</h2>
          </div>
          <div className="p-3 space-y-1">
            {communityTopics.map(topic => (
              <button key={topic.id} onClick={() => setActiveTopic(topic.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTopic === topic.id ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                <span>{topic.icon}</span>
                <span className="font-medium">{topic.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-auto p-3 border-t border-gray-800">
            <button onClick={() => setShowNewPost(true)} className="w-full py-3 bg-green-500 rounded-xl font-semibold hover:bg-green-600 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              New Post
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Sort Bar */}
          <div className="p-4 border-b border-gray-800 flex items-center gap-4">
            <span className="text-sm text-gray-500">Sort by:</span>
            {['hot', 'new', 'top'].map(s => (
              <button key={s} onClick={() => setSortBy(s)} className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${sortBy === s ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'}`}>{s}</button>
            ))}
          </div>

          {/* Posts */}
          <div className="flex-1 overflow-y-auto">
            {sortedPosts.map(post => (
              <div key={post.id} onClick={() => setSelectedPost(post)} className="flex gap-4 p-4 border-b border-gray-800 hover:bg-white/5 cursor-pointer">
                {/* Vote */}
                <div className="flex flex-col items-center gap-1">
                  <button onClick={(e) => handleVote(post.id, e)} className={`p-1 rounded hover:bg-white/10 ${votedPosts[post.id] ? 'text-green-400' : 'text-gray-500'}`}>
                    <ChevronUp className="w-6 h-6" />
                  </button>
                  <span className={`text-sm font-bold ${votedPosts[post.id] ? 'text-green-400' : ''}`}>{post.upvotes + (votedPosts[post.id] ? 1 : 0)}</span>
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{communityTopics.find(t => t.id === post.topic)?.label}</span>
                    {post.hasVideo && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">📹 Video</span>}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>u/{post.author}</span>
                    <span>{post.time}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.comments} comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8" onClick={() => setSelectedPost(null)}>
            <div className="bg-[#141414] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{communityTopics.find(t => t.id === selectedPost.topic)?.label}</span>
                    <span className="text-xs text-gray-500">Posted by u/{selectedPost.author} • {selectedPost.time}</span>
                  </div>
                  <button onClick={() => setSelectedPost(null)}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <h2 className="text-xl font-bold mb-3">{selectedPost.title}</h2>
                <p className="text-gray-300 mb-6">{selectedPost.content}</p>
                {selectedPost.hasVideo && (
                  <div className="aspect-video bg-black rounded-xl mb-6">
                    <div className="w-full h-full flex items-center justify-center text-gray-500"><Play className="w-16 h-16" /></div>
                  </div>
                )}
                <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
                  <button onClick={(e) => handleVote(selectedPost.id, e)} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${votedPosts[selectedPost.id] ? 'bg-green-500/20 text-green-400' : 'bg-white/5 hover:bg-white/10'}`}>
                    <ChevronUp className="w-5 h-5" />
                    <span className="font-semibold">{selectedPost.upvotes + (votedPosts[selectedPost.id] ? 1 : 0)}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10">
                    <MessageCircle className="w-5 h-5" />
                    <span>{selectedPost.siteComments?.length || 0} Comments</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
                <div className="pt-4">
                  <div className="flex gap-3 mb-4">
                    <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-1 px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50" />
                    <button className="px-6 py-3 bg-green-500 rounded-xl font-medium">Post</button>
                  </div>
                  {/* Comments */}
                  <div className="space-y-1">
                    {selectedPost.siteComments && selectedPost.siteComments.length > 0 ? (
                      selectedPost.siteComments.map(comment => (
                        <CommentComponent key={comment.id} comment={comment} />
                      ))
                    ) : (
                      <p className="text-center text-gray-500 text-sm py-4">No comments yet. Be the first!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Post Modal */}
        {showNewPost && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8" onClick={() => setShowNewPost(false)}>
            <div className="bg-[#141414] rounded-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Create New Post</h2>
                  <button onClick={() => setShowNewPost(false)}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Topic</label>
                    <div className="flex flex-wrap gap-2">
                      {communityTopics.filter(t => t.id !== 'all').map(topic => (
                        <button key={topic.id} onClick={() => setNewPostTopic(topic.id)} className={`px-3 py-1.5 rounded-full text-sm ${newPostTopic === topic.id ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                          {topic.icon} {topic.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Title</label>
                    <input type="text" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} placeholder="Enter a descriptive title..." className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Content</label>
                    <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder="Share your sighting, question, or analysis..." rows={5} className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50 resize-none" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowNewPost(false)} className="flex-1 py-3 bg-white/5 rounded-xl font-medium hover:bg-white/10">Cancel</button>
                    <button onClick={() => { setShowNewPost(false); setNewPostTitle(''); setNewPostContent(''); }} className="flex-1 py-3 bg-green-500 rounded-xl font-medium hover:bg-green-600">Post</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile Layout
  return (
    <div className="h-full flex flex-col">
      {/* Topic Tabs - Scrollable */}
      <div className="flex-shrink-0 border-b border-gray-800">
        <div className="flex overflow-x-auto scrollbar-hide px-2 py-2 gap-2">
          {communityTopics.map(topic => (
            <button key={topic.id} onClick={() => setActiveTopic(topic.id)} className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${activeTopic === topic.id ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'}`}>
              <span>{topic.icon}</span>
              <span>{topic.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort Bar */}
      <div className="flex-shrink-0 px-3 py-2 flex items-center gap-2 border-b border-gray-800/50">
        {['hot', 'new', 'top'].map(s => (
          <button key={s} onClick={() => setSortBy(s)} className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${sortBy === s ? 'bg-green-500/20 text-green-400' : 'text-gray-500'}`}>{s}</button>
        ))}
      </div>

      {/* Posts */}
      <div className="flex-1 overflow-y-auto">
        {sortedPosts.map(post => (
          <div key={post.id} onClick={() => setSelectedPost(post)} className="flex gap-3 p-3 border-b border-gray-800/50 active:bg-white/5">
            {/* Vote */}
            <div className="flex flex-col items-center">
              <button onClick={(e) => handleVote(post.id, e)} className={votedPosts[post.id] ? 'text-green-400' : 'text-gray-500'}>
                <ChevronUp className="w-5 h-5" />
              </button>
              <span className={`text-xs font-bold ${votedPosts[post.id] ? 'text-green-400' : ''}`}>{post.upvotes + (votedPosts[post.id] ? 1 : 0)}</span>
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-400">{communityTopics.find(t => t.id === post.topic)?.label}</span>
                {post.hasVideo && <span className="text-[10px] text-green-400">📹</span>}
              </div>
              <h3 className="font-semibold text-sm text-white mb-1 line-clamp-2">{post.title}</h3>
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <span>u/{post.author}</span>
                <span>{post.time}</span>
                <span className="flex items-center gap-0.5"><MessageCircle className="w-3 h-3" />{post.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button onClick={() => setShowNewPost(true)} className="fixed bottom-20 right-4 w-14 h-14 bg-green-500 rounded-full shadow-lg flex items-center justify-center active:scale-95 z-40">
        <Plus className="w-6 h-6" />
      </button>

      {/* Post Detail - Bottom Sheet */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setSelectedPost(null)}>
          <div 
            className="absolute inset-x-0 bottom-0 bg-[#141414] rounded-t-3xl max-h-[85vh] flex flex-col transition-transform" 
            style={{ transform: `translateY(${swipeY}px)` }}
            onClick={e => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header with swipe handle and X button */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-800">
              <div className="w-8" /> {/* Spacer */}
              <div className="w-12 h-1 bg-gray-600 rounded-full" />
              <button onClick={() => setSelectedPost(null)} className="p-1"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{communityTopics.find(t => t.id === selectedPost.topic)?.label}</span>
                <span className="text-xs text-gray-500">u/{selectedPost.author} • {selectedPost.time}</span>
              </div>
              <h2 className="text-lg font-bold mb-2">{selectedPost.title}</h2>
              <p className="text-sm text-gray-300 mb-4">{selectedPost.content}</p>
              {selectedPost.hasVideo && (
                <div className="aspect-video bg-black rounded-xl mb-4 flex items-center justify-center"><Play className="w-12 h-12 text-gray-500" /></div>
              )}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                <button onClick={(e) => handleVote(selectedPost.id, e)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg ${votedPosts[selectedPost.id] ? 'bg-green-500/20 text-green-400' : 'bg-white/5'}`}>
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">{selectedPost.upvotes + (votedPosts[selectedPost.id] ? 1 : 0)}</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{selectedPost.siteComments?.length || 0}</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              {/* Comments */}
              <div className="pt-4 space-y-1">
                {selectedPost.siteComments && selectedPost.siteComments.length > 0 ? (
                  selectedPost.siteComments.map(comment => (
                    <CommentComponent key={comment.id} comment={comment} />
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-sm py-4">No comments yet. Be the first!</p>
                )}
              </div>
            </div>
            <div className="p-3 border-t border-gray-800">
              <div className="flex gap-2">
                <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-1 px-3 py-2 bg-white/5 border border-gray-700 rounded-xl text-white text-sm" />
                <button className="px-4 py-2 bg-green-500 rounded-xl text-sm font-medium">Post</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal - Mobile */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setShowNewPost(false)}>
          <div className="absolute inset-x-0 bottom-0 bg-[#141414] rounded-t-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3" />
            <div className="p-4">
              <h2 className="text-lg font-bold mb-4">Create New Post</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Topic</label>
                  <div className="flex flex-wrap gap-2">
                    {communityTopics.filter(t => t.id !== 'all').map(topic => (
                      <button key={topic.id} onClick={() => setNewPostTopic(topic.id)} className={`px-2 py-1 rounded-full text-xs ${newPostTopic === topic.id ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'}`}>
                        {topic.icon} {topic.label}
                      </button>
                    ))}
                  </div>
                </div>
                <input type="text" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} placeholder="Title..." className="w-full px-3 py-2 bg-white/5 border border-gray-700 rounded-xl text-white text-sm" />
                <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder="Share your sighting..." rows={4} className="w-full px-3 py-2 bg-white/5 border border-gray-700 rounded-xl text-white text-sm resize-none" />
                <div className="flex gap-2">
                  <button onClick={() => setShowNewPost(false)} className="flex-1 py-3 bg-white/5 rounded-xl font-medium text-sm">Cancel</button>
                  <button onClick={() => { setShowNewPost(false); setNewPostTitle(''); setNewPostContent(''); }} className="flex-1 py-3 bg-green-500 rounded-xl font-medium text-sm">Post</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Avatar Picker Modal Component
function AvatarPickerModal({ currentAvatar, avatars, onClose }) {
  const { token, API_URL, user } = useAuth();
  const [selected, setSelected] = useState(currentAvatar);
  const [customPreview, setCustomPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  // Convert data URL to File for upload
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, {type: mime});
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomPreview(reader.result);
        setSelected(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!selected || selected === currentAvatar) {
      onClose();
      return;
    }
    setSaving(true);
    try {
      let finalAvatarUrl = selected;
      
      // If avatar is a data URL (custom upload), upload to Supabase first
      if (selected && selected.startsWith('data:')) {
        const file = dataURLtoFile(selected, `avatar-${user?.id}-${Date.now()}.jpg`);
        finalAvatarUrl = await uploadAvatar(file, user?.id || 'user');
      }
      
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatarUrl: finalAvatarUrl })
      });
      if (res.ok) {
        window.location.reload(); // Refresh to show new avatar
      }
    } catch (err) {
      console.error('Failed to update avatar:', err);
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#141414] rounded-2xl border border-gray-700 w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="font-semibold text-white">Choose Avatar</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-4">
          {/* Upload custom option */}
          <label className={`mb-4 flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${customPreview ? 'border-green-500 bg-green-500/10' : 'border-gray-700 hover:border-gray-500'}`}>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            {customPreview ? (
              <div className="flex items-center gap-3">
                <img src={customPreview} alt="Custom" className="w-12 h-12 rounded-full object-cover" />
                <span className="text-sm text-green-400">Custom image selected</span>
              </div>
            ) : (
              <>
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-400">Upload your own image</span>
              </>
            )}
          </label>
          
          <p className="text-xs text-gray-500 mb-3 text-center">Or choose a preset</p>
          
          <div className="grid grid-cols-3 gap-3">
            {avatars.map((avatar, i) => (
              <button
                key={i}
                onClick={() => { setSelected(avatar); setCustomPreview(null); }}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selected === avatar && !customPreview ? 'border-green-500 scale-105' : 'border-gray-700 hover:border-gray-500'}`}
              >
                <img src={avatar} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-800 flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 bg-white/5 rounded-xl font-medium text-sm text-gray-400 hover:bg-white/10">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-green-500 rounded-xl font-medium text-sm text-white hover:bg-green-600 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileView({ isMobile, profileSubTab, setProfileSubTab, devices, clips }) {
  const { user } = useAuth();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const subTabs = [
    { id: 'devices', label: 'My Devices', icon: Camera },
    { id: 'clips', label: 'My Clips', icon: Film },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Default avatar options
  const defaultAvatars = [
    'https://api.dicebear.com/7.x/bottts/svg?seed=robot1&backgroundColor=0a5c36',
    'https://api.dicebear.com/7.x/bottts/svg?seed=robot2&backgroundColor=0a5c36',
    'https://api.dicebear.com/7.x/bottts/svg?seed=robot3&backgroundColor=0a5c36',
    'https://api.dicebear.com/7.x/bottts/svg?seed=alien1&backgroundColor=0a5c36',
    'https://api.dicebear.com/7.x/bottts/svg?seed=alien2&backgroundColor=0a5c36',
    'https://api.dicebear.com/7.x/bottts/svg?seed=ufo1&backgroundColor=0a5c36',
  ];

  // Generate avatar from username initials if no avatar URL
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className={`flex-shrink-0 ${isMobile ? 'p-4' : 'p-6'} bg-gradient-to-b from-green-500/10 to-transparent`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div 
              onClick={() => setShowAvatarPicker(true)}
              className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} rounded-full overflow-hidden border-2 border-green-500/50 flex items-center justify-center bg-green-500/20 cursor-pointer hover:border-green-400 transition-colors`}
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className={`font-bold text-green-400 ${isMobile ? 'text-xl' : 'text-2xl'}`}>{getInitials(user?.username)}</span>
              )}
            </div>
            {/* Pencil Edit Icon */}
            <button 
              onClick={() => setShowAvatarPicker(true)}
              className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-[#0a0a0a] hover:bg-green-400 transition-colors"
            >
              <Pencil className="w-3 h-3 text-white" />
            </button>
          </div>
          <div>
            <h2 className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>{user?.username || 'User'}</h2>
            <p className={`text-gray-400 ${isMobile ? 'text-sm' : ''}`}>{user?.email || ''}</p>
          </div>
        </div>
        <div className={`flex ${isMobile ? 'gap-6 mt-4' : 'gap-8 mt-5'}`}>
          <div><p className={`font-bold text-green-400 ${isMobile ? '' : 'text-xl'}`}>{user?.skeyeBalance?.toLocaleString() || 0}</p><p className={`text-gray-500 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>$SKEYE</p></div>
          <div><p className={`font-bold ${isMobile ? '' : 'text-xl'}`}>{clips?.length || 0}</p><p className={`text-gray-500 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>Classified</p></div>
          <div><p className={`font-bold ${isMobile ? '' : 'text-xl'}`}>#{user?.rank || '—'}</p><p className={`text-gray-500 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>Rank</p></div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <AvatarPickerModal 
          currentAvatar={user?.avatarUrl} 
          avatars={defaultAvatars} 
          onClose={() => setShowAvatarPicker(false)} 
        />
      )}

      {/* Sub Tabs */}
      <div className={`flex-shrink-0 flex border-b border-gray-800 ${isMobile ? '' : 'px-4'}`}>
        {subTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setProfileSubTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 ${isMobile ? 'py-3' : 'py-4'} border-b-2 ${profileSubTab === tab.id ? 'border-green-400 text-green-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
              <Icon className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
              <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {profileSubTab === 'devices' && <DevicesSubView isMobile={isMobile} devices={devices} />}
        {profileSubTab === 'clips' && <ClipsSubView isMobile={isMobile} clips={clips} devices={devices} />}
        {profileSubTab === 'settings' && <SettingsSubView isMobile={isMobile} />}
      </div>
    </div>
  );
}

function DevicesSubView({ isMobile, devices }) {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [showAddDevice, setShowAddDevice] = useState(false);

  const openModal = (type, device) => { setSelectedDevice(device); setActiveModal(type); };
  const closeModal = () => { setActiveModal(null); setSelectedDevice(null); };

  return (
    <div className={`${isMobile ? 'p-3 space-y-3' : 'p-5'}`}>
      {/* Add Device Button */}
      <button onClick={() => setShowAddDevice(true)} className={`w-full ${isMobile ? 'py-3' : 'py-4 mb-4'} border-2 border-dashed border-gray-700 rounded-2xl text-gray-400 flex items-center justify-center gap-2 hover:border-green-500/50 hover:text-green-400 transition-colors`}>
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add New Device</span>
      </button>

      {/* Device Cards */}
      <div className={`${isMobile ? 'space-y-3' : 'grid grid-cols-1 lg:grid-cols-2 gap-4'}`}>
        {devices.map(device => (
          <div key={device.id} className={`${isMobile ? 'p-3' : 'p-5'} rounded-2xl border ${device.status === 'online' ? 'bg-gradient-to-br from-green-500/5 to-transparent border-green-500/20 hover:border-green-500/40' : 'bg-gradient-to-br from-gray-800/30 to-transparent border-gray-700/50'} transition-colors`}>
            <div className="flex items-start gap-3">
              <div className={`${isMobile ? 'w-12 h-12' : 'w-20 h-20'} flex items-center justify-center`}>
                <img src={cameraImg} alt="Camera" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold truncate ${isMobile ? 'text-sm' : 'text-lg'}`}>{device.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${device.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${device.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                    {device.status === 'online' ? 'Live' : 'Offline'}
                  </span>
                </div>
                <p className={`text-gray-400 flex items-center gap-1 mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}><MapPin className="w-3 h-3" />{device.location}</p>
                <p className={`text-gray-500 font-mono ${isMobile ? 'text-[9px]' : 'text-[11px]'}`}>{device.lat.toFixed(4)}°, {device.lng.toFixed(4)}°</p>
                <p className={`text-gray-500 font-mono mt-1 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>S/N: {device.serial}</p>
                <div className={`flex items-center gap-4 mt-2 ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500`}>
                  <span className="flex items-center gap-1"><Wifi className={`w-3 h-3 ${device.signal > 80 ? 'text-green-400' : device.signal > 0 ? 'text-yellow-400' : 'text-red-400'}`} />{device.signal > 0 ? `${device.signal}%` : 'N/A'}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-green-400" />{device.detections} detections</span>
                </div>
              </div>
            </div>
            <div className={`flex gap-2 ${isMobile ? 'mt-3' : 'mt-4 pt-4 border-t border-gray-800/50'}`}>
              <button onClick={() => openModal('feed', device)} disabled={device.status !== 'online'} className={`flex-1 ${isMobile ? 'py-2 text-xs' : 'py-2.5 text-sm'} font-medium rounded-lg ${device.status === 'online' ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'}`}>View Feed</button>
              <button onClick={() => openModal('settings', device)} className={`flex-1 ${isMobile ? 'py-2 text-xs' : 'py-2.5 text-sm'} font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg`}>Settings</button>
              <button onClick={() => openModal('history', device)} className={`flex-1 ${isMobile ? 'py-2 text-xs' : 'py-2.5 text-sm'} font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg`}>History</button>
            </div>
          </div>
        ))}
      </div>

      {/* View Feed Modal */}
      {activeModal === 'feed' && selectedDevice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className={`bg-[#141414] rounded-2xl border border-green-500/20 ${isMobile ? 'w-full' : 'w-full max-w-4xl'} overflow-hidden`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div><h3 className="font-semibold text-white">{selectedDevice.name} - Live Feed</h3><p className="text-xs text-gray-400">{selectedDevice.location}</p></div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /><span className="text-xs text-red-400">REC</span></div>
                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
            </div>
            <div className="aspect-video bg-black relative">
              <div className="absolute inset-0 flex items-center justify-center"><Camera className="w-16 h-16 text-gray-700" /><p className="text-gray-500 ml-4">Live feed streaming...</p></div>
              <div className="absolute top-4 left-4 bg-black/60 px-2 py-1 rounded text-xs text-white font-mono">{new Date().toLocaleTimeString()}</div>
              <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded text-xs text-green-400">1080p • 30fps</div>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-400 text-center mb-3">Pan / Tilt / Zoom Controls</p>
              <div className="flex items-center justify-center gap-4">
                <button className="p-3 bg-white/5 rounded-full hover:bg-white/10"><ChevronLeft className="w-5 h-5" /></button>
                <div className="flex flex-col gap-2">
                  <button className="p-3 bg-white/5 rounded-full hover:bg-white/10"><ChevronUp className="w-5 h-5" /></button>
                  <button className="p-3 bg-white/5 rounded-full hover:bg-white/10"><ChevronDown className="w-5 h-5" /></button>
                </div>
                <button className="p-3 bg-white/5 rounded-full hover:bg-white/10"><ChevronRight className="w-5 h-5" /></button>
                <div className="w-px h-12 bg-gray-700 mx-4" />
                <div className="flex items-center gap-2">
                  <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-lg font-bold">−</button>
                  <span className="text-xs text-gray-400 w-12 text-center">Zoom</span>
                  <button className="p-3 bg-white/5 rounded-full hover:bg-white/10"><Plus className="w-5 h-5" /></button>
                </div>
                <div className="w-px h-12 bg-gray-700 mx-4" />
                <button className="p-3 bg-white/5 rounded-full hover:bg-white/10"><Volume2 className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' && selectedDevice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className={`bg-[#141414] rounded-2xl border border-green-500/20 ${isMobile ? 'w-full max-h-[90vh]' : 'w-full max-w-lg'} overflow-hidden flex flex-col`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="font-semibold text-white flex items-center gap-2"><Settings className="w-5 h-5 text-green-400" />Device Settings</h3>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div><label className="block text-xs text-gray-400 mb-2">Device Name</label><input type="text" defaultValue={selectedDevice.name} className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50" /></div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Location</label>
                <div className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-gray-400">{selectedDevice.location}</div>
                <p className="text-xs text-gray-500 mt-1">Coordinates: {selectedDevice.id === 1 || selectedDevice.id === 2 ? '38.7223° N, 9.1393° W' : selectedDevice.id === 3 ? '30.2672° N, 97.7431° W' : '32.7157° N, 117.1611° W'}</p>
              </div>
              <div className="border-t border-gray-800 pt-4">
                <h4 className="text-sm font-semibold text-white mb-3">WiFi Settings</h4>
                <div className="space-y-3">
                  <div><label className="block text-xs text-gray-400 mb-2">WiFi Network</label><input type="text" defaultValue="Home_Network_5G" className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50" /></div>
                  <div><label className="block text-xs text-gray-400 mb-2">WiFi Password</label><input type="password" defaultValue="password123" className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50" /></div>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-4">
                <h4 className="text-sm font-semibold text-white mb-3">Detection Settings</h4>
                <div><label className="block text-xs text-gray-400 mb-2">Detection Sensitivity</label><input type="range" defaultValue="70" className="w-full" /><div className="flex justify-between text-xs text-gray-500 mt-1"><span>Low</span><span>High</span></div></div>
              </div>
              <div className="border-t border-gray-800 pt-4 space-y-3">
                <h4 className="text-sm font-semibold text-white mb-3">Features</h4>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl"><div><p className="text-sm text-white">Motion Detection</p><p className="text-xs text-gray-400">Trigger recording on movement</p></div><div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div></div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl"><div><p className="text-sm text-white">Starlight Vision</p><p className="text-xs text-gray-400">Enhanced low-light capture</p></div><div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div></div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl"><div><p className="text-sm text-white">Audio Recording</p><p className="text-xs text-gray-400">Capture sound with video</p></div><div className="w-12 h-6 bg-gray-600 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" /></div></div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl"><div><p className="text-sm text-white">Auto-Upload Clips</p><p className="text-xs text-gray-400">Upload detections to cloud</p></div><div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div></div>
              </div>
              <div className="border-t border-gray-800 pt-4">
                <button className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl font-medium hover:bg-red-500/20 transition-colors">Delete This Device</button>
                <p className="text-xs text-gray-500 text-center mt-2">This will remove the device from your account</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-800 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 text-gray-400 hover:bg-white/5 rounded-lg text-sm">Cancel</button>
              <button className="px-6 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {activeModal === 'history' && selectedDevice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className={`bg-[#141414] rounded-2xl border border-green-500/20 ${isMobile ? 'w-full max-h-[80vh]' : 'w-full max-w-2xl max-h-[80vh]'} overflow-hidden flex flex-col`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800"><h3 className="font-semibold text-white">{selectedDevice.name} - Detection History</h3><button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {[{ time: 'Today, 9:34 PM', type: 'UAP', duration: '0:32', confidence: 87 }, { time: 'Today, 8:12 PM', type: 'Aircraft', duration: '0:18', confidence: 94 }, { time: 'Today, 6:45 PM', type: 'Drone', duration: '1:24', confidence: 91 }, { time: 'Yesterday, 11:23 PM', type: 'UAP', duration: '0:45', confidence: 76 }, { time: 'Yesterday, 9:15 PM', type: 'Bird', duration: '0:12', confidence: 89 }].map((clip, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer">
                  <div className="w-20 h-14 bg-gray-800 rounded-lg flex items-center justify-center relative"><Play className="w-5 h-5 text-gray-500" /><span className="absolute bottom-1 right-1 text-[10px] bg-black/60 px-1 rounded">{clip.duration}</span></div>
                  <div className="flex-1"><span className={`px-2 py-0.5 rounded text-[10px] font-bold`} style={{ backgroundColor: classificationOptions.find(o => o.id === clip.type)?.color + '30', color: classificationOptions.find(o => o.id === clip.type)?.color }}>{classificationOptions.find(o => o.id === clip.type)?.icon} {clip.type}</span><p className="text-xs text-gray-400 mt-1">{clip.time}</p></div>
                  <span className="text-xs text-green-400 font-medium">{clip.confidence}%</span>
                  <div className="flex gap-1"><button className="p-2 hover:bg-white/10 rounded-lg"><Download className="w-4 h-4 text-gray-400" /></button><button className="p-2 hover:bg-white/10 rounded-lg"><Share2 className="w-4 h-4 text-gray-400" /></button></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Device Modal */}
      {showAddDevice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddDevice(false)}>
          <div className={`bg-[#141414] rounded-2xl border border-green-500/20 ${isMobile ? 'w-full' : 'w-full max-w-md'} overflow-hidden`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800"><h3 className="font-semibold text-white">Add New Device</h3><button onClick={() => setShowAddDevice(false)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button></div>
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><Camera className="w-10 h-10 text-green-400" /></div>
              <h4 className="text-lg font-semibold text-white mb-2">Connect Your Skeye Camera</h4>
              <p className="text-sm text-gray-400 mb-6">Make sure your camera is powered on and in pairing mode (blue LED blinking)</p>
              <div className="space-y-3">
                <button className="w-full py-3 bg-green-500/10 text-green-400 rounded-xl font-medium hover:bg-green-500/20">Scan QR Code</button>
                <button className="w-full py-3 bg-white/5 text-gray-400 rounded-xl font-medium hover:bg-white/10">Enter Serial Number Manually</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClipsSubView({ isMobile, clips, devices }) {
  const [selectedClip, setSelectedClip] = useState(null);
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');

  const filteredClips = deviceFilter === 'all' ? clips : clips.filter(c => c.device === deviceFilter);
  const uniqueDevices = [...new Set(clips.map(c => c.device))];

  return (
    <div className={`${isMobile ? 'p-3' : 'p-5'}`}>
      {/* Filters */}
      <div className={`flex items-center justify-between ${isMobile ? 'mb-3' : 'mb-5'}`}>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={deviceFilter} onChange={e => setDeviceFilter(e.target.value)} className={`bg-white/5 border border-gray-700 rounded-lg text-white ${isMobile ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'}`}>
            <option value="all">All Devices</option>
            {uniqueDevices.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        {!isMobile && (
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400'}`}><List className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400'}`}><Grid className="w-4 h-4" /></button>
          </div>
        )}
      </div>

      {/* List View */}
      {(isMobile || viewMode === 'list') ? (
        <div className="space-y-2">
          {filteredClips.map(clip => (
            <div key={clip.id} onClick={() => setSelectedClip(clip)} className={`flex items-center gap-3 ${isMobile ? 'p-2' : 'p-3'} bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer`}>
              <div className={`${isMobile ? 'w-20 h-14' : 'w-32 h-20'} bg-black rounded-lg relative flex-shrink-0 overflow-hidden`}>
                <img src={`https://img.youtube.com/vi/${clip.videoId}/mqdefault.jpg`} alt="Clip" className="w-full h-full object-cover" />
                <Play className={`absolute inset-0 m-auto ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-white/80`} />
                <span className="absolute bottom-1 right-1 text-[10px] bg-black/70 px-1 rounded">{clip.duration}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded font-bold ${isMobile ? 'text-[10px]' : 'text-xs'}`} style={{ backgroundColor: classificationOptions.find(o => o.id === clip.type)?.color + '30', color: classificationOptions.find(o => o.id === clip.type)?.color }}>
                    {classificationOptions.find(o => o.id === clip.type)?.icon} {clip.type}
                  </span>
                  <span className={`text-green-400 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{clip.confidence}%</span>
                </div>
                <p className={`text-white truncate ${isMobile ? 'text-xs' : 'text-sm font-medium'}`}>{clip.device}</p>
                <p className={`text-gray-500 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{clip.time}</p>
                {!isMobile && (
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{clip.likes || 0}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{clip.commentsCount || 0}</span>
                  </div>
                )}
              </div>
              <div className={`flex ${isMobile ? 'gap-1' : 'gap-2'}`}>
                <button className={`${isMobile ? 'p-2' : 'p-2'} hover:bg-white/10 rounded-lg`}><Download className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400`} /></button>
                <button className={`${isMobile ? 'p-2' : 'p-2'} hover:bg-white/10 rounded-lg`}><Share2 className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400`} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grid View - Desktop only */
        <div className="grid grid-cols-3 gap-4">
          {filteredClips.map(clip => (
            <div key={clip.id} onClick={() => setSelectedClip(clip)} className="rounded-xl overflow-hidden bg-white/5 hover:bg-white/10 cursor-pointer">
              <div className="aspect-video bg-black relative">
                <img src={`https://img.youtube.com/vi/${clip.videoId}/mqdefault.jpg`} alt="Clip" className="w-full h-full object-cover" />
                <Play className="absolute inset-0 m-auto w-10 h-10 text-white/80" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: classificationOptions.find(o => o.id === clip.type)?.color, color: 'white' }}>{classificationOptions.find(o => o.id === clip.type)?.icon} {clip.type}</span>
                <span className="absolute bottom-2 right-2 text-xs bg-black/70 px-1.5 py-0.5 rounded">{clip.duration}</span>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{clip.device}</p>
                <p className="text-xs text-gray-500 mt-0.5">{clip.time}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{clip.likes || 0}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{clip.commentsCount || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clip Detail Modal */}
      {selectedClip && (
        <div className="fixed inset-0 z-50 bg-black/90" onClick={() => setSelectedClip(null)}>
          <div className={`h-full flex ${isMobile ? 'flex-col' : 'items-center justify-center p-8'}`} onClick={e => e.stopPropagation()}>
            {isMobile ? (
              <>
                <div className="flex items-center justify-between p-4">
                  <div><h3 className="font-semibold">{selectedClip.device}</h3><p className="text-xs text-gray-400">{selectedClip.time}</p></div>
                  <button onClick={() => setSelectedClip(null)}><X className="w-6 h-6 text-gray-400" /></button>
                </div>
                <div className="flex-1 bg-black">
                  <iframe src={`https://www.youtube.com/embed/${selectedClip.videoId}?autoplay=1&playsinline=1&rel=0`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Clip" />
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ backgroundColor: classificationOptions.find(o => o.id === selectedClip.type)?.color + '33', color: classificationOptions.find(o => o.id === selectedClip.type)?.color }}>{classificationOptions.find(o => o.id === selectedClip.type)?.icon} {selectedClip.type}</span>
                  <div className="flex gap-2">
                    <button className="p-3 bg-white/5 rounded-full"><Download className="w-5 h-5" /></button>
                    <button className="p-3 bg-white/5 rounded-full"><Share2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-[#141414] rounded-2xl overflow-hidden max-w-5xl w-full flex">
                <div className="flex-1 aspect-video bg-black">
                  <iframe src={`https://www.youtube.com/embed/${selectedClip.videoId}?autoplay=1&rel=0`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Clip" />
                </div>
                <div className="w-80 border-l border-gray-800 flex flex-col">
                  <div className="p-4 border-b border-gray-800 flex justify-between items-start">
                    <div>
                      <span className="px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: classificationOptions.find(o => o.id === selectedClip.type)?.color + '30', color: classificationOptions.find(o => o.id === selectedClip.type)?.color }}>{classificationOptions.find(o => o.id === selectedClip.type)?.icon} {selectedClip.type}</span>
                      <h3 className="font-semibold mt-2">{selectedClip.device}</h3>
                      <p className="text-sm text-gray-400">{selectedClip.time}</p>
                    </div>
                    <button onClick={() => setSelectedClip(null)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                  </div>
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-2"><ThumbsUp className="w-4 h-4 text-gray-400" />{selectedClip.likes || 0} likes</span>
                      <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-gray-400" />{selectedClip.commentsCount || 0} comments</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <p className="text-sm text-gray-400">Confidence: <span className="text-green-400 font-semibold">{selectedClip.confidence}%</span></p>
                  </div>
                  <div className="p-4 border-t border-gray-800 flex gap-2">
                    <button className="flex-1 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 flex items-center justify-center gap-2"><Download className="w-4 h-4" />Download</button>
                    <button className="flex-1 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 flex items-center justify-center gap-2"><Share2 className="w-4 h-4" />Share</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsSubView({ isMobile }) {
  const { user, logout, token, API_URL } = useAuth();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, bio })
      });
      if (res.ok) {
        setMessage('Profile updated!');
        setEditing(false);
      } else {
        const data = await res.json();
        setMessage(data.error || 'Failed to update');
      }
    } catch (err) {
      setMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const settingsGroups = [
    { title: 'Account', items: [{ icon: CreditCard, label: 'Subscription', badge: 'Free' }, { icon: HardDrive, label: 'Storage', badge: '0/10GB' }] },
    { title: 'Preferences', items: [{ icon: Bell, label: 'Notifications' }, { icon: Globe, label: 'Language' }] },
    { title: 'Support', items: [{ icon: MessageCircle, label: 'Help Center' }, { icon: Settings, label: 'About' }] },
  ];

  return (
    <div className={`${isMobile ? 'p-3 space-y-4' : 'p-5 space-y-6 max-w-2xl'}`}>
      {/* Edit Profile Section */}
      <div>
        <h4 className={`text-gray-500 uppercase font-semibold mb-2 px-2 ${isMobile ? 'text-xs' : 'text-xs'}`}>Profile</h4>
        <div className="bg-white/5 rounded-2xl overflow-hidden p-4 space-y-4">
          {message && <div className={`p-2 rounded-lg text-sm ${message.includes('Failed') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{message}</div>}
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              disabled={!editing}
              className={`w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50 ${!editing ? 'opacity-60' : ''}`}
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              disabled
              className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white opacity-60"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">Bio</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
              disabled={!editing}
              placeholder="Tell us about yourself..."
              rows={3}
              className={`w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50 resize-none ${!editing ? 'opacity-60' : ''}`}
            />
          </div>
          
          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="flex-1 py-3 bg-white/5 rounded-xl font-medium text-sm text-gray-400 hover:bg-white/10">Cancel</button>
                <button onClick={handleSaveProfile} disabled={saving} className="flex-1 py-3 bg-green-500 rounded-xl font-medium text-sm text-white hover:bg-green-600 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="w-full py-3 bg-green-500/10 text-green-400 rounded-xl font-medium text-sm hover:bg-green-500/20">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {settingsGroups.map(group => (
        <div key={group.title}>
          <h4 className={`text-gray-500 uppercase font-semibold mb-2 px-2 ${isMobile ? 'text-xs' : 'text-xs'}`}>{group.title}</h4>
          <div className="bg-white/5 rounded-2xl overflow-hidden">
            {group.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <button key={item.label} className={`w-full flex items-center gap-3 ${isMobile ? 'px-4 py-3' : 'px-4 py-4'} hover:bg-white/5 ${i > 0 ? 'border-t border-gray-800' : ''}`}>
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span className="flex-1 text-left text-white">{item.label}</span>
                  {item.badge && <span className="text-xs text-green-400">{item.badge}</span>}
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button onClick={logout} className={`w-full ${isMobile ? 'py-3' : 'py-4'} bg-red-500/10 text-red-400 rounded-xl font-medium hover:bg-red-500/20`}>Sign Out</button>
    </div>
  );
}

// Admin View Component
function AdminView({ isMobile }) {
  const { token, API_URL } = useAuth();
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [bulkClassification, setBulkClassification] = useState('UAP');
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  
  // Random locations for bulk upload
  const randomLocations = [
    { city: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
    { city: 'New York, NY', lat: 40.7128, lng: -74.0060 },
    { city: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
    { city: 'Miami, FL', lat: 25.7617, lng: -80.1918 },
    { city: 'Seattle, WA', lat: 47.6062, lng: -122.3321 },
    { city: 'Denver, CO', lat: 39.7392, lng: -104.9903 },
    { city: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740 },
    { city: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { city: 'Paris, France', lat: 48.8566, lng: 2.3522 },
    { city: 'Berlin, Germany', lat: 52.5200, lng: 13.4050 },
    { city: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { city: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
    { city: 'Toronto, Canada', lat: 43.6532, lng: -79.3832 },
    { city: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
    { city: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { city: 'Mumbai, India', lat: 19.0760, lng: 72.8777 },
    { city: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333 },
    { city: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332 },
    { city: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241 },
    { city: 'Auckland, New Zealand', lat: -36.8509, lng: 174.7645 },
  ];
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    thumbnailUrl: '',
    location: '',
    latitude: '',
    longitude: '',
    classification: 'UAP',
    aiConfidence: 85
  });

  const classificationOptions = [
    { id: 'UAP', label: 'UAP', icon: '◆', color: '#a855f7' },
    { id: 'Drone', label: 'Drone', icon: '■', color: '#3b82f6' },
    { id: 'Aircraft', label: 'Aircraft', icon: '▲', color: '#22c55e' },
    { id: 'Bird', label: 'Bird', icon: '●', color: '#eab308' },
    { id: 'Weather', label: 'Weather', icon: '○', color: '#06b6d4' },
  ];

  // Fetch sightings
  useEffect(() => {
    fetchSightings();
  }, []);

  const fetchSightings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/sightings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSightings(data);
      }
    } catch (err) {
      console.error('Failed to fetch sightings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Bulk upload videos
  const handleBulkUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    setBulkProgress({ current: 0, total: files.length });
    setMessage(`Uploading ${files.length} videos...`);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setBulkProgress({ current: i + 1, total: files.length });
      setMessage(`Uploading ${i + 1}/${files.length}: ${file.name}`);
      
      try {
        // Upload video to Supabase
        const fileName = `sighting-${Date.now()}-${i}.${file.name.split('.').pop()}`;
        const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/videos/${fileName}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': file.type,
            'x-upsert': 'true'
          },
          body: file
        });
        
        if (!uploadRes.ok) {
          console.error(`Failed to upload ${file.name}`);
          continue;
        }
        
        const videoUrl = `${SUPABASE_URL}/storage/v1/object/public/videos/${fileName}`;
        
        // Pick random location and time
        const randomLoc = randomLocations[Math.floor(Math.random() * randomLocations.length)];
        const randomHoursAgo = Math.floor(Math.random() * 72); // 0-72 hours ago
        const randomConfidence = 70 + Math.floor(Math.random() * 25); // 70-95%
        
        // Create sighting
        await fetch(`${API_URL}/api/admin/sightings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            videoUrl,
            location: randomLoc.city,
            latitude: randomLoc.lat + (Math.random() - 0.5) * 0.1, // Small random offset
            longitude: randomLoc.lng + (Math.random() - 0.5) * 0.1,
            classification: bulkClassification,
            aiConfidence: randomConfidence
          })
        });
        
      } catch (err) {
        console.error(`Error processing ${file.name}:`, err);
      }
    }
    
    setMessage(`✓ Uploaded ${files.length} videos!`);
    setUploading(false);
    setBulkProgress({ current: 0, total: 0 });
    fetchSightings();
  };

  // Upload video to Supabase
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    setMessage('Uploading video...');
    
    try {
      const fileName = `sighting-${Date.now()}.${file.name.split('.').pop()}`;
      const response = await fetch(`${SUPABASE_URL}/storage/v1/object/videos/${fileName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': file.type,
          'x-upsert': 'true'
        },
        body: file
      });
      
      if (response.ok) {
        const videoUrl = `${SUPABASE_URL}/storage/v1/object/public/videos/${fileName}`;
        setFormData(prev => ({ ...prev, videoUrl }));
        setMessage('Video uploaded!');
      } else {
        setMessage('Failed to upload video');
      }
    } catch (err) {
      setMessage('Upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Create sighting
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!formData.title || !formData.videoUrl || !formData.location || !formData.latitude || !formData.longitude) {
      setMessage('Please fill all required fields');
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/api/admin/sightings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setMessage('Sighting created!');
        setFormData({
          title: '',
          videoUrl: '',
          thumbnailUrl: '',
          location: '',
          latitude: '',
          longitude: '',
          classification: 'UAP',
          aiConfidence: 85
        });
        setShowAddForm(false);
        fetchSightings();
      } else {
        const data = await res.json();
        setMessage(data.error || 'Failed to create sighting');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  // Delete sighting
  const handleDelete = async (id) => {
    if (!confirm('Delete this sighting?')) return;
    
    try {
      const res = await fetch(`${API_URL}/api/admin/sightings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setSightings(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className={`h-full overflow-y-auto ${isMobile ? 'p-4' : 'p-6'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>Admin Panel</h1>
            <p className="text-sm text-gray-400">Manage sightings and videos</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowBulkUpload(!showBulkUpload); setShowAddForm(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${showBulkUpload ? 'bg-purple-500 text-white' : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'}`}
            >
              <Upload className="w-5 h-5" />
              Bulk Upload
            </button>
            <button
              onClick={() => { setShowAddForm(!showAddForm); setShowBulkUpload(false); }}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600"
            >
              <Plus className="w-5 h-5" />
              Add Single
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-xl mb-4 ${message.includes('error') || message.includes('Failed') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            {message}
          </div>
        )}

        {/* Bulk Upload Section */}
        {showBulkUpload && (
          <div className="bg-[#141414] border border-gray-700 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Bulk Upload Videos</h2>
            <p className="text-sm text-gray-400 mb-4">
              Select multiple videos at once. Location and timestamp will be randomly assigned.
            </p>
            
            {/* Classification Selection */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Classification for all videos</label>
              <div className="flex gap-2">
                {classificationOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setBulkClassification(opt.id)}
                    className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${bulkClassification === opt.id ? 'ring-2 ring-white' : ''}`}
                    style={{ backgroundColor: `${opt.color}20`, color: opt.color }}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-xs">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Upload Area */}
            <label className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${uploading ? 'border-green-500 bg-green-500/10' : 'border-gray-700 hover:border-green-500/50'}`}>
              <input 
                type="file" 
                accept="video/*" 
                multiple 
                className="hidden" 
                onChange={handleBulkUpload}
                disabled={uploading}
              />
              {uploading ? (
                <>
                  <Loader className="w-10 h-10 text-green-400 animate-spin mb-2" />
                  <p className="text-sm text-green-400">Uploading {bulkProgress.current}/{bulkProgress.total}</p>
                  <div className="w-full max-w-xs bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all" 
                      style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">Click to select multiple videos</p>
                  <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                </>
              )}
            </label>
          </div>
        )}

        {/* Add Sighting Form */}
        {showAddForm && (
          <div className="bg-[#141414] border border-gray-700 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Add New Sighting</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Video Upload */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Video File *</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-green-500/50">
                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} disabled={uploading} />
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-400">{uploading ? 'Uploading...' : 'Upload Video'}</span>
                  </label>
                  {formData.videoUrl && (
                    <span className="text-xs text-green-400">✓ Uploaded</span>
                  )}
                </div>
                {formData.videoUrl && (
                  <input
                    type="text"
                    value={formData.videoUrl}
                    readOnly
                    className="w-full mt-2 px-3 py-2 bg-white/5 border border-gray-700 rounded-lg text-xs text-gray-400"
                  />
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Unknown object over Los Angeles"
                  className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50"
                />
              </div>

              {/* Location Search */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Search Location *</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Search city or address..."
                      className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!formData.location) return;
                      try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}`);
                        const data = await res.json();
                        if (data && data.length > 0) {
                          setFormData(prev => ({
                            ...prev,
                            location: data[0].display_name.split(',').slice(0, 2).join(','),
                            latitude: data[0].lat,
                            longitude: data[0].lon
                          }));
                          setMessage('Location found!');
                        } else {
                          setMessage('Location not found');
                        }
                      } catch (err) {
                        setMessage('Search failed');
                      }
                    }}
                    className="px-4 py-3 bg-green-500/20 text-green-400 rounded-xl font-medium hover:bg-green-500/30"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
                {(formData.latitude && formData.longitude) && (
                  <p className="text-xs text-green-400 mt-2">
                    📍 {formData.latitude}, {formData.longitude}
                  </p>
                )}
              </div>

              {/* Hidden lat/lng inputs for manual override if needed */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                    placeholder="Auto-filled"
                    className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                    placeholder="Auto-filled"
                    className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50"
                  />
                </div>
              </div>

              {/* Classification & Confidence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Classification *</label>
                  <div className="flex gap-2">
                    {classificationOptions.map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, classification: opt.id }))}
                        className={`flex-1 py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${formData.classification === opt.id ? 'ring-2 ring-green-500' : ''}`}
                        style={{ backgroundColor: `${opt.color}20`, color: opt.color }}
                      >
                        <span className="text-lg">{opt.icon}</span>
                        <span className="text-[10px]">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">AI Confidence: {formData.aiConfidence}%</label>
                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={formData.aiConfidence}
                    onChange={(e) => setFormData(prev => ({ ...prev, aiConfidence: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-white/5 rounded-xl font-medium text-gray-400 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 bg-green-500 rounded-xl font-medium text-white hover:bg-green-600 disabled:opacity-50"
                >
                  Create Sighting
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sightings List */}
        <div className="bg-[#141414] border border-gray-700 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold">Sightings ({sightings.length})</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <Loader className="w-8 h-8 text-green-400 animate-spin mx-auto" />
            </div>
          ) : sightings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No sightings yet. Add your first one!
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {sightings.map(sighting => (
                <div key={sighting.id} className="p-4 flex items-center gap-4 hover:bg-white/5">
                  {/* Thumbnail */}
                  <div className="w-20 h-14 bg-black rounded-lg overflow-hidden flex-shrink-0">
                    {sighting.thumbnail_url ? (
                      <img src={sighting.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{sighting.title || sighting.location}</h3>
                    <p className="text-xs text-gray-500">{sighting.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{ 
                          backgroundColor: `${classificationOptions.find(o => o.id === sighting.classification)?.color}30`,
                          color: classificationOptions.find(o => o.id === sighting.classification)?.color
                        }}
                      >
                        {sighting.classification}
                      </span>
                      <span className="text-[10px] text-green-400">{sighting.ai_confidence}%</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <button
                    onClick={() => handleDelete(sighting.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
