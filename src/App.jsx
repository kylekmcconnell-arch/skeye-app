import { useState, useEffect, useRef } from 'react';
import { Camera, TrendingUp, Users, Bell, Play, Eye, Zap, Globe, Radio, Wifi, MapPin, ThumbsUp, MessageCircle, Share2, Download, X, Settings, ChevronLeft, ChevronRight, Volume2, CreditCard, HardDrive, User, LogOut, ChevronDown, ChevronUp, Send, Film, SkipBack, Plus, Filter, List, Grid } from 'lucide-react';
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
  { id: 1, device: 'Home (Rooftop)', time: 'Today, 9:34 PM', type: 'UAP', confidence: 87, duration: '0:32', videoId: 'QKHg-vnTFsM', likes: 24, commentsCount: 8 },
  { id: 2, device: 'Home (Rooftop)', time: 'Today, 8:12 PM', type: 'Aircraft', confidence: 94, duration: '0:18', videoId: 'u1hNYs55sqs', likes: 12, commentsCount: 3 },
  { id: 3, device: 'Home (Barn)', time: 'Today, 6:45 PM', type: 'Drone', confidence: 91, duration: '1:24', videoId: '2TumprpOwHY', likes: 45, commentsCount: 15 },
  { id: 4, device: 'Beach House (Roof)', time: 'Yesterday, 11:23 PM', type: 'UAP', confidence: 76, duration: '0:45', videoId: 'dGOXuuhYoLk', likes: 67, commentsCount: 22 },
];

const mockClips = [
  { id: 1, title: 'GIMBAL - Navy F/A-18 Encounter', location: 'East Coast, USA', timestamp: '2 min ago', views: 12400, classification: 'UAP', confidence: 87, verified: true, siteLikes: 234, siteComments: [{user: 'SkyWatcher_AZ', text: 'Incredible footage! The rotation is unmistakable.', time: '1h ago', avatar: 'S'}, {user: 'DataAnalyst99', text: 'I ran this through my tracking software - no conventional aircraft moves like this.', time: '45m ago', avatar: 'D'}], videoId: 'QKHg-vnTFsM' },
  { id: 2, title: 'GO FAST - High Speed Object', location: 'Atlantic Ocean', timestamp: '15 min ago', views: 8900, classification: 'UAP', confidence: 91, verified: true, siteLikes: 156, siteComments: [{user: 'PilotMike', text: 'As a commercial pilot, I can confirm this is not normal.', time: '2h ago', avatar: 'P'}], videoId: 'u1hNYs55sqs' },
  { id: 3, title: 'FLIR1 Tic Tac - USS Nimitz', location: 'San Diego, CA', timestamp: '1 hour ago', views: 25600, classification: 'UAP', confidence: 96, verified: true, siteLikes: 445, siteComments: [{user: 'NavyVet2020', text: 'I was stationed on the Nimitz. This is real.', time: '3h ago', avatar: 'N'}, {user: 'SkepticalSam', text: 'Could this be a weather balloon?', time: '2h ago', avatar: 'S'}, {user: 'TruthSeeker', text: '@SkepticalSam No way, look at the movement patterns', time: '1h ago', avatar: 'T'}], videoId: '2TumprpOwHY' },
  { id: 4, title: 'Jellyfish UAP - Iraq 2018', location: 'Iraq', timestamp: '3 hours ago', views: 21000, classification: 'UAP', confidence: 72, verified: true, siteLikes: 312, siteComments: [], videoId: 'dGOXuuhYoLk' },
  { id: 5, title: 'Chilean Navy UFO', location: 'Chile', timestamp: '5 hours ago', views: 18700, classification: 'UAP', confidence: 84, verified: true, siteLikes: 189, siteComments: [{user: 'ChileanObserver', text: 'Finally getting international attention!', time: '4h ago', avatar: 'C'}], videoId: 'iEK3YC_BKTI' },
];

