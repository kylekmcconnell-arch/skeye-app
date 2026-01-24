import { useState, useEffect, useRef } from 'react';
import { Camera, TrendingUp, Users, Bell, Search, Play, Eye, Zap, Globe, Radio, Wifi, MapPin, Grid, List, ThumbsUp, MessageCircle, Share2, Download, X, Settings, ChevronLeft, ChevronRight, Volume2, CreditCard, HardDrive, User, LogOut, ChevronDown, ChevronUp, Send, Film, SkipBack, Plus, Filter, Menu, Home, Pause } from 'lucide-react';
import logo from './logo.png';
import cameraImg from './camera.png';
import profileImg from './profile.jpg';

const mockDevices = [
  { id: 1, name: 'Home (Rooftop)', location: 'Lisbon, Portugal', status: 'online', detections: 127, signal: 98, serial: 'SKY-2024-0847-A1' },
  { id: 2, name: 'Home (Barn)', location: 'Lisbon, Portugal', status: 'online', detections: 89, signal: 92, serial: 'SKY-2024-1293-B2' },
  { id: 3, name: 'Lake House (Roof)', location: 'Austin, TX', status: 'offline', detections: 203, signal: 0, serial: 'SKY-2024-0156-C3' },
  { id: 4, name: 'Beach House (Roof)', location: 'San Diego, CA', status: 'online', detections: 56, signal: 87, serial: 'SKY-2024-2048-D4' },
];

const myClips = [
  { id: 1, device: 'Home (Rooftop)', time: 'Today, 9:34 PM', type: 'Unknown', confidence: 87, duration: '0:32', videoId: 'QKHg-vnTFsM' },
  { id: 2, device: 'Home (Rooftop)', time: 'Today, 8:12 PM', type: 'Aircraft', confidence: 94, duration: '0:18', videoId: 'u1hNYs55sqs' },
  { id: 3, device: 'Home (Barn)', time: 'Today, 6:45 PM', type: 'Drone', confidence: 91, duration: '1:24', videoId: '2TumprpOwHY' },
  { id: 4, device: 'Beach House (Roof)', time: 'Yesterday, 11:23 PM', type: 'Unknown', confidence: 76, duration: '0:45', videoId: 'dGOXuuhYoLk' },
  { id: 5, device: 'Home (Rooftop)', time: 'Yesterday, 10:05 PM', type: 'Bird', confidence: 98, duration: '0:08', videoId: 'QKHg-vnTFsM' },
  { id: 6, device: 'Lake House (Roof)', time: '2 days ago', type: 'Unknown', confidence: 82, duration: '0:55', videoId: 'u1hNYs55sqs' },
];

const mockClips = [
  { id: 1, title: 'GIMBAL - Navy F/A-18 Encounter', location: 'East Coast, USA', timestamp: '2 min ago', views: 12400, classification: 'Unknown', confidence: 87, verified: true, likes: 892, comments: [{user: 'SkyWatcher_AZ', text: 'This is incredible footage!', time: '1 hour ago'}, {user: 'TruthSeeker', text: 'Definitely not a drone', time: '30 min ago'}], videoId: 'QKHg-vnTFsM' },
  { id: 2, title: 'GO FAST - High Speed Object', location: 'Atlantic Ocean', timestamp: '15 min ago', views: 8900, classification: 'Unknown', confidence: 91, verified: true, likes: 456, comments: [{user: 'DataAnalyst99', text: 'Speed calculations suggest 400+ mph', time: '2 hours ago'}], videoId: 'u1hNYs55sqs' },
  { id: 3, title: 'FLIR1 Tic Tac - USS Nimitz', location: 'San Diego, CA', timestamp: '1 hour ago', views: 25600, classification: 'Unknown', confidence: 96, verified: true, likes: 1834, comments: [{user: 'NightOwl_TX', text: 'Classic footage', time: '5 hours ago'}], videoId: '2TumprpOwHY' },
  { id: 4, title: 'Jellyfish UAP - Iraq 2018', location: 'Iraq', timestamp: '3 hours ago', views: 21000, classification: 'Unknown', confidence: 72, verified: true, likes: 1567, comments: [], videoId: 'dGOXuuhYoLk' },
  { id: 5, title: 'Chilean Navy UFO Footage', location: 'Chile', timestamp: '5 hours ago', views: 18700, classification: 'Unknown', confidence: 84, verified: true, likes: 1245, comments: [], videoId: 'iEK3YC_BKTI' },
  { id: 6, title: 'Phoenix Lights Formation', location: 'Phoenix, AZ', timestamp: '8 hours ago', views: 34200, classification: 'Unknown', confidence: 79, verified: true, likes: 2341, comments: [], videoId: 'v1Vu9Z8OUvE' },
];

const classifyClips = [
  { id: 1, videoId: 'QKHg-vnTFsM', title: 'Rotating Object - East Coast', location: 'Virginia, USA' },
  { id: 2, videoId: 'u1hNYs55sqs', title: 'High Speed Target - Atlantic', location: 'Atlantic Ocean' },
  { id: 3, videoId: '2TumprpOwHY', title: 'Tic Tac Shape - Pacific', location: 'San Diego, CA' },
  { id: 4, videoId: 'dGOXuuhYoLk', title: 'Unknown Object - Middle East', location: 'Iraq' },
  { id: 5, videoId: 'SpeSpA3e56A', title: 'Night Vision Capture - Nevada', location: 'Nevada, USA' },
  { id: 6, videoId: 'iEK3YC_BKTI', title: 'Navy Thermal Imaging', location: 'Chile' },
];

