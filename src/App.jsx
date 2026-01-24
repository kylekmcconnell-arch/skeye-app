import { useState, useEffect, useRef } from 'react';
import { Camera, TrendingUp, Users, Bell, Play, Eye, Zap, Globe, Radio, Wifi, MapPin, ThumbsUp, MessageCircle, Share2, Download, X, Settings, ChevronLeft, ChevronRight, Volume2, CreditCard, HardDrive, User, LogOut, ChevronDown, ChevronUp, Send, Film, SkipBack, Plus, Filter, List } from 'lucide-react';
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
  { id: 1, device: 'Home (Rooftop)', time: 'Today, 9:34 PM', type: 'UAP', confidence: 87, duration: '0:32', videoId: 'QKHg-vnTFsM' },
  { id: 2, device: 'Home (Rooftop)', time: 'Today, 8:12 PM', type: 'Aircraft', confidence: 94, duration: '0:18', videoId: 'u1hNYs55sqs' },
  { id: 3, device: 'Home (Barn)', time: 'Today, 6:45 PM', type: 'Drone', confidence: 91, duration: '1:24', videoId: '2TumprpOwHY' },
  { id: 4, device: 'Beach House (Roof)', time: 'Yesterday, 11:23 PM', type: 'UAP', confidence: 76, duration: '0:45', videoId: 'dGOXuuhYoLk' },
];

const mockClips = [
  { id: 1, title: 'GIMBAL - Navy F/A-18 Encounter', location: 'East Coast, USA', timestamp: '2 min ago', views: 12400, classification: 'UAP', confidence: 87, verified: true, likes: 892, comments: [{user: 'SkyWatcher_AZ', text: 'Incredible footage!', time: '1h ago'}], videoId: 'QKHg-vnTFsM' },
  { id: 2, title: 'GO FAST - High Speed Object', location: 'Atlantic Ocean', timestamp: '15 min ago', views: 8900, classification: 'UAP', confidence: 91, verified: true, likes: 456, comments: [{user: 'DataAnalyst99', text: 'Speed suggests 400+ mph', time: '2h ago'}], videoId: 'u1hNYs55sqs' },
  { id: 3, title: 'FLIR1 Tic Tac - USS Nimitz', location: 'San Diego, CA', timestamp: '1 hour ago', views: 25600, classification: 'UAP', confidence: 96, verified: true, likes: 1834, comments: [], videoId: '2TumprpOwHY' },
  { id: 4, title: 'Jellyfish UAP - Iraq 2018', location: 'Iraq', timestamp: '3 hours ago', views: 21000, classification: 'UAP', confidence: 72, verified: true, likes: 1567, comments: [], videoId: 'dGOXuuhYoLk' },
  { id: 5, title: 'Chilean Navy UFO', location: 'Chile', timestamp: '5 hours ago', views: 18700, classification: 'UAP', confidence: 84, verified: true, likes: 1245, comments: [], videoId: 'iEK3YC_BKTI' },
];

const classifyClips = [
  { id: 1, videoId: 'QKHg-vnTFsM', title: 'Rotating Object - East Coast', location: 'Virginia, USA' },
  { id: 2, videoId: 'u1hNYs55sqs', title: 'High Speed Target - Atlantic', location: 'Atlantic Ocean' },
  { id: 3, videoId: '2TumprpOwHY', title: 'Tic Tac Shape - Pacific', location: 'San Diego, CA' },
  { id: 4, videoId: 'dGOXuuhYoLk', title: 'Unknown Object - Middle East', location: 'Iraq' },
  { id: 5, videoId: 'iEK3YC_BKTI', title: 'Navy Thermal Imaging', location: 'Chile' },
];