const classifyClips = [
  { id: 1, videoId: 'QKHg-vnTFsM', title: 'Rotating Object - East Coast', location: 'Virginia, USA' },
  { id: 2, videoId: 'u1hNYs55sqs', title: 'High Speed Target - Atlantic', location: 'Atlantic Ocean' },
  { id: 3, videoId: '2TumprpOwHY', title: 'Tic Tac Shape - Pacific', location: 'San Diego, CA' },
  { id: 4, videoId: 'dGOXuuhYoLk', title: 'Unknown Object - Middle East', location: 'Iraq' },
  { id: 5, videoId: 'iEK3YC_BKTI', title: 'Navy Thermal Imaging', location: 'Chile' },
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
  { id: 1, type: 'detection', device: 'Home (Rooftop)', message: 'Unknown object detected', time: '2 min ago', read: false },
  { id: 2, type: 'detection', device: 'Beach House', message: 'Drone detected', time: '15 min ago', read: false },
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
  const types = ['UAP', 'Drone', 'Aircraft', 'Bird', 'Weather'];
  const videoIds = ['QKHg-vnTFsM', 'u1hNYs55sqs', '2TumprpOwHY', 'dGOXuuhYoLk'];
  const sightings = [];
  const now = Date.now();
  for (let i = 0; i < 100; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const hoursAgo = Math.random() * 24 * 7;
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const liveDevices = mockDevices.filter(d => d.status === 'online').length;

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

  const tabs = [
    { id: 'map', label: 'Map', icon: Globe },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'classify', label: 'Classify', icon: Eye },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const utcTime = currentTime.toISOString().slice(11, 19) + ' UTC';

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="relative z-50 border-b border-green-500/20 bg-[#0a0a0a] flex-shrink-0">
        <div className={`flex items-center justify-between ${isMobile ? 'px-3 py-2' : 'px-4 py-3 ml-16'}`}>
          <div className="flex items-center gap-4">
            <img src={logo} alt="SKEYE.AI" className={`${isMobile ? 'h-6' : 'h-7'} w-auto`} />
            {/* UTC Time & Live Devices */}
            <div className={`flex items-center gap-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <span className="text-gray-400 font-mono">{utcTime}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-medium">{liveDevices} devices live</span>
              </div>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }} className="relative p-2 hover:bg-white/5 rounded-lg">
            <Bell className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-gray-400`} />
            {unreadCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>}
          </button>
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className={`absolute ${isMobile ? 'left-2 right-2' : 'right-4 w-80'} top-full mt-2 bg-[#141414] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-[100]`} onClick={e => e.stopPropagation()}>
            <div className="p-3 border-b border-gray-800 flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-white/10 rounded"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notificationsList.map((n) => (
                <div key={n.id} className={`p-3 border-b border-gray-800/50 hover:bg-white/5 cursor-pointer ${!n.read ? 'bg-green-500/5' : ''}`}>
                  <p className="text-sm text-white font-medium">{n.device}</p>
                  <p className="text-sm text-gray-400">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={`flex-1 overflow-hidden relative ${!isMobile ? 'ml-16' : ''}`} onClick={() => setShowNotifications(false)}>
        {activeTab === 'map' && <GlobalMapView isMobile={isMobile} />}
        {activeTab === 'trending' && <TrendingView isMobile={isMobile} clips={mockClips} />}
        {activeTab === 'classify' && <ClassifyView isMobile={isMobile} />}
        {activeTab === 'community' && <CommunityView isMobile={isMobile} />}
        {activeTab === 'profile' && <ProfileView isMobile={isMobile} profileSubTab={profileSubTab} setProfileSubTab={setProfileSubTab} devices={mockDevices} clips={myClips} />}
      </main>

      {/* Side Navigation - Desktop */}
      {!isMobile && (
        <nav className="fixed left-0 top-0 bottom-0 w-16 border-r border-green-500/10 bg-[#0a0a0a] flex flex-col items-center pt-4 z-40">
          <div className="mb-8" />
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
    </div>
  );
}

function GlobalMapView({ isMobile }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [sightings] = useState(allSightings);
  const [timeRange, setTimeRange] = useState('24h');
  const [showSightingsList, setShowSightingsList] = useState(!isMobile);
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [typeFilters, setTypeFilters] = useState({ UAP: true, Drone: true, Aircraft: true, Bird: true, Weather: true });
  const [mapReady, setMapReady] = useState(false);

  const toggleTypeFilter = (type) => setTypeFilters(prev => ({ ...prev, [type]: !prev[type] }));

  const getFiltered = () => {
    const range = timeRanges.find(r => r.id === timeRange);
    let filtered = sightings.filter(s => typeFilters[s.type]);
    if (range && range.hours !== Infinity) {
      const cutoff = Date.now() - range.hours * 60 * 60 * 1000;
      filtered = filtered.filter(s => s.timestamp >= cutoff);
    }
    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  };

  const filteredSightings = getFiltered();

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
    mapInstanceRef.current.eachLayer(layer => { if (layer instanceof window.L.CircleMarker) mapInstanceRef.current.removeLayer(layer); });
    filteredSightings.slice(0, 30).forEach(item => {
      const color = classificationOptions.find(o => o.id === item.type)?.color || '#a855f7';
      window.L.circleMarker([item.lat, item.lng], { radius: 8, fillColor: color, fillOpacity: 0.8, color: color, weight: 2, opacity: 1 }).addTo(mapInstanceRef.current).on('click', () => setSelectedSighting(item));
    });
  }, [filteredSightings, mapReady]);

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
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: opt.color }} />
                      <span className="flex-1 text-left text-sm">{opt.label}</span>
                      {typeFilters[opt.id] && <span className="text-green-400 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Live Sightings Only */}
        <div className="w-72 bg-[#0a0a0a] border-l border-gray-800 flex flex-col">
          {/* Live Sightings Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Radio className="w-4 h-4 text-green-400 animate-pulse" />Live Sightings</h3>
            <span className="text-xs text-gray-400">{filteredSightings.length} total</span>
          </div>

          {/* Sightings List */}
          <div className="flex-1 overflow-y-auto">
            {filteredSightings.slice(0, 30).map(s => (
              <div key={s.id} onClick={() => setSelectedSighting(s)} className={`flex items-center gap-3 p-3 border-b border-gray-800/50 cursor-pointer hover:bg-white/5 ${selectedSighting?.id === s.id ? 'bg-green-500/10' : ''}`}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: classificationOptions.find(o => o.id === s.type)?.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{s.city}</p>
                  <p className="text-xs text-gray-500">{s.type} • {s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sighting Detail Modal */}
        {selectedSighting && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8" onClick={() => setSelectedSighting(null)}>
            <div className="bg-[#141414] rounded-2xl w-full max-w-4xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="aspect-video bg-black">
                <iframe key={selectedSighting.id} src={`https://www.youtube.com/embed/${selectedSighting.videoId}?autoplay=1&mute=0&rel=0`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Sighting" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-xl">{selectedSighting.city}</h3>
                    <p className="text-gray-400">{selectedSighting.time}</p>
                  </div>
                  <button onClick={() => setSelectedSighting(null)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-6 h-6 text-gray-400" /></button>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold mb-4" style={{ backgroundColor: `${classificationOptions.find(o => o.id === selectedSighting.type)?.color}33`, color: classificationOptions.find(o => o.id === selectedSighting.type)?.color }}>
                  <span>{classificationOptions.find(o => o.id === selectedSighting.type)?.icon}</span>
                  <span>{selectedSighting.type}</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">Classify this sighting:</p>
                <div className="flex gap-2">
                  {classificationOptions.map(opt => (<button key={opt.id} className="flex-1 py-3 rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2" style={{ backgroundColor: `${opt.color}20`, color: opt.color }}><span>{opt.icon}</span><span>{opt.label}</span></button>))}
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`.leaflet-container { background: #262626 !important; }`}</style>
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
              <div key={s.id} onClick={() => { setSelectedSighting(s); setShowSightingsList(false); }} className="flex items-center gap-3 p-3 border-b border-gray-800/50 active:bg-white/5">
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
        <div className="absolute inset-x-0 bottom-0 z-[1001] bg-[#141414] rounded-t-3xl max-h-[80vh] flex flex-col">
          <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3" />
          <div className="aspect-video bg-black">
            <iframe key={selectedSighting.id} src={`https://www.youtube.com/embed/${selectedSighting.videoId}?autoplay=1&mute=0&playsinline=1&rel=0`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Sighting" />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{selectedSighting.city}</h3>
                <p className="text-sm text-gray-400">{selectedSighting.time}</p>
              </div>
              <button onClick={() => setSelectedSighting(null)} className="p-2"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold mb-4" style={{ backgroundColor: `${classificationOptions.find(o => o.id === selectedSighting.type)?.color}33`, color: classificationOptions.find(o => o.id === selectedSighting.type)?.color }}>
              <span>{classificationOptions.find(o => o.id === selectedSighting.type)?.icon}</span>
              <span>{selectedSighting.type}</span>
            </div>
            <p className="text-xs text-gray-400 mb-2">Classify this sighting:</p>
            <div className="grid grid-cols-5 gap-2">
              {classificationOptions.map(opt => (<button key={opt.id} className="py-3 rounded-xl text-sm font-bold active:scale-95 flex flex-col items-center gap-1" style={{ backgroundColor: `${opt.color}20`, color: opt.color }}><span>{opt.icon}</span></button>))}
            </div>
          </div>
        </div>
      )}

      <style>{`.leaflet-container { background: #262626 !important; }`}</style>
    </div>
  );
}

function VideoFeedView({ clips, showReward = false, title = "Trending", isMobile = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedClips, setLikedClips] = useState({});
  const [classified, setClassified] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const currentClip = clips[currentIndex];

  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); setShowComments(false); };
  const handleNext = () => { if (currentIndex < clips.length - 1) setCurrentIndex(currentIndex + 1); else setCurrentIndex(0); setShowComments(false); };
  const handleLike = () => setLikedClips(prev => ({ ...prev, [currentClip.id]: !prev[currentClip.id] }));
  const handleClassify = (type) => { 
    setClassified(prev => prev + 1);
    setTimeout(() => handleNext(), 300);
  };

  const siteLikes = (currentClip.siteLikes || 0) + (likedClips[currentClip.id] ? 1 : 0);
  const siteComments = currentClip.siteComments || [];

  // Desktop Layout
  if (!isMobile) {
    return (
      <div className="h-full flex">
        {/* Main Video Area */}
        <div className="flex-1 relative bg-black">
          <iframe 
            key={currentClip.id} 
            src={`https://www.youtube.com/embed/${currentClip.videoId}?autoplay=1&mute=0&rel=0&modestbranding=1`} 
            className="absolute inset-0 w-full h-full" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen 
            title={currentClip.title} 
          />
          
          {/* Nav Arrows */}
          <button onClick={handlePrev} disabled={currentIndex === 0} className={`absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center z-10 transition-all ${currentIndex === 0 ? 'opacity-30' : ''}`}>
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center z-10">
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-[#0a0a0a] border-l border-gray-800 flex flex-col overflow-hidden">
          {/* Progress */}
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

          {/* Clip Info */}
          <div className="flex-shrink-0 p-4 border-b border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded text-xs font-bold flex items-center gap-1" style={{ backgroundColor: classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.color + '30', color: classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.color }}>
                {classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.icon} {currentClip.classification || currentClip.type || 'UAP'}
              </span>
              {currentClip.confidence && <span className="text-xs text-gray-400">{currentClip.confidence}%</span>}
            </div>
            <h3 className="font-semibold text-lg">{currentClip.title}</h3>
            <p className="text-sm text-gray-400 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" />{currentClip.location}</p>
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
                    onClick={() => handleClassify(opt.id)} 
                    className="w-full py-3 rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2" 
                    style={{ backgroundColor: `${opt.color}20`, color: opt.color }}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleNext} className="w-full mt-3 py-3 rounded-xl text-gray-400 bg-white/5 hover:bg-white/10">
                Skip
              </button>
              {classified > 0 && (
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
    <div 
      className="h-full relative bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full Screen Video */}
      <div 
        className="absolute inset-0 transition-transform duration-200"
        style={{ transform: `translateX(${swipeOffset * 0.3}px)` }}
      >
        <iframe 
          key={currentClip.id} 
          src={`https://www.youtube.com/embed/${currentClip.videoId}?autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1`} 
          className="absolute inset-0 w-full h-full" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen 
          title={currentClip.title} 
        />
      </div>

      {/* Swipe Indicators */}
      {swipeOffset > 40 && currentIndex > 0 && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur rounded-full p-3">
          <ChevronLeft className="w-8 h-8" />
        </div>
      )}
      {swipeOffset < -40 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur rounded-full p-3">
          <ChevronRight className="w-8 h-8" />
        </div>
      )}
      
      {/* Top Bar - Progress & Info */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-3 pb-12">
        <div className="flex gap-1 mb-3">
          {clips.map((_, i) => (<div key={i} className={`flex-1 h-1 rounded-full transition-all ${i === currentIndex ? 'bg-white' : i < currentIndex ? 'bg-white/50' : 'bg-white/20'}`} />))}
        </div>
        <div className="flex items-center justify-between">
          <div className="bg-black/40 backdrop-blur px-3 py-1.5 rounded-full text-xs">{currentIndex + 1} / {clips.length}</div>
          {showReward && (<div className="flex items-center gap-1 bg-green-500/20 backdrop-blur px-3 py-1.5 rounded-full"><Zap className="w-3 h-3 text-green-400" /><span className="text-xs text-green-400 font-semibold">+50 $SKEYE</span></div>)}
          {!showReward && classified > 0 && (<div className="bg-black/40 backdrop-blur px-3 py-1.5 rounded-full text-xs">Classified: <span className="text-green-400 font-bold">{classified}</span></div>)}
        </div>
        {/* Swipe hint */}
        <p className="text-center text-[10px] text-gray-400 mt-2">← Swipe to navigate →</p>
      </div>

      {/* Nav Arrows */}
      <button onClick={handlePrev} disabled={currentIndex === 0} className={`absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center z-10 transition-opacity ${currentIndex === 0 ? 'opacity-30' : 'active:scale-95'}`}><ChevronLeft className="w-6 h-6" /></button>
      <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center z-10 active:scale-95"><ChevronRight className="w-6 h-6" /></button>

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-44 flex flex-col items-center gap-4 z-10">
        <button onClick={handleLike} className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur transition-colors ${likedClips[currentClip.id] ? 'bg-green-500' : 'bg-black/40'}`}><ThumbsUp className="w-5 h-5" /></div>
          <span className="text-xs mt-1 drop-shadow">{siteLikes}</span>
        </button>
        <button onClick={() => setShowComments(true)} className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"><MessageCircle className="w-5 h-5" /></div>
          <span className="text-xs mt-1 drop-shadow">{siteComments.length}</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"><Share2 className="w-5 h-5" /></div>
        </button>
      </div>

      {/* Bottom Bar - Info & Classify */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-3 px-3">
        <div className="mb-3 pr-16">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1" style={{ backgroundColor: classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.color + '40', color: classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.color }}>
              {classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.icon} {currentClip.classification || currentClip.type || 'UAP'}
            </span>
            {currentClip.confidence && <span className="text-[10px] text-gray-400">{currentClip.confidence}%</span>}
          </div>
          <h3 className="font-semibold text-sm line-clamp-1 drop-shadow">{currentClip.title}</h3>
          <p className="text-xs text-gray-300 flex items-center gap-1 mt-0.5 drop-shadow"><MapPin className="w-3 h-3" />{currentClip.location}</p>
        </div>

        {/* Classify Bar */}
        <div className="flex items-center gap-1.5">
          {classificationOptions.map(opt => (
            <button key={opt.id} onClick={() => handleClassify(opt.id)} className="flex-1 py-3 rounded-lg text-xl active:scale-95 transition-transform backdrop-blur" style={{ backgroundColor: `${opt.color}30` }}>{opt.icon}</button>
          ))}
          <button onClick={handleNext} className="px-3 py-3 rounded-lg text-xs text-gray-400 bg-white/10 backdrop-blur active:scale-95">Skip</button>
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

function TrendingView({ isMobile, clips }) {
  return <VideoFeedView clips={clips} showReward={false} title="Trending" isMobile={isMobile} />;
}

function ClassifyView({ isMobile }) {
  // Convert classifyClips to have same structure as trending clips
  const clipsWithInfo = classifyClips.map((c, i) => ({
    ...c,
    siteLikes: Math.floor(50 + Math.random() * 200),
    siteComments: i === 0 ? [{user: 'Observer1', text: 'What do you all think?', time: '30m ago', avatar: 'O'}] : [],
    classification: 'UAP',
    confidence: Math.floor(70 + Math.random() * 25)
  }));
  return <VideoFeedView clips={clipsWithInfo} showReward={true} title="Classify" isMobile={isMobile} />;
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
  { id: 1, topic: 'sightings', title: 'Multiple sightings over Phoenix', content: 'Around 9:30 PM I captured a formation of 5 objects moving in perfect synchronization. Has anyone else seen this?', author: 'SkyWatcher_AZ', time: '2h ago', upvotes: 234, comments: 89, hasVideo: true },
  { id: 2, topic: 'sightings', title: 'Need help identifying this', content: 'Object hovered for 2 minutes before accelerating at impossible speeds. Captured on my Skeye cam.', author: 'NewObserver22', time: '4h ago', upvotes: 156, comments: 67, hasVideo: true },
  { id: 3, topic: 'equipment', title: 'Best camera settings?', content: 'What ISO settings work best for night captures? Getting a lot of noise in my footage.', author: 'TechExplorer', time: '6h ago', upvotes: 89, comments: 45, hasVideo: false },
  { id: 4, topic: 'analysis', title: 'Speed analysis of recent Chile sighting', content: 'I ran frame-by-frame analysis and calculated the object was moving at approximately 4,500 mph based on reference points.', author: 'DataScientist_UAP', time: '8h ago', upvotes: 312, comments: 124, hasVideo: false },
  { id: 5, topic: 'news', title: 'Congressional hearing scheduled for next month', content: 'New whistleblower testimony expected. This could be huge for disclosure.', author: 'NewsWatcher', time: '12h ago', upvotes: 567, comments: 234, hasVideo: false },
  { id: 6, topic: 'questions', title: 'How do I calibrate my Skeye camera?', content: 'Just got my camera and want to make sure the motion detection is set up correctly.', author: 'NewUser2024', time: '1d ago', upvotes: 45, comments: 23, hasVideo: false },
  { id: 7, topic: 'sightings', title: 'Triangular craft over Texas', content: 'Silent, massive, three lights at each corner. My whole neighborhood saw it.', author: 'TexasSkies', time: '1d ago', upvotes: 445, comments: 189, hasVideo: true },
  { id: 8, topic: 'analysis', title: 'Debunked: Recent viral video was a drone', content: 'After careful analysis, the movement pattern and light signature clearly indicate a DJI drone.', author: 'SkepticalAnalyst', time: '2d ago', upvotes: 123, comments: 98, hasVideo: false },
];

function CommunityView({ isMobile }) {
  const [activeTopic, setActiveTopic] = useState('all');
  const [sortBy, setSortBy] = useState('hot');
  const [votedPosts, setVotedPosts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);

  const handleVote = (id, e) => { e.stopPropagation(); setVotedPosts(prev => ({ ...prev, [id]: !prev[id] })); };

  const filteredPosts = activeTopic === 'all' ? communityPostsData : communityPostsData.filter(p => p.topic === activeTopic);
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'hot') return (b.upvotes + b.comments) - (a.upvotes + a.comments);
    if (sortBy === 'new') return 0;
    if (sortBy === 'top') return b.upvotes - a.upvotes;
    return 0;
  });

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
            <button className="w-full py-3 bg-green-500 rounded-xl font-semibold hover:bg-green-600 flex items-center justify-center gap-2">
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
                    <span>{selectedPost.comments} Comments</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
                <div className="pt-4">
                  <div className="flex gap-3 mb-4">
                    <input type="text" placeholder="Add a comment..." className="flex-1 px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50" />
                    <button className="px-6 py-3 bg-green-500 rounded-xl font-medium">Post</button>
                  </div>
                  <p className="text-center text-gray-500 text-sm">Comments would appear here</p>
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
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-green-500 rounded-full shadow-lg flex items-center justify-center active:scale-95 z-40">
        <Plus className="w-6 h-6" />
      </button>

      {/* Post Detail - Bottom Sheet */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setSelectedPost(null)}>
          <div className="absolute inset-x-0 bottom-0 bg-[#141414] rounded-t-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3" />
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
                  <span className="text-sm">{selectedPost.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              <div className="pt-4">
                <p className="text-center text-gray-500 text-sm">Comments would appear here</p>
              </div>
            </div>
            <div className="p-3 border-t border-gray-800">
              <div className="flex gap-2">
                <input type="text" placeholder="Add a comment..." className="flex-1 px-3 py-2 bg-white/5 border border-gray-700 rounded-xl text-white text-sm" />
                <button className="px-4 py-2 bg-green-500 rounded-xl text-sm font-medium">Post</button>
              </div>
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
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className={`flex-shrink-0 ${isMobile ? 'p-4' : 'p-6'} bg-gradient-to-b from-green-500/10 to-transparent`}>
        <div className="flex items-center gap-4">
          <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} rounded-full overflow-hidden border-2 border-green-500/50`}>
            <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>John Doe</h2>
            <p className={`text-gray-400 ${isMobile ? 'text-sm' : ''}`}>john@example.com</p>
          </div>
        </div>
        <div className={`flex ${isMobile ? 'gap-6 mt-4' : 'gap-8 mt-5'}`}>
          <div><p className={`font-bold text-green-400 ${isMobile ? '' : 'text-xl'}`}>12,450</p><p className={`text-gray-500 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>$SKEYE</p></div>
          <div><p className={`font-bold ${isMobile ? '' : 'text-xl'}`}>156</p><p className={`text-gray-500 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>Classified</p></div>
          <div><p className={`font-bold ${isMobile ? '' : 'text-xl'}`}>#47</p><p className={`text-gray-500 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>Rank</p></div>
        </div>
      </div>

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
  const settingsGroups = [
    { title: 'Account', items: [{ icon: User, label: 'Edit Profile' }, { icon: CreditCard, label: 'Subscription', badge: 'Pro' }, { icon: HardDrive, label: 'Storage', badge: '45/100GB' }] },
    { title: 'Preferences', items: [{ icon: Bell, label: 'Notifications' }, { icon: Globe, label: 'Language' }] },
    { title: 'Support', items: [{ icon: MessageCircle, label: 'Help Center' }, { icon: Settings, label: 'About' }] },
  ];

  return (
    <div className={`${isMobile ? 'p-3 space-y-4' : 'p-5 space-y-6 max-w-2xl'}`}>
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
      <button className={`w-full ${isMobile ? 'py-3' : 'py-4'} bg-red-500/10 text-red-400 rounded-xl font-medium hover:bg-red-500/20`}>Sign Out</button>
    </div>
  );
}