const classificationOptions = [
  { id: 'Unknown', label: 'Unknown', color: '#a855f7' },
  { id: 'Drone', label: 'Drone', color: '#3b82f6' },
  { id: 'Aircraft', label: 'Aircraft', color: '#22c55e' },
  { id: 'Bird', label: 'Bird', color: '#eab308' },
  { id: 'Weather', label: 'Weather', color: '#06b6d4' },
];

const timeRanges = [
  { id: '1h', label: '1H', hours: 1 },
  { id: '24h', label: '24H', hours: 24 },
  { id: '7d', label: '7D', hours: 24 * 7 },
  { id: '30d', label: '30D', hours: 24 * 30 },
  { id: 'all', label: 'All', hours: Infinity },
];

const communityCategories = [
  { id: 'general', name: 'General', icon: MessageCircle, count: 1234 },
  { id: 'sightings', name: 'Sightings', icon: Eye, count: 567 },
  { id: 'equipment', name: 'Equipment', icon: Camera, count: 345 },
];

const communityPosts = [
  { id: 1, category: 'sightings', title: 'Multiple sightings over Phoenix last night', author: 'SkyWatcher_AZ', avatar: 'S', time: '2h ago', upvotes: 234, comments: 89, pinned: true, content: 'Around 9:30 PM I captured what appears to be a formation of 5 objects moving in perfect sync over the desert.' },
  { id: 2, category: 'sightings', title: 'Need help identifying this object', author: 'NewObserver22', avatar: 'N', time: '4h ago', upvotes: 156, comments: 67, pinned: false, content: 'The object seemed to hover for about 2 minutes before accelerating rapidly.' },
  { id: 3, category: 'general', title: 'Best camera settings for night?', author: 'TechExplorer', avatar: 'T', time: '6h ago', upvotes: 89, comments: 45, pinned: false, content: 'What ISO and exposure settings are you using?' },
  { id: 4, category: 'equipment', title: 'Firmware v2.4.1 released', author: 'SkeyeOfficial', avatar: '✓', time: '1d ago', upvotes: 567, comments: 123, pinned: true, verified: true, content: 'New AI detection improvements available.' },
];