const classificationOptions = [
  { id: 'UAP', label: '🛸 UAP', color: '#a855f7', short: '🛸' },
  { id: 'Drone', label: '🤖 Drone', color: '#3b82f6', short: '🤖' },
  { id: 'Aircraft', label: '✈️ Aircraft', color: '#22c55e', short: '✈️' },
  { id: 'Bird', label: '🦅 Bird', color: '#eab308', short: '🦅' },
  { id: 'Weather', label: '🌦️ Weather', color: '#06b6d4', short: '🌦️' },
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
    <div className="fixed inset-0 bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="relative z-50 border-b border-green-500/20 bg-[#0a0a0a] flex-shrink-0 px-3 py-2">
        <div className="flex items-center justify-between">
          <img src={logo} alt="SKEYE.AI" className="h-6 w-auto" />
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 active:scale-95">
            <Bell className="w-5 h-5 text-gray-400" />
            {unreadCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>}
          </button>
        </div>
        {showNotifications && (
          <div className="absolute left-2 right-2 top-full mt-2 bg-[#141414] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="p-3 border-b border-gray-800 flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              <button onClick={() => setShowNotifications(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notificationsList.map((n) => (
                <div key={n.id} className={`p-3 border-b border-gray-800/50 ${!n.read ? 'bg-green-500/5' : ''}`}>
                  <p className="text-sm text-white">{n.device}</p>
                  <p className="text-xs text-gray-400">{n.message}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative" onClick={() => setShowNotifications(false)}>
        {activeTab === 'map' && <GlobalMapView isMobile={isMobile} />}
        {activeTab === 'trending' && <TrendingView isMobile={isMobile} clips={mockClips} />}
        {activeTab === 'classify' && <ClassifyView isMobile={isMobile} />}
        {activeTab === 'community' && <CommunityView isMobile={isMobile} />}
        {activeTab === 'profile' && <ProfileView isMobile={isMobile} profileSubTab={profileSubTab} setProfileSubTab={setProfileSubTab} devices={mockDevices} clips={myClips} />}
      </main>

      {/* Bottom Navigation */}
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
    </div>
  );
}

function GlobalMapView({ isMobile }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [sightings] = useState(allSightings);
  const [timeRange, setTimeRange] = useState('24h');
  const [showSightingsList, setShowSightingsList] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const getFiltered = () => {
    const range = timeRanges.find(r => r.id === timeRange);
    let filtered = sightings;
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
      const map = window.L.map(mapRef.current, { center: [30, 0], zoom: 2, minZoom: 2, maxZoom: 18, zoomControl: false, attributionControl: false, worldCopyJump: true, tap: false });
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, subdomains: 'abcd' }).addTo(map);
      mapInstanceRef.current = map;
      setMapReady(true);
    };
    loadMap();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    mapInstanceRef.current.eachLayer(layer => { if (layer instanceof window.L.CircleMarker) mapInstanceRef.current.removeLayer(layer); });
    const colors = { Unknown: '#a855f7', Drone: '#3b82f6', Aircraft: '#22c55e', Bird: '#eab308', Weather: '#06b6d4' };
    filteredSightings.slice(0, 30).forEach(item => {
      const color = colors[item.type];
      window.L.circleMarker([item.lat, item.lng], { radius: 8, fillColor: color, fillOpacity: 0.8, color: color, weight: 2, opacity: 1 }).addTo(mapInstanceRef.current).on('click', () => setSelectedSighting(item));
    });
  }, [filteredSightings, mapReady]);

  return (
    <div className="h-full relative" style={{ background: '#262626' }}>
      <div ref={mapRef} className="absolute inset-0" style={{ background: '#262626' }} />
      
      {/* Time Range */}
      <div className="absolute top-2 left-2 right-2 z-[1000]">
        <div className="bg-[#141414]/95 rounded-lg border border-gray-700 p-1 flex justify-between">
          {timeRanges.map(r => (<button key={r.id} onClick={() => setTimeRange(r.id)} className={`flex-1 py-2 text-xs font-medium rounded ${timeRange === r.id ? 'bg-green-500/20 text-green-400' : 'text-gray-400'}`}>{r.label}</button>))}
        </div>
      </div>

      {/* Sightings List Button */}
      <button onClick={() => setShowSightingsList(true)} className="absolute bottom-4 right-4 z-[1000] bg-[#141414]/95 border border-gray-700 rounded-full px-4 py-2 flex items-center gap-2 active:scale-95">
        <Radio className="w-4 h-4 text-green-400 animate-pulse" />
        <span className="text-sm font-medium">{filteredSightings.length}</span>
        <span className="text-xs text-gray-400">sightings</span>
      </button>

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
            <div className="inline-block px-3 py-1.5 rounded-lg text-sm font-bold mb-4" style={{ backgroundColor: `${classificationOptions.find(o => o.id === selectedSighting.type)?.color}33`, color: classificationOptions.find(o => o.id === selectedSighting.type)?.color }}>{selectedSighting.type}</div>
            <p className="text-xs text-gray-400 mb-2">Classify this sighting:</p>
            <div className="grid grid-cols-5 gap-2">
              {classificationOptions.map(opt => (<button key={opt.id} className="py-3 rounded-xl text-xs font-bold active:scale-95" style={{ backgroundColor: `${opt.color}20`, color: opt.color }}>{opt.label}</button>))}
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
  const currentClip = clips[currentIndex];

  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };
  const handleNext = () => { if (currentIndex < clips.length - 1) setCurrentIndex(currentIndex + 1); else setCurrentIndex(0); };
  const handleLike = () => setLikedClips(prev => ({ ...prev, [currentClip.id]: !prev[currentClip.id] }));
  const handleClassify = (type) => { 
    setClassified(prev => prev + 1);
    setTimeout(() => handleNext(), 300);
  };

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
        <div className="w-80 bg-[#0a0a0a] border-l border-gray-800 flex flex-col">
          {/* Progress */}
          <div className="p-4 border-b border-gray-800">
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
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.color + '30', color: classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.color }}>
                {classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.short} {currentClip.classification || currentClip.type || 'UAP'}
              </span>
              {currentClip.confidence && <span className="text-xs text-gray-400">{currentClip.confidence}%</span>}
            </div>
            <h3 className="font-semibold text-lg">{currentClip.title}</h3>
            <p className="text-sm text-gray-400 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" />{currentClip.location}</p>
          </div>

          {/* Actions */}
          <div className="p-4 border-b border-gray-800 flex items-center gap-3">
            <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${likedClips[currentClip.id] ? 'bg-green-500 text-white' : 'bg-white/5 hover:bg-white/10'}`}>
              <ThumbsUp className="w-5 h-5" />
              <span>{(currentClip.likes || 0) + (likedClips[currentClip.id] ? 1 : 0)}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10">
              <MessageCircle className="w-5 h-5" />
              <span>{currentClip.comments?.length || 0}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Classify Section */}
          <div className="flex-1 p-4">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">CLASSIFY THIS SIGHTING</h4>
            <div className="space-y-2">
              {classificationOptions.map(opt => (
                <button 
                  key={opt.id} 
                  onClick={() => handleClassify(opt.id)} 
                  className="w-full py-3 rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2" 
                  style={{ backgroundColor: `${opt.color}20`, color: opt.color }}
                >
                  <span className="text-xl">{opt.short}</span>
                  <span>{opt.label.split(' ')[1]}</span>
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
    );
  }

  // Mobile Layout
  return (
    <div className="h-full relative bg-black">
      {/* Full Screen Video */}
      <iframe 
        key={currentClip.id} 
        src={`https://www.youtube.com/embed/${currentClip.videoId}?autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1`} 
        className="absolute inset-0 w-full h-full" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen 
        title={currentClip.title} 
      />
      
      {/* Top Bar - Progress & Info */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-3 pb-12">
        {/* Progress Dots */}
        <div className="flex gap-1 mb-3">
          {clips.map((_, i) => (<div key={i} className={`flex-1 h-1 rounded-full transition-all ${i === currentIndex ? 'bg-white' : i < currentIndex ? 'bg-white/50' : 'bg-white/20'}`} />))}
        </div>
        
        {/* Counter & Reward */}
        <div className="flex items-center justify-between">
          <div className="bg-black/40 backdrop-blur px-3 py-1.5 rounded-full text-xs">
            {currentIndex + 1} / {clips.length}
          </div>
          {showReward && (
            <div className="flex items-center gap-1 bg-green-500/20 backdrop-blur px-3 py-1.5 rounded-full">
              <Zap className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400 font-semibold">+50 $SKEYE</span>
            </div>
          )}
          {!showReward && classified > 0 && (
            <div className="bg-black/40 backdrop-blur px-3 py-1.5 rounded-full text-xs">
              Classified: <span className="text-green-400 font-bold">{classified}</span>
            </div>
          )}
        </div>
      </div>

      {/* Nav Arrows */}
      <button onClick={handlePrev} disabled={currentIndex === 0} className={`absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center z-10 transition-opacity ${currentIndex === 0 ? 'opacity-30' : 'hover:bg-black/60 active:scale-95'}`}>
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center z-10 hover:bg-black/60 active:scale-95">
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-36 flex flex-col items-center gap-4 z-10">
        <button onClick={handleLike} className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur transition-colors ${likedClips[currentClip.id] ? 'bg-green-500' : 'bg-black/40 hover:bg-black/60'}`}>
            <ThumbsUp className="w-5 h-5" />
          </div>
          <span className="text-xs mt-1 drop-shadow">{(currentClip.likes || 0) + (likedClips[currentClip.id] ? 1 : 0)}</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur hover:bg-black/60 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-xs mt-1 drop-shadow">{(currentClip.comments?.length || 0)}</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur hover:bg-black/60 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Bottom Bar - Info & Classify */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-3 px-3">
        {/* Clip Info */}
        <div className="mb-3 pr-16">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1" style={{ backgroundColor: classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.color + '40', color: classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.color }}>
              {classificationOptions.find(o => o.id === (currentClip.classification || currentClip.type || 'UAP'))?.short}
              {currentClip.classification || currentClip.type || 'UAP'}
            </span>
            {currentClip.confidence && <span className="text-[10px] text-gray-400">{currentClip.confidence}%</span>}
          </div>
          <h3 className="font-semibold text-sm line-clamp-1 drop-shadow">{currentClip.title}</h3>
          <p className="text-xs text-gray-300 flex items-center gap-1 mt-0.5 drop-shadow"><MapPin className="w-3 h-3" />{currentClip.location}</p>
        </div>

        {/* Classify Bar */}
        <div className="flex items-center gap-1.5">
          {classificationOptions.map(opt => (
            <button 
              key={opt.id} 
              onClick={() => handleClassify(opt.id)} 
              className="flex-1 py-2.5 rounded-lg text-lg active:scale-95 transition-transform backdrop-blur" 
              style={{ backgroundColor: `${opt.color}30`, color: opt.color }}
            >
              {opt.short}
            </button>
          ))}
          <button onClick={handleNext} className="px-3 py-2.5 rounded-lg text-xs text-gray-400 bg-white/10 backdrop-blur active:scale-95">
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

function TrendingView({ isMobile, clips }) {
  return <VideoFeedView clips={clips} showReward={false} title="Trending" isMobile={isMobile} />;
}

function ClassifyView({ isMobile }) {
  // Convert classifyClips to have same structure as trending clips
  const clipsWithInfo = classifyClips.map(c => ({
    ...c,
    likes: Math.floor(Math.random() * 500),
    comments: [],
    classification: 'UAP',
    confidence: Math.floor(70 + Math.random() * 25)
  }));
  return <VideoFeedView clips={clipsWithInfo} showReward={true} title="Classify" isMobile={isMobile} />;
}

function CommunityView({ isMobile }) {
  const [posts] = useState(communityPosts);
  const [votedPosts, setVotedPosts] = useState({});

  const handleVote = (id) => setVotedPosts(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 space-y-3">
        {posts.map(post => (
          <div key={post.id} className="p-3 bg-white/5 rounded-2xl">
            <div className="flex gap-3">
              <button onClick={() => handleVote(post.id)} className="flex flex-col items-center">
                <ChevronUp className={`w-6 h-6 ${votedPosts[post.id] ? 'text-green-400' : 'text-gray-500'}`} />
                <span className={`text-sm font-semibold ${votedPosts[post.id] ? 'text-green-400' : ''}`}>{post.upvotes + (votedPosts[post.id] ? 1 : 0)}</span>
              </button>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{post.title}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                  <span>{post.author}</span>
                  <span>{post.time}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="fixed bottom-20 right-4 w-12 h-12 bg-green-500 rounded-full shadow-lg flex items-center justify-center active:scale-95 z-40">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

function ProfileView({ isMobile, profileSubTab, setProfileSubTab, devices, clips }) {
  const subTabs = [
    { id: 'devices', label: 'Devices', icon: Camera },
    { id: 'clips', label: 'Clips', icon: Film },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 bg-gradient-to-b from-green-500/10 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-500/50">
            <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-bold text-lg">John Doe</h2>
            <p className="text-sm text-gray-400">john@example.com</p>
          </div>
        </div>
        <div className="flex gap-6 mt-4">
          <div><p className="font-bold text-green-400">12,450</p><p className="text-[10px] text-gray-500">$SKEYE</p></div>
          <div><p className="font-bold">156</p><p className="text-[10px] text-gray-500">Classified</p></div>
          <div><p className="font-bold">#47</p><p className="text-[10px] text-gray-500">Rank</p></div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex-shrink-0 flex border-b border-gray-800">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setProfileSubTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 ${profileSubTab === tab.id ? 'border-green-400 text-green-400' : 'border-transparent text-gray-500'}`}>
              <Icon className="w-4 h-4" /><span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {profileSubTab === 'devices' && <DevicesSubView devices={devices} />}
        {profileSubTab === 'clips' && <ClipsSubView clips={clips} />}
        {profileSubTab === 'settings' && <SettingsSubView />}
      </div>
    </div>
  );
}