const notifications = [
  { id: 1, type: 'detection', device: 'Home (Rooftop)', message: 'Unknown object detected', time: '2 min ago', videoId: 'QKHg-vnTFsM', read: false },
  { id: 2, type: 'detection', device: 'Beach House', message: 'Drone activity detected', time: '15 min ago', videoId: 'u1hNYs55sqs', read: false },
  { id: 3, type: 'comment', user: 'SkyWatcher_AZ', message: 'replied to your comment', time: '1 hour ago', read: true },
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

const generateSightings = () => {
  const cities = [
    { city: 'Los Angeles', lat: 34.0522, lng: -118.2437 }, { city: 'New York', lat: 40.7128, lng: -74.0060 },
    { city: 'Phoenix', lat: 33.4484, lng: -112.0740 }, { city: 'London', lat: 51.5074, lng: -0.1278 },
    { city: 'Tokyo', lat: 35.6762, lng: 139.6503 }, { city: 'Sydney', lat: -33.8688, lng: 151.2093 },
  ];
  const types = ['Unknown', 'Drone', 'Aircraft', 'Bird', 'Weather'];
  const videoIds = ['QKHg-vnTFsM', 'u1hNYs55sqs', '2TumprpOwHY', 'dGOXuuhYoLk'];
  const sightings = [];
  const now = Date.now();
  for (let i = 0; i < 200; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const hoursAgo = Math.random() * 24 * 30;
    const timestamp = now - hoursAgo * 60 * 60 * 1000;
    sightings.push({ id: i + 1, lat: city.lat + (Math.random() - 0.5) * 0.5, lng: city.lng + (Math.random() - 0.5) * 0.5, type: types[Math.floor(Math.random() * types.length)], intensity: 0.5 + Math.random() * 0.5, city: city.city, timestamp, time: getTimeAgo(timestamp), videoId: videoIds[Math.floor(Math.random() * videoIds.length)] });
  }
  return sightings.sort((a, b) => b.timestamp - a.timestamp);
};

const allSightings = generateSightings();

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState(notifications);
  const [profileSubTab, setProfileSubTab] = useState('devices');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const unreadCount = notificationsList.filter(n => !n.read).length;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tabs = [
    { id: 'map', label: 'Map', icon: Globe },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'classify', label: 'Classify', icon: Eye },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="h-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col">
      {/* Header - Simplified on mobile */}
      <header className={`relative z-50 border-b border-green-500/20 bg-[#0a0a0a]/95 backdrop-blur-xl flex-shrink-0 ${isMobile ? 'px-3 py-2' : 'px-4 py-3'}`}>
        <div className="flex items-center justify-between">
          <img src={logo} alt="SKEYE.AI" className={`${isMobile ? 'h-6' : 'h-8'} w-auto`} />
          {!isMobile && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-gray-400">LIVE</span>
                <span className="text-sm font-mono text-green-400">2,847</span>
                <span className="text-xs text-gray-500">devices</span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-white/5 rounded-lg active:scale-95 transition-transform">
              <Bell className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'} text-gray-400`} />
              {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>}
            </button>
            {!isMobile && (
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
        
        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className={`absolute ${isMobile ? 'left-2 right-2' : 'right-4 w-80'} top-full mt-2 bg-[#141414] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50`}>
            <div className="p-3 border-b border-gray-800"><h3 className="font-semibold text-white">Notifications</h3></div>
            <div className="max-h-80 overflow-y-auto">
              {notificationsList.map((notif) => (
                <div key={notif.id} onClick={() => { setNotificationsList(prev => prev.map(n => n.id === notif.id ? {...n, read: true} : n)); setShowNotifications(false); }} className={`p-3 border-b border-gray-800/50 active:bg-white/10 ${!notif.read ? 'bg-green-500/5' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'detection' ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
                      {notif.type === 'detection' ? <Eye className="w-5 h-5 text-purple-400" /> : <MessageCircle className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{notif.type === 'detection' ? notif.device : notif.user}</p>
                      <p className="text-xs text-gray-400">{notif.message}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={`flex-1 overflow-hidden ${isMobile ? 'pb-20' : ''}`} onClick={() => setShowNotifications(false)}>
        {activeTab === 'map' && <GlobalMapView isMobile={isMobile} />}
        {activeTab === 'trending' && <TrendingView isMobile={isMobile} clips={mockClips} />}
        {activeTab === 'classify' && <ClassifyView isMobile={isMobile} />}
        {activeTab === 'community' && <CommunityView isMobile={isMobile} />}
        {activeTab === 'profile' && <ProfileView isMobile={isMobile} profileSubTab={profileSubTab} setProfileSubTab={setProfileSubTab} devices={mockDevices} clips={myClips} />}
      </main>

      {/* Bottom Navigation - Mobile */}
      {isMobile ? (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-green-500/20 bg-[#0a0a0a] backdrop-blur-xl">
          <div className="flex items-center justify-around py-2" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all active:scale-95 ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-green-400' : 'text-gray-500'}`} />
                  <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-green-400' : 'text-gray-500'}`}>{tab.label}</span>
                  {isActive && <div className="w-1 h-1 bg-green-400 rounded-full mt-1" />}
                </button>
              );
            })}
          </div>
        </nav>
      ) : (
        /* Side Navigation - Desktop */
        <nav className="fixed left-0 top-0 bottom-0 w-16 border-r border-green-500/10 bg-[#0a0a0a]/80 flex flex-col items-center py-20 z-40">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all mb-1 ${isActive ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 text-green-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-r-full" />}
                <Icon className="w-5 h-5" />
                <span className="text-[8px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}
      
      {/* Desktop content margin */}
      <style>{`
        @media (min-width: 768px) {
          main { margin-left: 64px; }
        }
        .leaflet-container {
          background: #1a1a2e !important;
        }
        .leaflet-tile-pane {
          background: #1a1a2e !important;
        }
        .leaflet-tile {
          background: #1a1a2e !important;
        }
        .leaflet-tile-container {
          background: #1a1a2e !important;
        }
      `}</style>
    </div>
  );
}

function GlobalMapView({ isMobile }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [sightings, setSightings] = useState(allSightings);
  const [timeRange, setTimeRange] = useState('24h');
  const [activeFilters, setActiveFilters] = useState(['Unknown', 'Drone', 'Aircraft', 'Bird', 'Weather']);
  const [showFilters, setShowFilters] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const getFiltered = () => {
    const range = timeRanges.find(r => r.id === timeRange);
    let filtered = sightings;
    if (range && range.hours !== Infinity) {
      const cutoff = Date.now() - range.hours * 60 * 60 * 1000;
      filtered = filtered.filter(s => s.timestamp >= cutoff);
    }
    return filtered.filter(s => activeFilters.includes(s.type)).sort((a, b) => b.timestamp - a.timestamp);
  };

  const filteredSightings = getFiltered();

  useEffect(() => {
    const interval = setInterval(() => {
      const cities = [{ city: 'Tokyo', lat: 35.6762, lng: 139.6503 }, { city: 'London', lat: 51.5074, lng: -0.1278 }, { city: 'New York', lat: 40.7128, lng: -74.0060 }];
      const types = ['Unknown', 'Drone', 'Aircraft', 'Bird', 'Weather'];
      const videoIds = ['QKHg-vnTFsM', 'u1hNYs55sqs', '2TumprpOwHY'];
      const city = cities[Math.floor(Math.random() * cities.length)];
      setSightings(prev => [{ id: Date.now(), lat: city.lat + (Math.random() - 0.5) * 0.3, lng: city.lng + (Math.random() - 0.5) * 0.3, type: types[Math.floor(Math.random() * types.length)], intensity: 0.5 + Math.random() * 0.5, city: city.city, timestamp: Date.now(), time: 'Just now', videoId: videoIds[Math.floor(Math.random() * videoIds.length)] }, ...prev].slice(0, 300));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const loadMap = async () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link'); link.id = 'leaflet-css'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; link.rel = 'stylesheet'; document.head.appendChild(link);
      }
      if (!window.L) {
        await new Promise(r => { const s = document.createElement('script'); s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.onload = r; document.head.appendChild(s); });
      }
      mapInstanceRef.current = window.L.map(mapRef.current, { center: [20, 0], zoom: 2, minZoom: 2, maxZoom: 18, zoomControl: false, attributionControl: false, worldCopyJump: true });
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, subdomains: 'abcd' }).addTo(mapInstanceRef.current);
      if (!isMobile) window.L.control.zoom({ position: 'topright' }).addTo(mapInstanceRef.current);
      setMapReady(true);
    };
    loadMap();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    mapInstanceRef.current.eachLayer(layer => { if (layer instanceof window.L.Marker) mapInstanceRef.current.removeLayer(layer); });
    const colors = { Unknown: '#a855f7', Drone: '#3b82f6', Aircraft: '#22c55e', Bird: '#eab308', Weather: '#06b6d4' };
    filteredSightings.slice(0, 50).forEach(item => {
      const color = colors[item.type];
      const icon = window.L.divIcon({ html: `<div style="width:${isMobile ? '14px' : '12px'};height:${isMobile ? '14px' : '12px'};background:${color};border-radius:50%;border:2px solid rgba(0,0,0,0.3);box-shadow:0 0 10px ${color}80;"></div>`, className: '', iconSize: [isMobile ? 14 : 12, isMobile ? 14 : 12], iconAnchor: [isMobile ? 7 : 6, isMobile ? 7 : 6] });
      window.L.marker([item.lat, item.lng], { icon }).addTo(mapInstanceRef.current).on('click', () => setSelectedSighting(item));
    });
  }, [filteredSightings, mapReady, isMobile]);

  const toggleFilter = (id) => setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  return (
    <div className="h-full relative bg-[#1a1a2e]">
      <div ref={mapRef} className="absolute inset-0 bg-[#1a1a2e]" style={{ background: '#1a1a2e' }} />
      
      {/* Time Range - Top */}
      <div className={`absolute ${isMobile ? 'top-2 left-2 right-2' : 'top-4 right-20'} z-[1000]`}>
        <div className={`bg-[#141414]/90 rounded-lg border border-gray-700 p-1 flex ${isMobile ? 'justify-between' : 'gap-1'}`}>
          {timeRanges.map(r => (<button key={r.id} onClick={() => setTimeRange(r.id)} className={`${isMobile ? 'flex-1' : 'px-3'} py-2 text-xs font-medium rounded ${timeRange === r.id ? 'bg-green-500/20 text-green-400' : 'text-gray-400'}`}>{r.label}</button>))}
        </div>
      </div>

      {/* Filter Button - Mobile */}
      {isMobile && (
        <button onClick={() => setShowFilters(!showFilters)} className="absolute bottom-4 left-4 z-[1000] w-12 h-12 bg-[#141414]/90 border border-gray-700 rounded-full flex items-center justify-center active:scale-95">
          <Filter className="w-5 h-5 text-gray-400" />
        </button>
      )}

      {/* Filters Panel */}
      {(showFilters || !isMobile) && (
        <div className={`absolute ${isMobile ? 'bottom-20 left-4' : 'bottom-4 left-4'} bg-[#141414]/90 rounded-lg border border-gray-700 p-3 z-[1000]`}>
          <h4 className="text-xs font-semibold text-gray-400 mb-2">FILTER BY TYPE</h4>
          <div className="space-y-1">
            {classificationOptions.map(opt => (<button key={opt.id} onClick={() => toggleFilter(opt.id)} className={`flex items-center gap-2 w-full px-2 py-2 rounded ${activeFilters.includes(opt.id) ? 'bg-white/5' : 'opacity-40'}`}><div className="w-3 h-3 rounded-full" style={{ backgroundColor: opt.color }} /><span className="text-xs text-gray-300 flex-1 text-left">{opt.label}</span>{activeFilters.includes(opt.id) && <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />}</button>))}
          </div>
        </div>
      )}

      {/* Activity Count */}
      <div className={`absolute ${isMobile ? 'bottom-4 right-4' : 'top-4 left-4'} z-[1000]`}>
        <div className="bg-[#141414]/90 rounded-lg border border-gray-700 px-3 py-2 flex items-center gap-2">
          <Radio className="w-4 h-4 text-green-400 animate-pulse" />
          <span className="text-sm font-medium text-white">{filteredSightings.length}</span>
          <span className="text-xs text-gray-400">sightings</span>
        </div>
      </div>

      {/* Sighting Detail - Bottom Sheet on Mobile */}
      {selectedSighting && (
        <div className={`absolute ${isMobile ? 'inset-x-0 bottom-0' : 'top-20 left-4 w-80'} bg-[#141414] ${isMobile ? 'rounded-t-3xl' : 'rounded-xl'} border border-gray-700 overflow-hidden z-[1000] ${isMobile ? 'max-h-[70vh]' : ''}`}>
          {isMobile && <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3" />}
          <div className="aspect-video bg-black"><iframe src={`https://www.youtube.com/embed/${selectedSighting.videoId}?autoplay=1&rel=0&playsinline=1`} className="w-full h-full" allow="autoplay" allowFullScreen title="Sighting" /></div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-white text-lg">{selectedSighting.city}</h3>
                <p className="text-sm text-gray-400">{selectedSighting.time}</p>
              </div>
              <button onClick={() => setSelectedSighting(null)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="inline-block px-3 py-1.5 rounded-lg text-sm font-bold mb-4" style={{ backgroundColor: `${classificationOptions.find(o => o.id === selectedSighting.type)?.color}33`, color: classificationOptions.find(o => o.id === selectedSighting.type)?.color }}>{selectedSighting.type}</div>
            <div className="grid grid-cols-5 gap-2">
              {classificationOptions.map(opt => (<button key={opt.id} className="py-3 rounded-xl text-xs font-medium active:scale-95 transition-transform" style={{ backgroundColor: `${opt.color}20`, color: opt.color }}>{opt.label}</button>))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrendingView({ isMobile, clips }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedClips, setLikedClips] = useState({});
  const [showComments, setShowComments] = useState(false);
  const containerRef = useRef(null);
  const touchStartY = useRef(0);

  const currentClip = clips[currentIndex];

  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < clips.length - 1) setCurrentIndex(prev => prev + 1);
      else if (diff < 0 && currentIndex > 0) setCurrentIndex(prev => prev - 1);
    }
  };

  const handleLike = () => setLikedClips(prev => ({ ...prev, [currentClip.id]: !prev[currentClip.id] }));

  if (isMobile) {
    return (
      <div ref={containerRef} className="h-full relative bg-black" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {/* Full Screen Video */}
        <div className="absolute inset-0" onClick={() => setIsPlaying(!isPlaying)}>
          <iframe src={`https://www.youtube.com/embed/${currentClip.videoId}?autoplay=1&rel=0&playsinline=1&controls=0`} className="w-full h-full" allow="autoplay" allowFullScreen title={currentClip.title} />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center"><Play className="w-10 h-10 text-white ml-1" /></div>
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* Right Side Actions */}
        <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5">
          <button onClick={handleLike} className="flex flex-col items-center active:scale-90 transition-transform">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${likedClips[currentClip.id] ? 'bg-green-500' : 'bg-white/10'}`}>
              <ThumbsUp className={`w-6 h-6 ${likedClips[currentClip.id] ? 'text-white' : 'text-white'}`} />
            </div>
            <span className="text-xs text-white mt-1">{currentClip.likes + (likedClips[currentClip.id] ? 1 : 0)}</span>
          </button>
          <button onClick={() => setShowComments(true)} className="flex flex-col items-center active:scale-90 transition-transform">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><MessageCircle className="w-6 h-6 text-white" /></div>
            <span className="text-xs text-white mt-1">{currentClip.comments.length}</span>
          </button>
          <button className="flex flex-col items-center active:scale-90 transition-transform">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><Share2 className="w-6 h-6 text-white" /></div>
            <span className="text-xs text-white mt-1">Share</span>
          </button>
        </div>

        {/* Bottom Info */}
        <div className="absolute left-4 right-20 bottom-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 rounded text-xs font-bold bg-purple-500/80 text-white">{currentClip.classification}</span>
            <span className="text-xs text-white/70">{currentClip.confidence}% confidence</span>
          </div>
          <h3 className="font-bold text-white text-lg">{currentClip.title}</h3>
          <p className="text-sm text-white/70 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{currentClip.location}</p>
        </div>

        {/* Progress Dots */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          {clips.map((_, i) => (<div key={i} className={`w-1 ${i === currentIndex ? 'h-4 bg-white' : 'h-1 bg-white/30'} rounded-full transition-all`} />))}
        </div>

        {/* Comments Bottom Sheet */}
        {showComments && (
          <div className="absolute inset-x-0 bottom-0 bg-[#141414] rounded-t-3xl z-50 max-h-[60vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3" />
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="font-semibold text-white">Comments ({currentClip.comments.length})</h3>
              <button onClick={() => setShowComments(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[40vh] space-y-4">
              {currentClip.comments.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-xs font-bold text-green-400 flex-shrink-0">{c.user[0]}</div>
                  <div><p className="text-sm text-white">{c.user} <span className="text-gray-500 text-xs">{c.time}</span></p><p className="text-sm text-gray-300 mt-1">{c.text}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop View
  return (
    <div className="h-full flex">
      <div className="flex-1 p-5 overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-5">Trending Clips</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {clips.map((clip, i) => (
            <div key={clip.id} onClick={() => setCurrentIndex(i)} className="group cursor-pointer rounded-2xl border border-transparent hover:border-green-500/30 bg-white/5 overflow-hidden">
              <div className="relative aspect-video bg-black">
                <img src={`https://img.youtube.com/vi/${clip.videoId}/mqdefault.jpg`} alt={clip.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><Play className="w-5 h-5 text-white ml-0.5" /></div></div>
                <div className="absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold uppercase bg-purple-500 text-white">{clip.classification}</div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white group-hover:text-green-400 line-clamp-1">{clip.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400"><MapPin className="w-3 h-3" />{clip.location}</div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{clip.views.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{clip.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClassifyView({ isMobile }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const currentClip = classifyClips[currentIndex];

  const classifyMap = { left: 'Drone', right: 'Unknown', up: 'Aircraft', down: 'skip' };

  const handleClassify = (classification) => {
    setSwipeDirection(classification);
    if (classification !== 'skip') setHistory(prev => [...prev, { index: currentIndex, classification }]);
    setTimeout(() => { setSwipeDirection(null); setCurrentIndex(prev => (prev + 1) % classifyClips.length); }, 300);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 80) {
      handleClassify(diffX > 0 ? 'Unknown' : 'Drone');
    } else if (Math.abs(diffY) > 80) {
      handleClassify(diffY < 0 ? 'Aircraft' : 'skip');
    }
  };

  const handlePrevious = () => {
    if (history.length === 0) return;
    setHistory(prev => prev.slice(0, -1));
    setCurrentIndex(history[history.length - 1].index);
  };

  if (isMobile) {
    return (
      <div className="h-full flex flex-col bg-black">
        {/* Swipe Instructions */}
        <div className="absolute top-4 left-0 right-0 z-10 flex justify-center">
          <div className="bg-black/60 backdrop-blur rounded-full px-4 py-2 flex items-center gap-4 text-xs">
            <span className="text-blue-400">← Drone</span>
            <span className="text-green-400">↑ Aircraft</span>
            <span className="text-purple-400">Unknown →</span>
          </div>
        </div>

        {/* Video Card */}
        <div className="flex-1 relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className={`absolute inset-4 rounded-3xl overflow-hidden bg-[#141414] transition-all duration-300 ${swipeDirection === 'Drone' ? '-translate-x-full rotate-[-20deg] opacity-0' : swipeDirection === 'Unknown' ? 'translate-x-full rotate-[20deg] opacity-0' : swipeDirection === 'Aircraft' ? '-translate-y-full opacity-0' : swipeDirection === 'skip' ? 'translate-y-full opacity-0' : ''}`}>
            <iframe key={currentClip.videoId} src={`https://www.youtube.com/embed/${currentClip.videoId}?autoplay=1&rel=0&playsinline=1`} className="w-full h-full" allow="autoplay" allowFullScreen title={currentClip.title} />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4">
              <h3 className="font-bold text-white text-lg">{currentClip.title}</h3>
              <p className="text-sm text-gray-300">{currentClip.location}</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-[#0a0a0a]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Clip {currentIndex + 1} of {classifyClips.length}</span>
            <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 rounded-full"><Zap className="w-3 h-3 text-green-400" /><span className="text-xs text-green-400 font-semibold">+50 $SKEYE</span></div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {classificationOptions.map(opt => (<button key={opt.id} onClick={() => handleClassify(opt.id)} className="py-4 rounded-xl text-xs font-bold active:scale-95 transition-transform" style={{ backgroundColor: `${opt.color}20`, color: opt.color }}>{opt.label}</button>))}
          </div>
          <div className="flex items-center justify-between mt-4">
            <button onClick={handlePrevious} disabled={history.length === 0} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${history.length > 0 ? 'text-gray-400' : 'text-gray-600'}`}><SkipBack className="w-4 h-4" />Undo</button>
            <button onClick={() => handleClassify('skip')} className="px-6 py-2 bg-gray-800 rounded-lg text-gray-400">Skip</button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="h-full flex items-center justify-center p-5">
      <div className="w-full max-w-2xl">
        <div className={`bg-[#141414] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl transition-all duration-300 ${swipeDirection ? 'scale-95 opacity-50' : ''}`}>
          <div className="aspect-video bg-black relative">
            <iframe key={currentClip.videoId} src={`https://www.youtube.com/embed/${currentClip.videoId}?autoplay=1&rel=0`} className="w-full h-full" allow="autoplay" allowFullScreen title={currentClip.title} />
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 rounded-lg"><span className="text-xs text-gray-400">Clip {currentIndex + 1} of {classifyClips.length}</span></div>
            <div className="absolute bottom-4 left-4 right-4"><h3 className="text-lg font-semibold text-white">{currentClip.title}</h3><p className="text-sm text-gray-300">{currentClip.location}</p></div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-400">SELECT CLASSIFICATION</h4>
              <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 rounded-full"><Zap className="w-3 h-3 text-green-400" /><span className="text-xs text-green-400 font-semibold">+50 $SKEYE</span></div>
            </div>
            <div className="flex items-center gap-2">
              {classificationOptions.map(opt => (<button key={opt.id} onClick={() => handleClassify(opt.id)} className="flex-1 py-3 rounded-xl text-sm font-semibold hover:scale-105 active:scale-95 transition-transform" style={{ backgroundColor: `${opt.color}20`, color: opt.color }}>{opt.label}</button>))}
              <button onClick={() => handleClassify('skip')} className="px-6 py-3 rounded-xl text-sm font-semibold bg-gray-800 text-gray-400 hover:bg-gray-700">Skip</button>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
              <button onClick={handlePrevious} disabled={history.length === 0} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${history.length > 0 ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 cursor-not-allowed'}`}><SkipBack className="w-4 h-4" />Previous</button>
              <span className="text-sm text-gray-500">Classified: <span className="text-green-400 font-bold">{history.length}</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunityView({ isMobile }) {
  const [activeCategory, setActiveCategory] = useState('general');
  const [posts, setPosts] = useState(communityPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [votedPosts, setVotedPosts] = useState({});

  const handleVote = (postId) => setVotedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  const filteredPosts = activeCategory === 'general' ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <div className="h-full flex flex-col">
      {/* Category Tabs */}
      <div className={`flex-shrink-0 border-b border-gray-800 ${isMobile ? 'px-2' : 'px-4'}`}>
        <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
          {communityCategories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat.id ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'}`}>{cat.name}</button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className={`${isMobile ? 'p-3 space-y-3' : 'p-5 space-y-4 max-w-2xl mx-auto'}`}>
          {filteredPosts.map(post => (
            <div key={post.id} onClick={() => setSelectedPost(post)} className={`${isMobile ? 'p-3' : 'p-4'} bg-white/5 rounded-2xl active:bg-white/10`}>
              <div className="flex items-start gap-3">
                <button onClick={e => { e.stopPropagation(); handleVote(post.id); }} className={`flex flex-col items-center ${isMobile ? 'min-w-[40px]' : ''}`}>
                  <ChevronUp className={`w-6 h-6 ${votedPosts[post.id] ? 'text-green-400' : 'text-gray-500'}`} />
                  <span className={`text-sm font-semibold ${votedPosts[post.id] ? 'text-green-400' : 'text-white'}`}>{post.upvotes + (votedPosts[post.id] ? 1 : 0)}</span>
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.pinned && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold rounded">PINNED</span>}
                    {post.verified && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded">OFFICIAL</span>}
                  </div>
                  <h3 className={`font-semibold text-white mt-1 ${isMobile ? 'text-sm' : ''}`}>{post.title}</h3>
                  <p className={`text-gray-400 mt-1 line-clamp-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>{post.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{post.author}</span>
                    <span>{post.time}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB for New Post */}
      <button className={`fixed ${isMobile ? 'bottom-24 right-4' : 'bottom-8 right-8'} w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center active:scale-95 z-40`}>
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Post Detail - Bottom Sheet on Mobile */}
      {selectedPost && (
        <div className={`fixed inset-0 z-50 ${isMobile ? '' : 'flex items-center justify-center bg-black/80'}`} onClick={() => setSelectedPost(null)}>
          <div className={`${isMobile ? 'absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl' : 'w-full max-w-2xl rounded-2xl'} bg-[#141414] overflow-hidden`} onClick={e => e.stopPropagation()}>
            {isMobile && <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3" />}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${selectedPost.verified ? 'bg-green-500 text-white' : 'bg-green-500/20 text-green-400'}`}>{selectedPost.avatar}</div>
                <div><p className="font-semibold text-white">{selectedPost.author}</p><p className="text-xs text-gray-400">{selectedPost.time}</p></div>
              </div>
              <button onClick={() => setSelectedPost(null)} className="p-2"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <h2 className="text-xl font-bold text-white">{selectedPost.title}</h2>
              <p className="text-gray-300 mt-4">{selectedPost.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileView({ isMobile, profileSubTab, setProfileSubTab, devices, clips }) {
  const subTabs = [
    { id: 'devices', label: 'My Devices', icon: Camera },
    { id: 'clips', label: 'My Clips', icon: Film },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Profile Header */}
      <div className={`flex-shrink-0 ${isMobile ? 'p-4' : 'p-6'} bg-gradient-to-b from-green-500/10 to-transparent`}>
        <div className="flex items-center gap-4">
          <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} rounded-full overflow-hidden border-2 border-green-500/50`}>
            <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h2 className={`font-bold text-white ${isMobile ? 'text-lg' : 'text-xl'}`}>John Doe</h2>
            <p className="text-sm text-gray-400">john@example.com</p>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="text-center"><p className={`font-bold text-green-400 ${isMobile ? 'text-lg' : 'text-xl'}`}>12,450</p><p className="text-[10px] text-gray-500">$SKEYE</p></div>
          <div className="text-center"><p className={`font-bold text-white ${isMobile ? 'text-lg' : 'text-xl'}`}>156</p><p className="text-[10px] text-gray-500">Classifications</p></div>
          <div className="text-center"><p className={`font-bold text-white ${isMobile ? 'text-lg' : 'text-xl'}`}>#47</p><p className="text-[10px] text-gray-500">Rank</p></div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex-shrink-0 border-b border-gray-800 px-2">
        <div className="flex">
          {subTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setProfileSubTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 transition-colors ${profileSubTab === tab.id ? 'border-green-400 text-green-400' : 'border-transparent text-gray-500'}`}>
                <Icon className="w-4 h-4" />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {profileSubTab === 'devices' && <DevicesSubView isMobile={isMobile} devices={devices} />}
        {profileSubTab === 'clips' && <ClipsSubView isMobile={isMobile} clips={clips} />}
        {profileSubTab === 'settings' && <SettingsSubView isMobile={isMobile} />}
      </div>
    </div>
  );
}

function DevicesSubView({ isMobile, devices }) {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  return (
    <div className={`${isMobile ? 'p-3 space-y-3' : 'p-5 space-y-4'}`}>
      {/* Add Device Button */}
      <button className={`w-full ${isMobile ? 'py-3' : 'py-4'} border-2 border-dashed border-gray-700 rounded-2xl text-gray-400 flex items-center justify-center gap-2 active:bg-white/5`}>
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add New Device</span>
      </button>

      {/* Device Cards */}
      {devices.map(device => (
        <div key={device.id} className={`${isMobile ? 'p-3' : 'p-4'} rounded-2xl border ${device.status === 'online' ? 'bg-green-500/5 border-green-500/20' : 'bg-gray-800/30 border-gray-700/50'}`}>
          <div className="flex items-start gap-3">
            <div className={`${isMobile ? 'w-14 h-14' : 'w-16 h-16'} flex items-center justify-center`}>
              <img src={cameraImg} alt="Camera" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold text-white truncate ${isMobile ? 'text-sm' : ''}`}>{device.name}</h3>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${device.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${device.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`} />
                  {device.status === 'online' ? 'Live' : 'Offline'}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{device.location}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-500 flex items-center gap-1"><Wifi className="w-3 h-3" />{device.signal}%</span>
                <span className="text-xs text-gray-500 flex items-center gap-1"><Eye className="w-3 h-3" />{device.detections}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => { setSelectedDevice(device); setActiveModal('feed'); }} disabled={device.status !== 'online'} className={`flex-1 py-2 rounded-lg text-xs font-medium ${device.status === 'online' ? 'bg-green-500/10 text-green-400 active:bg-green-500/20' : 'bg-gray-800 text-gray-500'}`}>View Feed</button>
            <button onClick={() => { setSelectedDevice(device); setActiveModal('settings'); }} className="flex-1 py-2 rounded-lg text-xs font-medium bg-white/5 text-gray-400 active:bg-white/10">Settings</button>
          </div>
        </div>
      ))}

      {/* Feed Modal */}
      {activeModal === 'feed' && selectedDevice && (
        <div className="fixed inset-0 z-50 bg-black" onClick={() => setActiveModal(null)}>
          <div className="h-full flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 bg-[#141414]">
              <div>
                <h3 className="font-semibold text-white">{selectedDevice.name}</h3>
                <p className="text-xs text-gray-400">{selectedDevice.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-full"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /><span className="text-xs text-red-400">REC</span></div>
                <button onClick={() => setActiveModal(null)} className="p-2"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
            </div>
            <div className="flex-1 bg-black flex items-center justify-center">
              <Camera className="w-16 h-16 text-gray-700" />
            </div>
            <div className="p-4 bg-[#141414]">
              <p className="text-xs text-gray-400 text-center mb-3">PTZ Controls</p>
              <div className="flex items-center justify-center gap-4">
                <button className="p-4 bg-white/5 rounded-full active:bg-white/10"><ChevronLeft className="w-6 h-6" /></button>
                <div className="flex flex-col gap-2">
                  <button className="p-4 bg-white/5 rounded-full active:bg-white/10"><ChevronUp className="w-6 h-6" /></button>
                  <button className="p-4 bg-white/5 rounded-full active:bg-white/10"><ChevronDown className="w-6 h-6" /></button>
                </div>
                <button className="p-4 bg-white/5 rounded-full active:bg-white/10"><ChevronRight className="w-6 h-6" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' && selectedDevice && (
        <div className="fixed inset-0 z-50 bg-black/80" onClick={() => setActiveModal(null)}>
          <div className={`${isMobile ? 'absolute inset-x-0 bottom-0 max-h-[90vh] rounded-t-3xl' : 'absolute inset-4 max-w-lg mx-auto rounded-2xl'} bg-[#141414] overflow-hidden flex flex-col`} onClick={e => e.stopPropagation()}>
            {isMobile && <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3" />}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="font-semibold text-white">Device Settings</h3>
              <button onClick={() => setActiveModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div><label className="block text-xs text-gray-400 mb-2">Device Name</label><input type="text" defaultValue={selectedDevice.name} className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white" /></div>
              <div><label className="block text-xs text-gray-400 mb-2">Location</label><div className="px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-gray-400">{selectedDevice.location}</div></div>
              <div className="border-t border-gray-800 pt-4">
                <h4 className="text-sm font-semibold text-white mb-3">WiFi Settings</h4>
                <div className="space-y-3">
                  <input type="text" defaultValue="Home_Network_5G" placeholder="WiFi Network" className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white" />
                  <input type="password" defaultValue="password" placeholder="WiFi Password" className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white" />
                </div>
              </div>
              <div className="border-t border-gray-800 pt-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl"><span className="text-sm text-white">Motion Detection</span><div className="w-12 h-6 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div></div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl"><span className="text-sm text-white">Starlight Vision</span><div className="w-12 h-6 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div></div>
              </div>
              <button className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl font-medium">Delete Device</button>
            </div>
            <div className="p-4 border-t border-gray-800">
              <button className="w-full py-3 bg-green-500 text-white rounded-xl font-medium">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClipsSubView({ isMobile, clips }) {
  const [selectedClip, setSelectedClip] = useState(null);

  return (
    <div className={`${isMobile ? 'p-3' : 'p-5'}`}>
      <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-3 gap-4'}`}>
        {clips.map(clip => (
          <div key={clip.id} onClick={() => setSelectedClip(clip)} className="rounded-xl overflow-hidden bg-white/5 active:bg-white/10">
            <div className="aspect-video bg-black relative">
              <img src={`https://img.youtube.com/vi/${clip.videoId}/mqdefault.jpg`} alt="Clip" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center"><Play className="w-8 h-8 text-white/80" /></div>
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ backgroundColor: `${classificationOptions.find(o => o.id === clip.type)?.color}cc`, color: 'white' }}>{clip.type}</div>
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-[10px] text-white">{clip.duration}</div>
            </div>
            <div className="p-2">
              <p className={`text-white truncate ${isMobile ? 'text-xs' : 'text-sm'}`}>{clip.device}</p>
              <p className="text-[10px] text-gray-500">{clip.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Clip Modal */}
      {selectedClip && (
        <div className="fixed inset-0 z-50 bg-black" onClick={() => setSelectedClip(null)}>
          <div className="h-full flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4">
              <div><h3 className="font-semibold text-white">{selectedClip.device}</h3><p className="text-xs text-gray-400">{selectedClip.time}</p></div>
              <button onClick={() => setSelectedClip(null)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <div className="flex-1 bg-black">
              <iframe src={`https://www.youtube.com/embed/${selectedClip.videoId}?autoplay=1&rel=0&playsinline=1`} className="w-full h-full" allow="autoplay" allowFullScreen title="Clip" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ backgroundColor: `${classificationOptions.find(o => o.id === selectedClip.type)?.color}33`, color: classificationOptions.find(o => o.id === selectedClip.type)?.color }}>{selectedClip.type}</span>
              <div className="flex gap-2">
                <button className="p-3 bg-white/5 rounded-full"><Download className="w-5 h-5 text-gray-400" /></button>
                <button className="p-3 bg-white/5 rounded-full"><Share2 className="w-5 h-5 text-gray-400" /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsSubView({ isMobile }) {
  const settingsGroups = [
    { title: 'Account', items: [{ icon: User, label: 'Edit Profile' }, { icon: CreditCard, label: 'Subscription', badge: 'Pro' }, { icon: HardDrive, label: 'Storage', badge: '45/100GB' }] },
    { title: 'Preferences', items: [{ icon: Bell, label: 'Notifications' }, { icon: Globe, label: 'Language' }] },
    { title: 'Support', items: [{ icon: MessageCircle, label: 'Help Center' }, { icon: Settings, label: 'About' }] },
  ];

  return (
    <div className={`${isMobile ? 'p-3 space-y-4' : 'p-5 space-y-6 max-w-lg'}`}>
      {settingsGroups.map(group => (
        <div key={group.title}>
          <h4 className="text-xs text-gray-500 uppercase font-semibold mb-2 px-2">{group.title}</h4>
          <div className="bg-white/5 rounded-2xl overflow-hidden">
            {group.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-3 active:bg-white/5 ${i > 0 ? 'border-t border-gray-800' : ''}`}>
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
      <button className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl font-medium mt-4">Sign Out</button>
    </div>
  );
}