function DevicesSubView({ devices }) {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="p-3 space-y-3">
      <button className="w-full py-3 border-2 border-dashed border-gray-700 rounded-2xl text-gray-400 flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" />Add Device
      </button>
      {devices.map(device => (
        <div key={device.id} className={`p-3 rounded-2xl border ${device.status === 'online' ? 'bg-green-500/5 border-green-500/20' : 'bg-gray-800/30 border-gray-700/50'}`}>
          <div className="flex items-start gap-3">
            <img src={cameraImg} alt="Camera" className="w-12 h-12 object-contain" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm truncate">{device.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${device.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{device.status}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{device.location}</p>
              <div className="flex gap-3 mt-1 text-[10px] text-gray-500">
                <span><Wifi className="w-3 h-3 inline" /> {device.signal}%</span>
                <span><Eye className="w-3 h-3 inline" /> {device.detections}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button disabled={device.status !== 'online'} className={`flex-1 py-2 rounded-lg text-xs font-medium ${device.status === 'online' ? 'bg-green-500/10 text-green-400' : 'bg-gray-800 text-gray-500'}`}>View Feed</button>
            <button onClick={() => { setSelectedDevice(device); setShowSettings(true); }} className="flex-1 py-2 rounded-lg text-xs bg-white/5 text-gray-400">Settings</button>
          </div>
        </div>
      ))}

      {showSettings && selectedDevice && (
        <div className="fixed inset-0 z-50 bg-black/80" onClick={() => setShowSettings(false)}>
          <div className="absolute inset-x-0 bottom-0 bg-[#141414] rounded-t-3xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3" />
            <div className="p-4 border-b border-gray-800 flex justify-between">
              <h3 className="font-semibold">Settings</h3>
              <button onClick={() => setShowSettings(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div><label className="text-xs text-gray-400">Device Name</label><input defaultValue={selectedDevice.name} className="w-full mt-1 px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white" /></div>
              <div><label className="text-xs text-gray-400">Location</label><div className="mt-1 px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-gray-400">{selectedDevice.location}</div></div>
              <div><label className="text-xs text-gray-400">WiFi Network</label><input defaultValue="Home_Network_5G" className="w-full mt-1 px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white" /></div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl"><span>Starlight Vision</span><div className="w-12 h-6 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div></div>
              <button className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl">Delete Device</button>
            </div>
            <div className="p-4 border-t border-gray-800">
              <button className="w-full py-3 bg-green-500 rounded-xl font-medium">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClipsSubView({ clips }) {
  const [selectedClip, setSelectedClip] = useState(null);

  return (
    <div className="p-3">
      <div className="grid grid-cols-2 gap-2">
        {clips.map(clip => (
          <div key={clip.id} onClick={() => setSelectedClip(clip)} className="rounded-xl overflow-hidden bg-white/5">
            <div className="aspect-video bg-black relative">
              <img src={`https://img.youtube.com/vi/${clip.videoId}/mqdefault.jpg`} alt="Clip" className="w-full h-full object-cover" />
              <Play className="absolute inset-0 m-auto w-8 h-8 text-white/80" />
              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ backgroundColor: classificationOptions.find(o => o.id === clip.type)?.color, color: 'white' }}>{clip.type}</span>
            </div>
            <div className="p-2">
              <p className="text-xs truncate">{clip.device}</p>
              <p className="text-[10px] text-gray-500">{clip.time}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedClip && (
        <div className="fixed inset-0 z-50 bg-black" onClick={() => setSelectedClip(null)}>
          <div className="h-full flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4">
              <div><h3 className="font-semibold">{selectedClip.device}</h3><p className="text-xs text-gray-400">{selectedClip.time}</p></div>
              <button onClick={() => setSelectedClip(null)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <div className="flex-1 bg-black">
              <iframe src={`https://www.youtube.com/embed/${selectedClip.videoId}?autoplay=1&playsinline=1&rel=0`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Clip" />
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ backgroundColor: `${classificationOptions.find(o => o.id === selectedClip.type)?.color}33`, color: classificationOptions.find(o => o.id === selectedClip.type)?.color }}>{selectedClip.type}</span>
              <div className="flex gap-2">
                <button className="p-3 bg-white/5 rounded-full"><Download className="w-5 h-5" /></button>
                <button className="p-3 bg-white/5 rounded-full"><Share2 className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsSubView() {
  return (
    <div className="p-3 space-y-4">
      <div className="bg-white/5 rounded-2xl overflow-hidden">
        <button className="w-full flex items-center gap-3 px-4 py-3 active:bg-white/5"><User className="w-5 h-5 text-gray-400" /><span className="flex-1 text-left">Edit Profile</span><ChevronRight className="w-4 h-4 text-gray-600" /></button>
        <button className="w-full flex items-center gap-3 px-4 py-3 border-t border-gray-800 active:bg-white/5"><CreditCard className="w-5 h-5 text-gray-400" /><span className="flex-1 text-left">Subscription</span><span className="text-xs text-green-400">Pro</span><ChevronRight className="w-4 h-4 text-gray-600" /></button>
        <button className="w-full flex items-center gap-3 px-4 py-3 border-t border-gray-800 active:bg-white/5"><HardDrive className="w-5 h-5 text-gray-400" /><span className="flex-1 text-left">Storage</span><span className="text-xs text-gray-400">45/100GB</span><ChevronRight className="w-4 h-4 text-gray-600" /></button>
      </div>
      <div className="bg-white/5 rounded-2xl overflow-hidden">
        <button className="w-full flex items-center gap-3 px-4 py-3 active:bg-white/5"><Bell className="w-5 h-5 text-gray-400" /><span className="flex-1 text-left">Notifications</span><ChevronRight className="w-4 h-4 text-gray-600" /></button>
        <button className="w-full flex items-center gap-3 px-4 py-3 border-t border-gray-800 active:bg-white/5"><Globe className="w-5 h-5 text-gray-400" /><span className="flex-1 text-left">Language</span><ChevronRight className="w-4 h-4 text-gray-600" /></button>
      </div>
      <button className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl font-medium">Sign Out</button>
    </div>
  );
}
