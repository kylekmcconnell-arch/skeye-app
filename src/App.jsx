import { useState, useEffect, useRef } from 'react';
import { Camera, TrendingUp, Users, Bell, Search, Play, Eye, Zap, Globe, Shield, Radio, Wifi, AlertTriangle, MapPin, Grid, List, ThumbsUp, ThumbsDown, MessageCircle, Share2, Download, X, Settings, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Volume2, Save, Trash2, Circle, Target, Crosshair, Clock, Heart, Lock, CreditCard, HardDrive, User, LogOut, ChevronDown, ChevronUp, Send, Film, SkipForward, SkipBack } from 'lucide-react';
import logo from './logo.png';
import cameraImg from './camera.png';
import profileImg from './profile.jpg';

const mockDevices = [
  { id: 1, name: 'Home (Rooftop)', location: 'Lisbon, Portugal', status: 'online', detections: 127, signal: 98, lat: 38.7223, lng: -9.1393, serial: 'SKY-2024-0847-A1' },
  { id: 2, name: 'Home (Barn)', location: 'Lisbon, Portugal', status: 'online', detections: 89, signal: 92, lat: 38.7223, lng: -9.1393, serial: 'SKY-2024-1293-B2' },
  { id: 3, name: 'Lake House (Roof)', location: 'Austin, TX', status: 'offline', detections: 203, signal: 0, lat: 30.2672, lng: -97.7431, serial: 'SKY-2024-0156-C3' },
  { id: 4, name: 'Beach House (Roof)', location: 'San Diego, CA', status: 'online', detections: 56, signal: 87, lat: 32.7157, lng: -117.1611, serial: 'SKY-2024-2048-D4' },
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
  { id: 1, title: 'GIMBAL - Navy F/A-18 Encounter', location: 'East Coast, USA', timestamp: '2 min ago', views: 12400, classification: 'Unknown', confidence: 87, verified: true, likes: 892, dislikes: 23, comments: [{user: 'SkyWatcher_AZ', text: 'This is incredible footage!', time: '1 hour ago'}, {user: 'TruthSeeker', text: 'Definitely not a drone', time: '30 min ago'}], videoId: 'QKHg-vnTFsM' },
  { id: 2, title: 'GO FAST - High Speed Object', location: 'Atlantic Ocean', timestamp: '15 min ago', views: 8900, classification: 'Unknown', confidence: 91, verified: true, likes: 456, dislikes: 12, comments: [{user: 'DataAnalyst99', text: 'Speed calculations suggest 400+ mph', time: '2 hours ago'}], videoId: 'u1hNYs55sqs' },
  { id: 3, title: 'FLIR1 Tic Tac - USS Nimitz', location: 'San Diego, CA', timestamp: '1 hour ago', views: 25600, classification: 'Unknown', confidence: 96, verified: true, likes: 1834, dislikes: 45, comments: [{user: 'NightOwl_TX', text: 'Classic footage', time: '5 hours ago'}], videoId: '2TumprpOwHY' },
  { id: 4, title: 'Jellyfish UAP - Iraq 2018', location: 'Iraq', timestamp: '3 hours ago', views: 21000, classification: 'Unknown', confidence: 72, verified: true, likes: 1567, dislikes: 89, comments: [], videoId: 'dGOXuuhYoLk' },
  { id: 5, title: 'Chilean Navy UFO Footage', location: 'Chile', timestamp: '5 hours ago', views: 18700, classification: 'Unknown', confidence: 84, verified: true, likes: 1245, dislikes: 34, comments: [], videoId: 'iEK3YC_BKTI' },
  { id: 6, title: 'Phoenix Lights Formation', location: 'Phoenix, AZ', timestamp: '8 hours ago', views: 34200, classification: 'Unknown', confidence: 79, verified: true, likes: 2341, dislikes: 67, comments: [], videoId: 'v1Vu9Z8OUvE' },
  { id: 7, title: 'Belgium Triangle Wave', location: 'Belgium', timestamp: '12 hours ago', views: 28900, classification: 'Unknown', confidence: 88, verified: true, likes: 1987, dislikes: 45, comments: [], videoId: 'Rjmkniw0jFA' },
  { id: 8, title: 'Japan Airlines Flight 1628', location: 'Alaska', timestamp: '1 day ago', views: 15600, classification: 'Unknown', confidence: 82, verified: true, likes: 1123, dislikes: 28, comments: [], videoId: 'XHSQK8DqpNo' },
];

const classifyClips = [
  { id: 1, videoId: 'QKHg-vnTFsM', title: 'Rotating Object - East Coast', location: 'Virginia, USA' },
  { id: 2, videoId: 'u1hNYs55sqs', title: 'High Speed Target - Atlantic', location: 'Atlantic Ocean' },
  { id: 3, videoId: '2TumprpOwHY', title: 'Tic Tac Shape - Pacific', location: 'San Diego, CA' },
  { id: 4, videoId: 'dGOXuuhYoLk', title: 'Unknown Object - Middle East', location: 'Iraq' },
  { id: 5, videoId: 'SpeSpA3e56A', title: 'Night Vision Capture - Nevada', location: 'Nevada, USA' },
  { id: 6, videoId: 'iEK3YC_BKTI', title: 'Navy Thermal Imaging', location: 'Chile' },
  { id: 7, videoId: 'v1Vu9Z8OUvE', title: 'Formation Lights', location: 'Phoenix, AZ' },
  { id: 8, videoId: 'Rjmkniw0jFA', title: 'Triangle Pattern', location: 'Belgium' },
];

const generateHistoricalSightings = () => {
  const cities = [
    { city: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
    { city: 'New York', lat: 40.7128, lng: -74.0060 },
    { city: 'Phoenix', lat: 33.4484, lng: -112.0740 },
    { city: 'Chicago', lat: 41.8781, lng: -87.6298 },
    { city: 'Houston', lat: 29.7604, lng: -95.3698 },
    { city: 'London', lat: 51.5074, lng: -0.1278 },
    { city: 'Paris', lat: 48.8566, lng: 2.3522 },
    { city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { city: 'Sydney', lat: -33.8688, lng: 151.2093 },
    { city: 'Dubai', lat: 25.2048, lng: 55.2708 },
    { city: 'São Paulo', lat: -23.5505, lng: -46.6333 },
    { city: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { city: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { city: 'Berlin', lat: 52.5200, lng: 13.4050 },
    { city: 'Toronto', lat: 43.6532, lng: -79.3832 },
    { city: 'Seoul', lat: 37.5665, lng: 126.9780 },
    { city: 'Mexico City', lat: 19.4326, lng: -99.1332 },
    { city: 'Cairo', lat: 30.0444, lng: 31.2357 },
    { city: 'Cape Town', lat: -33.9249, lng: 18.4241 },
    { city: 'Moscow', lat: 55.7558, lng: 37.6173 },
  ];

  const types = ['Unknown', 'Drone', 'Aircraft', 'Bird', 'Weather'];
  const videoIds = ['QKHg-vnTFsM', 'u1hNYs55sqs', '2TumprpOwHY', 'dGOXuuhYoLk', 'SpeSpA3e56A'];
  const sightings = [];
  const now = Date.now();

  for (let i = 0; i < 500; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const hoursAgo = Math.random() * 24 * 30;
    const timestamp = now - hoursAgo * 60 * 60 * 1000;
    
    sightings.push({
      id: i + 1,
      lat: city.lat + (Math.random() - 0.5) * 0.5,
      lng: city.lng + (Math.random() - 0.5) * 0.5,
      type: types[Math.floor(Math.random() * types.length)],
      intensity: 0.5 + Math.random() * 0.5,
      city: city.city,
      timestamp,
      time: getTimeAgo(timestamp),
      videoId: videoIds[Math.floor(Math.random() * videoIds.length)]
    });
  }
  return sightings.sort((a, b) => b.timestamp - a.timestamp);
};

const getTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const allSightings = generateHistoricalSightings();

const notifications = [
  { id: 1, type: 'detection', device: 'Home (Rooftop)', message: 'Unknown object detected', time: '2 min ago', videoId: 'QKHg-vnTFsM', read: false },
  { id: 2, type: 'detection', device: 'Beach House (Roof)', message: 'Drone activity detected', time: '15 min ago', videoId: 'u1hNYs55sqs', read: false },
  { id: 3, type: 'comment', user: 'SkyWatcher_AZ', message: 'replied to your comment', time: '1 hour ago', read: false },
  { id: 4, type: 'upvote', user: 'NightOwl_TX', message: 'upvoted your classification', time: '2 hours ago', read: true },
];

const communityCategories = [
  { id: 'general', name: 'General Discussion', icon: MessageCircle, count: 1234 },
  { id: 'unclassified', name: 'Unclassified Detections', icon: Eye, count: 567 },
  { id: 'north-america', name: 'North America', icon: Globe, count: 892 },
  { id: 'europe', name: 'Europe', icon: Globe, count: 456 },
  { id: 'asia-pacific', name: 'Asia Pacific', icon: Globe, count: 234 },
  { id: 'equipment', name: 'Equipment & Setup', icon: Camera, count: 345 },
];

const communityPosts = [
  { id: 1, category: 'north-america', title: 'Multiple sightings over Phoenix last night', author: 'SkyWatcher_AZ', avatar: 'S', time: '2h ago', upvotes: 234, downvotes: 12, comments: 89, pinned: true, content: 'Around 9:30 PM I captured what appears to be a formation of 5 objects...' },
  { id: 2, category: 'unclassified', title: 'Need help identifying this object', author: 'NewObserver22', avatar: 'N', time: '4h ago', upvotes: 156, downvotes: 8, comments: 67, pinned: false, content: 'The object seemed to hover for about 2 minutes before accelerating...' },
  { id: 3, category: 'general', title: 'Best camera settings for night monitoring?', author: 'TechExplorer', avatar: 'T', time: '6h ago', upvotes: 89, downvotes: 3, comments: 45, pinned: false, content: 'What ISO and exposure settings are you all using?' },
  { id: 4, category: 'equipment', title: 'New firmware v2.4.1 released', author: 'SkeyeOfficial', avatar: '✓', time: '1d ago', upvotes: 567, downvotes: 5, comments: 123, pinned: true, verified: true, content: 'Significant improvements to AI detection algorithm...' },
];

const classificationOptions = [
  { id: 'Unknown', label: 'Unknown', color: '#a855f7' },
  { id: 'Drone', label: 'Drone', color: '#3b82f6' },
  { id: 'Aircraft', label: 'Aircraft', color: '#22c55e' },
  { id: 'Bird', label: 'Bird', color: '#eab308' },
  { id: 'Weather', label: 'Weather', color: '#06b6d4' },
];

const timeRanges = [
  { id: '1h', label: '1 Hour', hours: 1 },
  { id: '24h', label: '24 Hours', hours: 24 },
  { id: '7d', label: '7 Days', hours: 24 * 7 },
  { id: '30d', label: '30 Days', hours: 24 * 30 },
  { id: 'all', label: 'All Time', hours: Infinity },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedClip, setSelectedClip] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [time, setTime] = useState(new Date());
  const [activeDevices, setActiveDevices] = useState(2847);
  const [totalDetections, setTotalDetections] = useState(14892);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notificationsList, setNotificationsList] = useState(notifications);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const unreadCount = notificationsList.filter(n => !n.read).length;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setActiveDevices(prev => prev + Math.floor(Math.random() * 3) - 1);
      setTotalDetections(prev => prev + Math.floor(Math.random() * 5));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const publicTabs = [
    { id: 'map', label: 'Map', icon: Globe },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'classify', label: 'Classify', icon: Eye },
    { id: 'community', label: 'Community', icon: Users },
  ];

  const privateTabs = [
    { id: 'devices', label: 'My Devices', icon: Camera },
    { id: 'myclips', label: 'My Clips', icon: Film },
  ];

  const handleNotificationClick = (notif) => {
    setNotificationsList(prev => prev.map(n => n.id === notif.id ? {...n, read: true} : n));
    if (notif.type === 'detection') setSelectedNotification(notif);
    setShowNotifications(false);
  };

  return (
    <div className="h-screen bg-[#0d0d0d] text-white overflow-hidden flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0d0d0d]" />
      </div>

      <header className="relative z-50 border-b border-green-500/20 bg-[#0d0d0d]/95 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <img src={logo} alt="SKEYE.AI" className="h-8 w-auto" />
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">LIVE</span>
              <span className="text-sm font-mono text-green-400">{activeDevices.toLocaleString()}</span>
              <span className="text-xs text-gray-500">devices</span>
            </div>
            <div className="h-4 w-px bg-gray-700" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-green-400">{totalDetections.toLocaleString()}</span>
              <span className="text-xs text-gray-500">detections</span>
            </div>
            <div className="h-4 w-px bg-gray-700" />
            <div className="text-xs font-mono text-gray-400">{time.toLocaleTimeString('en-US', { hour12: false })} UTC</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }} className="relative p-2 hover:bg-white/5 rounded-lg">
                <Bell className="w-5 h-5 text-gray-400" />
                {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-[#141414] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-800"><h3 className="font-semibold text-white">Notifications</h3></div>
                  <div className="max-h-96 overflow-y-auto">
                    {notificationsList.map((notif) => (
                      <div key={notif.id} onClick={() => handleNotificationClick(notif)} className={`p-3 border-b border-gray-800/50 hover:bg-white/5 cursor-pointer ${!notif.read ? 'bg-green-500/5' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notif.type === 'detection' ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
                            {notif.type === 'detection' ? <Eye className="w-4 h-4 text-purple-400" /> : <MessageCircle className="w-4 h-4 text-blue-400" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white">{notif.type === 'detection' ? notif.device : notif.user}</p>
                            <p className="text-xs text-gray-400">{notif.message}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }} className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-green-500/50">
                <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
              </button>
              {showProfile && (
                <div className="absolute right-0 top-12 w-72 bg-[#141414] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-green-500/10 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden"><img src={profileImg} alt="Profile" className="w-full h-full object-cover" /></div>
                      <div><p className="font-semibold text-white">John Doe</p><p className="text-xs text-gray-400">john@example.com</p></div>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="text-center"><p className="text-lg font-bold text-green-400">12,450</p><p className="text-[10px] text-gray-500">$SKEYE</p></div>
                      <div className="text-center"><p className="text-lg font-bold text-white">156</p><p className="text-[10px] text-gray-500">Classifications</p></div>
                      <div className="text-center"><p className="text-lg font-bold text-white">#47</p><p className="text-[10px] text-gray-500">Rank</p></div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-left"><User className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-300">Edit Profile</span></button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-left"><Settings className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-300">Settings</span></button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-left"><CreditCard className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-300">Subscription</span><span className="text-xs text-green-400">Pro</span></button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-left"><HardDrive className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-300">Storage</span><span className="text-xs text-gray-500">45/100GB</span></button>
                    <div className="border-t border-gray-800 mt-2 pt-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-500/10 rounded-lg text-left"><LogOut className="w-4 h-4 text-red-400" /><span className="text-sm text-red-400">Sign Out</span></button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 overflow-hidden" onClick={() => { setShowNotifications(false); setShowProfile(false); }}>
        <nav className="w-16 border-r border-green-500/10 bg-[#0d0d0d]/80 flex flex-col items-center py-4 flex-shrink-0">
          {publicTabs.map((tab) => {
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
          <div className="w-10 h-px bg-gray-700 my-3" />
          {privateTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all mb-1 ${isActive ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 text-green-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-r-full" />}
                <Icon className="w-5 h-5" />
                <span className="text-[8px] font-medium leading-tight text-center">{tab.label.replace(' ', '\n')}</span>
              </button>
            );
          })}
        </nav>

        <main className="flex-1 overflow-hidden">
          {activeTab === 'map' && <GlobalMapView />}
          {activeTab === 'trending' && <TrendingView clips={mockClips} selectedClip={selectedClip} setSelectedClip={setSelectedClip} viewMode={viewMode} setViewMode={setViewMode} />}
          {activeTab === 'classify' && <ClassifyView />}
          {activeTab === 'community' && <CommunityView />}
          {activeTab === 'devices' && <DevicesView devices={mockDevices} />}
          {activeTab === 'myclips' && <MyClipsView clips={myClips} />}
        </main>
      </div>

      {selectedNotification && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedNotification(null)}>
          <div className="bg-[#141414] rounded-2xl border border-green-500/20 w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div><h3 className="font-semibold text-white">{selectedNotification.device}</h3><p className="text-xs text-gray-400">{selectedNotification.message}</p></div>
              <button onClick={() => setSelectedNotification(null)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="aspect-video bg-black"><iframe src={`https://www.youtube.com/embed/${selectedNotification.videoId}?rel=0`} className="w-full h-full" allowFullScreen title="Detection" /></div>
            <div className="p-4">
              <h4 className="text-sm font-semibold text-white mb-3">Classify this detection</h4>
              <div className="flex flex-wrap gap-2">
                {classificationOptions.map((opt) => (<button key={opt.id} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300">{opt.label}</button>))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GlobalMapView() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const heatLayerRef = useRef(null);
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [sightings, setSightings] = useState(allSightings);
  const [timeRange, setTimeRange] = useState('24h');
  const [activeFilters, setActiveFilters] = useState(['Unknown', 'Drone', 'Aircraft', 'Bird', 'Weather']);
  const [searchQuery, setSearchQuery] = useState('');
  const [userClassification, setUserClassification] = useState(null);

  const getFilteredByTime = (list) => {
    const range = timeRanges.find(r => r.id === timeRange);
    if (!range || range.hours === Infinity) return list;
    const cutoff = Date.now() - range.hours * 60 * 60 * 1000;
    return list.filter(s => s.timestamp >= cutoff);
  };

  const filteredSightings = getFilteredByTime(sightings).filter(s => activeFilters.includes(s.type));

  useEffect(() => {
    const interval = setInterval(() => {
      const cities = [{ city: 'Tokyo', lat: 35.6762, lng: 139.6503 }, { city: 'London', lat: 51.5074, lng: -0.1278 }, { city: 'New York', lat: 40.7128, lng: -74.0060 }, { city: 'Sydney', lat: -33.8688, lng: 151.2093 }, { city: 'Dubai', lat: 25.2048, lng: 55.2708 }];
      const types = ['Unknown', 'Drone', 'Aircraft', 'Bird', 'Weather'];
      const videoIds = ['QKHg-vnTFsM', 'u1hNYs55sqs', '2TumprpOwHY'];
      const city = cities[Math.floor(Math.random() * cities.length)];
      setSightings(prev => [{ id: Date.now(), lat: city.lat + (Math.random() - 0.5) * 0.3, lng: city.lng + (Math.random() - 0.5) * 0.3, type: types[Math.floor(Math.random() * types.length)], intensity: 0.5 + Math.random() * 0.5, city: city.city, timestamp: Date.now(), time: 'Just now', videoId: videoIds[Math.floor(Math.random() * videoIds.length)] }, ...prev].slice(0, 600));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link'); link.id = 'leaflet-css'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; link.rel = 'stylesheet'; document.head.appendChild(link);
    }
    const loadScripts = async () => {
      if (!window.L) { await new Promise(r => { const s = document.createElement('script'); s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.onload = r; document.head.appendChild(s); }); }
      if (!window.L.heatLayer) { await new Promise(r => { const s = document.createElement('script'); s.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js'; s.onload = r; document.head.appendChild(s); }); }
      initMap();
    };
    loadScripts();
    function initMap() {
      if (mapRef.current) return;
      mapRef.current = window.L.map(mapContainerRef.current, { center: [39.8, -98.5], zoom: 4, minZoom: 2, maxZoom: 18, zoomControl: false, attributionControl: false, maxBounds: [[-85, -180], [85, 180]], maxBoundsViscosity: 1.0 });
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, subdomains: 'abcd', noWrap: true }).addTo(mapRef.current);
      window.L.control.zoom({ position: 'topright' }).addTo(mapRef.current);
      setMapReady(true);
    }
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapRef.current) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data?.[0]) mapRef.current.flyTo([parseFloat(data[0].lat), parseFloat(data[0].lon)], 10, { duration: 2 });
    } catch (e) {}
  };

  useEffect(() => {
    if (!mapRef.current || !mapReady || !window.L) return;
    markersRef.current.forEach(m => m.remove()); markersRef.current = [];
    if (heatLayerRef.current) mapRef.current.removeLayer(heatLayerRef.current);
    if (window.L.heatLayer) {
      heatLayerRef.current = window.L.heatLayer(filteredSightings.map(s => [s.lat, s.lng, s.intensity]), { radius: 35, blur: 25, maxZoom: 10, gradient: { 0.2: '#22c55e', 0.4: '#84cc16', 0.6: '#eab308', 0.8: '#f97316', 1: '#ef4444' } }).addTo(mapRef.current);
    }
    filteredSightings.slice(0, 100).forEach(item => {
      const colors = { Unknown: '#a855f7', Drone: '#3b82f6', Aircraft: '#22c55e', Bird: '#eab308', Weather: '#06b6d4' };
      const color = colors[item.type];
      const icon = window.L.divIcon({ html: `<div style="position:relative;width:20px;height:20px;"><div style="position:absolute;width:30px;height:30px;left:-5px;top:-5px;border-radius:50%;background:${color}40;animation:pulse 2s ease-out infinite;"></div><div style="position:absolute;width:12px;height:12px;left:4px;top:4px;border-radius:50%;background:${color};border:2px solid rgba(0,0,0,0.3);"></div></div>`, className: 'custom-marker', iconSize: [20, 20], iconAnchor: [10, 10] });
      const marker = window.L.marker([item.lat, item.lng], { icon }).addTo(mapRef.current);
      marker.on('click', () => setSelectedSighting(item));
      markersRef.current.push(marker);
    });
    if (!document.getElementById('marker-pulse-styles')) { const s = document.createElement('style'); s.id = 'marker-pulse-styles'; s.textContent = '@keyframes pulse{0%{transform:scale(0.5);opacity:1}100%{transform:scale(2);opacity:0}}.custom-marker{background:transparent!important;border:none!important}'; document.head.appendChild(s); }
  }, [filteredSightings, mapReady]);

  const toggleFilter = (id) => setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  return (
    <div className="h-full flex">
      <div className="flex-1 relative overflow-hidden">
        <div ref={mapContainerRef} className="absolute inset-0 bg-[#141414]" />
        <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSearch()} placeholder="Search location..." className="w-64 pl-9 pr-3 py-2 bg-[#141414]/90 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50" /></div>
          <button onClick={handleSearch} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30">Go</button>
        </div>
        <div className="absolute top-4 right-16 z-[1000]">
          <div className="bg-[#141414]/90 rounded-lg border border-gray-700 p-1 flex gap-1">
            {timeRanges.map(r => (<button key={r.id} onClick={() => setTimeRange(r.id)} className={`px-3 py-1.5 text-xs font-medium rounded ${timeRange === r.id ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'}`}>{r.label}</button>))}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 bg-[#141414]/90 rounded-lg border border-gray-700 p-3 z-[1000]">
          <h4 className="text-xs font-semibold text-gray-400 mb-2">FILTER BY TYPE</h4>
          <div className="space-y-1">
            {classificationOptions.map(opt => {
              const isActive = activeFilters.includes(opt.id);
              return (<button key={opt.id} onClick={() => toggleFilter(opt.id)} className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded ${isActive ? 'bg-white/5' : 'opacity-40'}`}><div className="w-3 h-3 rounded-full" style={{ backgroundColor: opt.color }} /><span className="text-xs text-gray-300 flex-1">{opt.label}</span>{isActive && <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />}</button>);
            })}
          </div>
        </div>
        {selectedSighting && (
          <div className="absolute top-20 left-4 w-80 bg-[#141414]/95 rounded-xl border border-gray-700 overflow-hidden z-[1000]">
            <div className="aspect-video bg-black"><iframe src={`https://www.youtube.com/embed/${selectedSighting.videoId}?rel=0`} className="w-full h-full" allowFullScreen title="Sighting" /></div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2"><div><h3 className="font-semibold text-white">{selectedSighting.city}</h3><p className="text-xs text-gray-400">{selectedSighting.time}</p></div><button onClick={() => setSelectedSighting(null)} className="text-gray-400 hover:text-white">&times;</button></div>
              <div className={`inline-block px-2 py-1 rounded text-xs font-bold mb-3`} style={{ backgroundColor: `${classificationOptions.find(o => o.id === selectedSighting.type)?.color}33`, color: classificationOptions.find(o => o.id === selectedSighting.type)?.color }}>{selectedSighting.type}</div>
              <h4 className="text-xs font-semibold text-gray-400 mb-2">CLASSIFY</h4>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {classificationOptions.map(opt => (<button key={opt.id} onClick={() => setUserClassification(opt.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${userClassification === opt.id ? 'bg-green-500/20 text-green-400 border border-green-500' : 'bg-gray-800 text-gray-400 border border-transparent hover:bg-gray-700'}`}>{opt.label}</button>))}
              </div>
              <button disabled={!userClassification} className={`w-full py-2 rounded-lg text-xs font-medium ${userClassification ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>Submit (+50 $SKEYE)</button>
            </div>
          </div>
        )}
      </div>
      <div className="w-72 border-l border-green-500/10 bg-[#0d0d0d]/90 flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-green-500/10"><h3 className="text-sm font-semibold text-white flex items-center gap-2"><Radio className="w-4 h-4 text-green-400 animate-pulse" />Live Activity Feed</h3><p className="text-[10px] text-gray-500 mt-1">{filteredSightings.length} sightings</p></div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredSightings.slice(0, 50).map(s => (
            <div key={s.id} className="p-3 bg-white/5 rounded-lg hover:border-green-500/30 cursor-pointer" onClick={() => setSelectedSighting(s)}>
              <div className="flex items-start justify-between"><div className="flex items-center gap-2"><Eye className="w-4 h-4" style={{ color: classificationOptions.find(o => o.id === s.type)?.color }} /><span className="text-xs text-gray-400">{s.city}</span></div><span className="text-[10px] text-gray-500">{s.time}</span></div>
              <div className="mt-2 flex items-center justify-between"><span className="text-sm text-white">{s.type} detected</span><span className={`text-xs px-2 py-0.5 rounded ${s.intensity >= 0.8 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{Math.round(s.intensity * 100)}%</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrendingView({ clips, selectedClip, setSelectedClip, viewMode, setViewMode }) {
  const [filter, setFilter] = useState('all');
  const [playingClipId, setPlayingClipId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [clipComments, setClipComments] = useState({});
  const filteredClips = clips.filter(clip => filter === 'all' || (filter === 'unknown' && clip.classification === 'Unknown') || (filter === 'verified' && clip.verified));

  const handlePlayClick = (e, clip) => { e.stopPropagation(); setSelectedClip(clip); };
  
  const handleAddComment = () => {
    if (!newComment.trim() || !selectedClip) return;
    setClipComments(prev => ({ ...prev, [selectedClip.id]: [...(prev[selectedClip.id] || selectedClip.comments), { user: 'You', text: newComment, time: 'Just now' }] }));
    setNewComment('');
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div><h2 className="text-2xl font-bold text-white">Trending Clips</h2><p className="text-sm text-gray-400 mt-1">Latest footage from the global network</p></div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/5 rounded-lg p-1">
              {[{ id: 'all', label: 'All' }, { id: 'unknown', label: 'Unknown' }, { id: 'verified', label: 'Verified' }].map(f => (<button key={f.id} onClick={() => setFilter(f.id)} className={`px-3 py-1.5 text-xs font-medium rounded ${filter === f.id ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'}`}>{f.label}</button>))}
            </div>
            <div className="flex items-center bg-white/5 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-500/20 text-green-400' : 'text-gray-400'}`}><Grid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-500/20 text-green-400' : 'text-gray-400'}`}><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredClips.map(clip => (
            <div key={clip.id} onClick={() => setSelectedClip(clip)} className="group cursor-pointer rounded-2xl border border-transparent hover:border-green-500/30 bg-white/5 overflow-hidden">
              {viewMode === 'list' ? (
                <div className="flex items-stretch gap-4 p-3">
                  <div className="relative bg-black w-44 h-24 flex-shrink-0 overflow-hidden rounded-xl">
                    <img src={`https://img.youtube.com/vi/${clip.videoId}/mqdefault.jpg`} alt={clip.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30" onClick={e => handlePlayClick(e, clip)}><div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-green-500/30"><Play className="w-4 h-4 text-white ml-0.5" /></div></div>
                    <div className="absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold uppercase bg-purple-500 text-white">{clip.classification}</div>
                  </div>
                  <div className="flex-1 py-1">
                    <h3 className="font-semibold text-white group-hover:text-green-400">{clip.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400"><MapPin className="w-3 h-3" />{clip.location}<span className="text-gray-600">•</span>{clip.timestamp}</div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{clip.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{clip.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{clip.comments.length}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative bg-black aspect-video overflow-hidden">
                    <img src={`https://img.youtube.com/vi/${clip.videoId}/mqdefault.jpg`} alt={clip.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30" onClick={e => handlePlayClick(e, clip)}><div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-green-500/30"><Play className="w-5 h-5 text-white ml-0.5" /></div></div>
                    <div className="absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold uppercase bg-purple-500 text-white">{clip.classification}</div>
                  </div>
                  <div className="p-4"><h3 className="font-semibold text-white group-hover:text-green-400 line-clamp-1">{clip.title}</h3><div className="flex items-center gap-2 mt-2 text-xs text-gray-400"><MapPin className="w-3 h-3" />{clip.location}</div><div className="flex items-center gap-3 mt-2 text-xs text-gray-500"><span>{clip.views.toLocaleString()} views</span><span>{clip.likes} likes</span></div></div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {selectedClip && (
        <div className="w-[420px] border-l border-green-500/10 bg-[#0d0d0d]/90 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-800"><h3 className="font-semibold text-white">Clip Details</h3><button onClick={() => setSelectedClip(null)} className="text-gray-400 hover:text-white text-xl">&times;</button></div>
          <div className="flex-1 overflow-y-auto">
            <div className="aspect-video bg-black"><iframe src={`https://www.youtube.com/embed/${selectedClip.videoId}?rel=0`} className="w-full h-full" allowFullScreen title={selectedClip.title} /></div>
            <div className="p-4">
              <h4 className="font-semibold text-white">{selectedClip.title}</h4>
              <p className="text-sm text-gray-400 mt-1">{selectedClip.location} • {selectedClip.timestamp}</p>
              <div className="flex items-center gap-4 mt-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10"><ThumbsUp className="w-4 h-4 text-green-400" /><span className="text-sm text-white">{selectedClip.likes}</span></button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10"><ThumbsDown className="w-4 h-4 text-gray-400" /><span className="text-sm text-white">{selectedClip.dislikes}</span></button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10"><Share2 className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="mt-4 p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between"><span className="text-xs text-gray-400 uppercase">Classification</span><span className="px-2 py-1 rounded text-xs font-bold bg-purple-500/20 text-purple-400">{selectedClip.classification}</span></div>
                <div className="mt-3"><div className="flex items-center justify-between text-xs mb-1"><span className="text-gray-400">Confidence</span><span className="text-green-400">{selectedClip.confidence}%</span></div><div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: `${selectedClip.confidence}%` }} /></div></div>
              </div>
              <div className="mt-4">
                <h5 className="text-sm font-semibold text-white mb-3">Comments ({(clipComments[selectedClip.id] || selectedClip.comments).length})</h5>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {(clipComments[selectedClip.id] || selectedClip.comments).map((c, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400/30 to-green-600/30 flex items-center justify-center text-xs font-bold text-green-400">{c.user[0]}</div>
                      <div className="flex-1"><div className="flex items-center gap-2"><span className="text-sm font-medium text-white">{c.user}</span><span className="text-[10px] text-gray-500">{c.time}</span></div><p className="text-sm text-gray-300 mt-1">{c.text}</p></div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddComment()} placeholder="Add a comment..." className="flex-1 px-3 py-2 bg-white/5 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50" />
                  <button onClick={handleAddComment} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"><Send className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClassifyView() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [animating, setAnimating] = useState(null);
  const currentClip = classifyClips[currentIndex];

  const handleClassify = (classification) => {
    setAnimating(classification);
    setHistory(prev => [...prev, { index: currentIndex, classification }]);
    setTimeout(() => {
      setAnimating(null);
      setCurrentIndex(prev => (prev + 1) % classifyClips.length);
    }, 300);
  };

  const handlePrevious = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentIndex(last.index);
  };

  const handleSkip = () => {
    setAnimating('skip');
    setTimeout(() => {
      setAnimating(null);
      setCurrentIndex(prev => (prev + 1) % classifyClips.length);
    }, 300);
  };

  return (
    <div className="h-full flex items-center justify-center p-5 bg-[#0d0d0d]">
      <div className="w-full max-w-2xl">
        <div className={`bg-[#141414]/90 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl transition-all duration-300 ${animating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
          <div className="aspect-video bg-black relative">
            <iframe key={currentClip.videoId} src={`https://www.youtube.com/embed/${currentClip.videoId}?rel=0`} className="w-full h-full" allowFullScreen title={currentClip.title} />
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur rounded-lg border border-gray-700">
              <span className="text-xs text-gray-400">Clip {currentIndex + 1} of {classifyClips.length}</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-lg font-semibold text-white drop-shadow-lg">{currentClip.title}</h3>
              <p className="text-sm text-gray-300 drop-shadow-lg">{currentClip.location}</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-400">SELECT CLASSIFICATION</h4>
              <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/30">
                <Zap className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-semibold">+50 $SKEYE</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {classificationOptions.map(opt => (
                <button key={opt.id} onClick={() => handleClassify(opt.id)} className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: `${opt.color}20`, color: opt.color, border: `1px solid ${opt.color}40` }}>
                  {opt.label}
                </button>
              ))}
              <button onClick={handleSkip} className="px-6 py-3 rounded-xl text-sm font-semibold bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all">
                Skip
              </button>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
              <button onClick={handlePrevious} disabled={history.length === 0} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${history.length > 0 ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 cursor-not-allowed'}`}>
                <SkipBack className="w-4 h-4" />Previous
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Classified today:</span>
                <span className="text-sm font-bold text-green-400">{history.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunityView() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [sortBy, setSortBy] = useState('hot');
  const [showNewPost, setShowNewPost] = useState(false);
  const [posts, setPosts] = useState(communityPosts);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const handleVote = (postId, type) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, upvotes: type === 'up' ? p.upvotes + 1 : p.upvotes, downvotes: type === 'down' ? p.downvotes + 1 : p.downvotes } : p));
  };

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    setPosts([{ id: Date.now(), category: activeCategory, title: newPostTitle, author: 'You', avatar: 'Y', time: 'Just now', upvotes: 1, downvotes: 0, comments: 0, pinned: false, content: newPostContent }, ...posts]);
    setNewPostTitle(''); setNewPostContent(''); setShowNewPost(false);
  };

  const filteredPosts = posts.filter(p => activeCategory === 'general' ? true : p.category === activeCategory);

  return (
    <div className="h-full flex">
      <div className="w-64 border-r border-green-500/10 bg-[#0d0d0d]/90 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-green-500/10"><h3 className="font-semibold text-white">Categories</h3></div>
        <div className="p-2">
          {communityCategories.map(cat => {
            const Icon = cat.icon;
            return (<button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left ${activeCategory === cat.id ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Icon className="w-4 h-4" /><span className="flex-1 text-sm">{cat.name}</span><span className="text-xs text-gray-500">{cat.count}</span></button>);
          })}
        </div>
        <div className="p-4 border-t border-green-500/10">
          <button onClick={() => setShowNewPost(true)} className="w-full py-2.5 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-green-500/30">+ New Post</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-white">{communityCategories.find(c => c.id === activeCategory)?.name || 'Community'}</h2>
            <div className="flex items-center bg-white/5 rounded-lg p-1">
              {['hot', 'new', 'top'].map(s => (<button key={s} onClick={() => setSortBy(s)} className={`px-3 py-1.5 text-xs font-medium rounded capitalize ${sortBy === s ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'}`}>{s}</button>))}
            </div>
          </div>
          <div className="space-y-3">
            {filteredPosts.map(post => (
              <div key={post.id} className="p-4 bg-white/5 rounded-2xl hover:border-green-500/30 border border-transparent">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <button onClick={() => handleVote(post.id, 'up')} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-green-400"><ChevronUp className="w-5 h-5" /></button>
                    <span className="text-sm font-semibold text-white">{post.upvotes - post.downvotes}</span>
                    <button onClick={() => handleVote(post.id, 'down')} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-red-400"><ChevronDown className="w-5 h-5" /></button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.pinned && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold rounded">PINNED</span>}
                      {post.verified && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded">OFFICIAL</span>}
                    </div>
                    <h3 className="font-semibold text-white mt-1 hover:text-green-400 cursor-pointer">{post.title}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>{post.author}</span><span>{post.time}</span>
                      <div className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.comments}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-72 border-l border-green-500/10 bg-[#0d0d0d]/90 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-green-500/10"><h3 className="font-semibold text-white flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" />Top Contributors</h3></div>
        <div className="p-4 space-y-2">
          {[{ rank: 1, name: 'SkyHunter_Pro', points: 45680, badge: '👑' }, { rank: 2, name: 'NightOwl_TX', points: 38920, badge: '🥈' }, { rank: 3, name: 'TruthSeeker', points: 32100, badge: '🥉' }].map(user => (
            <div key={user.rank} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5">
              <span className="w-6 text-center font-bold text-yellow-400">{user.badge}</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center text-sm font-bold text-green-400">{user.name[0]}</div>
              <span className="flex-1 text-sm text-white truncate">{user.name}</span>
              <span className="text-sm text-green-400 font-semibold">{user.points.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      {showNewPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewPost(false)}>
          <div className="bg-[#141414] rounded-2xl border border-green-500/20 w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800"><h3 className="font-semibold text-white">Create New Post</h3><button onClick={() => setShowNewPost(false)} className="text-gray-400 hover:text-white">&times;</button></div>
            <div className="p-4 space-y-4">
              <div><label className="block text-xs text-gray-400 mb-2">Title</label><input type="text" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50" placeholder="Enter a title..." /></div>
              <div><label className="block text-xs text-gray-400 mb-2">Content</label><textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50 h-32 resize-none" placeholder="What's on your mind?" /></div>
            </div>
            <div className="p-4 border-t border-gray-800 flex justify-end gap-2">
              <button onClick={() => setShowNewPost(false)} className="px-4 py-2 text-gray-400 hover:bg-white/5 rounded-lg text-sm">Cancel</button>
              <button onClick={handleCreatePost} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DevicesView({ devices }) {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const openModal = (type, device) => { setSelectedDevice(device); setActiveModal(type); };
  const closeModal = () => { setActiveModal(null); setSelectedDevice(null); };

  return (
    <div className="h-full p-5 overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <div><h2 className="text-2xl font-bold text-white">My Devices</h2><p className="text-sm text-gray-400 mt-1">Manage your Skeye camera network</p></div>
        <button onClick={() => setShowAddDevice(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-green-500/30"><Plus className="w-4 h-4" />Add Device</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {devices.map(device => (
          <div key={device.id} className={`relative p-5 rounded-2xl border ${device.status === 'online' ? 'bg-gradient-to-br from-green-500/5 to-transparent border-green-500/20 hover:border-green-500/40' : 'bg-gradient-to-br from-gray-800/30 to-transparent border-gray-700/50'}`}>
            <div className={`absolute top-4 right-4 flex items-center gap-2 px-2 py-1 rounded-full text-xs ${device.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              {device.status === 'online' ? 'Live' : 'Offline'}
            </div>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 flex items-center justify-center"><img src={cameraImg} alt="Camera" className="w-full h-full object-contain" /></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{device.name}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{device.location}</p>
                <p className="text-xs text-gray-500 font-mono mt-1">S/N: {device.serial}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1"><Wifi className={`w-4 h-4 ${device.signal > 80 ? 'text-green-400' : device.signal > 0 ? 'text-yellow-400' : 'text-red-400'}`} /><span className="text-xs text-gray-400">{device.signal > 0 ? `${device.signal}%` : 'N/A'}</span></div>
                  <div className="flex items-center gap-1"><Eye className="w-4 h-4 text-green-400" /><span className="text-xs text-gray-400">{device.detections} detections</span></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-800/50">
              <button onClick={() => openModal('feed', device)} disabled={device.status !== 'online'} className={`flex-1 py-2.5 text-xs font-medium rounded-lg ${device.status === 'online' ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'}`}>View Feed</button>
              <button onClick={() => openModal('settings', device)} className="flex-1 py-2.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">Settings</button>
              <button onClick={() => openModal('history', device)} className="flex-1 py-2.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">History</button>
            </div>
          </div>
        ))}
      </div>

      {activeModal === 'feed' && selectedDevice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-[#141414] rounded-2xl border border-green-500/20 w-full max-w-4xl overflow-hidden" onClick={e => e.stopPropagation()}>
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
                <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                <div className="flex flex-col gap-2">
                  <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><ChevronUp className="w-5 h-5" /></button>
                  <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><ChevronDown className="w-5 h-5" /></button>
                </div>
                <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                <div className="w-px h-12 bg-gray-700 mx-4" />
                <div className="flex items-center gap-2">
                  <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-lg font-bold">−</button>
                  <span className="text-xs text-gray-400 w-12 text-center">Zoom</span>
                  <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Plus className="w-5 h-5" /></button>
                </div>
                <div className="w-px h-12 bg-gray-700 mx-4" />
                <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Volume2 className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'settings' && selectedDevice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-[#141414] rounded-2xl border border-green-500/20 w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800"><h3 className="font-semibold text-white flex items-center gap-2"><Settings className="w-5 h-5 text-green-400" />Device Settings</h3><button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button></div>
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
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
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'history' && selectedDevice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-[#141414] rounded-2xl border border-green-500/20 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800"><h3 className="font-semibold text-white">{selectedDevice.name} - Detection History</h3><button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {[{ time: 'Today, 9:34 PM', type: 'Unknown', duration: '0:32', confidence: 87 }, { time: 'Today, 8:12 PM', type: 'Aircraft', duration: '0:18', confidence: 94 }, { time: 'Today, 6:45 PM', type: 'Drone', duration: '1:24', confidence: 91 }, { time: 'Yesterday, 11:23 PM', type: 'Unknown', duration: '0:45', confidence: 76 }, { time: 'Yesterday, 9:15 PM', type: 'Bird', duration: '0:12', confidence: 89 }].map((clip, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer">
                  <div className="w-20 h-14 bg-gray-800 rounded-lg flex items-center justify-center relative"><Play className="w-5 h-5 text-gray-500" /><span className="absolute bottom-1 right-1 text-[10px] bg-black/60 px-1 rounded">{clip.duration}</span></div>
                  <div className="flex-1"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${clip.type === 'Unknown' ? 'bg-purple-500/20 text-purple-400' : clip.type === 'Drone' ? 'bg-blue-500/20 text-blue-400' : clip.type === 'Bird' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>{clip.type}</span><p className="text-xs text-gray-400 mt-1">{clip.time}</p></div>
                  <span className="text-xs text-green-400 font-medium">{clip.confidence}%</span>
                  <div className="flex gap-1"><button className="p-2 hover:bg-white/10 rounded-lg"><Download className="w-4 h-4 text-gray-400" /></button><button className="p-2 hover:bg-white/10 rounded-lg"><Share2 className="w-4 h-4 text-gray-400" /></button></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAddDevice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddDevice(false)}>
          <div className="bg-[#141414] rounded-2xl border border-green-500/20 w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800"><h3 className="font-semibold text-white">Add New Device</h3><button onClick={() => setShowAddDevice(false)} className="text-gray-400 hover:text-white text-xl">&times;</button></div>
            <div className="p-6 text-center">
              <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4"><Camera className="w-10 h-10 text-green-400" /></div>
              <h4 className="text-lg font-semibold text-white">Connect Your Skeye Camera</h4>
              <p className="text-sm text-gray-400 mt-2">Make sure your camera is powered on and in pairing mode (blue LED blinking)</p>
              <div className="mt-6 space-y-3">
                <button className="w-full py-3 bg-green-500/10 text-green-400 rounded-xl font-medium hover:bg-green-500/20 transition-colors">Scan QR Code</button>
                <button className="w-full py-3 bg-white/5 text-gray-300 rounded-xl font-medium hover:bg-white/10 transition-colors">Enter Serial Number Manually</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MyClipsView({ clips }) {
  const [selectedClip, setSelectedClip] = useState(null);
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const uniqueDevices = [...new Set(clips.map(c => c.device))];
  const filteredClips = deviceFilter === 'all' ? clips : clips.filter(c => c.device === deviceFilter);

  return (
    <div className="h-full p-5 overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <div><h2 className="text-2xl font-bold text-white">My Clips</h2><p className="text-sm text-gray-400 mt-1">All detections from your devices</p></div>
        <div className="flex items-center gap-3">
          <select value={deviceFilter} onChange={e => setDeviceFilter(e.target.value)} className="bg-white/5 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
            <option value="all">All Devices</option>
            {uniqueDevices.map(d => (<option key={d} value={d}>{d}</option>))}
          </select>
          <div className="flex bg-white/5 rounded-lg p-1">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-500/20 text-green-400' : 'text-gray-400'}`}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-500/20 text-green-400' : 'text-gray-400'}`}><List className="w-4 h-4" /></button>
          </div>
          <span className="text-sm text-gray-400">{filteredClips.length} clips</span>
        </div>
      </div>
      {viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredClips.map(clip => (
            <div key={clip.id} onClick={() => setSelectedClip(clip)} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-transparent hover:border-green-500/30 cursor-pointer">
              <div className="w-32 h-20 bg-black rounded-xl overflow-hidden relative flex-shrink-0">
                <img src={`https://img.youtube.com/vi/${clip.videoId}/mqdefault.jpg`} alt="Clip" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30"><Play className="w-8 h-8 text-white" /></div>
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-[10px] text-white">{clip.duration}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><Camera className="w-4 h-4 text-gray-500" /><span className="text-sm font-medium text-white">{clip.device}</span></div>
                <p className="text-xs text-gray-400 mt-1">{clip.time}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: `${classificationOptions.find(o => o.id === clip.type)?.color}20`, color: classificationOptions.find(o => o.id === clip.type)?.color }}>{clip.type}</span>
                  <span className="text-xs text-gray-500">{clip.confidence}%</span>
                </div>
              </div>
              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                <button className="p-2 hover:bg-white/10 rounded-lg"><Download className="w-4 h-4 text-gray-400" /></button>
                <button className="p-2 hover:bg-white/10 rounded-lg"><Share2 className="w-4 h-4 text-gray-400" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClips.map(clip => (
            <div key={clip.id} onClick={() => setSelectedClip(clip)} className="bg-white/5 rounded-2xl overflow-hidden border border-transparent hover:border-green-500/30 cursor-pointer">
              <div className="aspect-video bg-black relative">
                <img src={`https://img.youtube.com/vi/${clip.videoId}/mqdefault.jpg`} alt="Clip" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30"><div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center"><Play className="w-5 h-5 text-white ml-0.5" /></div></div>
                <div className="absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold" style={{ backgroundColor: `${classificationOptions.find(o => o.id === clip.type)?.color}33`, color: classificationOptions.find(o => o.id === clip.type)?.color }}>{clip.type}</div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-[10px] text-white">{clip.duration}</div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2"><Camera className="w-4 h-4 text-gray-500" /><span className="text-sm text-white">{clip.device}</span></div>
                <p className="text-xs text-gray-400 mt-1">{clip.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedClip && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedClip(null)}>
          <div className="bg-[#141414] rounded-2xl border border-green-500/20 w-full max-w-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div><h3 className="font-semibold text-white">{selectedClip.device}</h3><p className="text-xs text-gray-400">{selectedClip.time}</p></div>
              <button onClick={() => setSelectedClip(null)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="aspect-video bg-black"><iframe src={`https://www.youtube.com/embed/${selectedClip.videoId}?autoplay=1&rel=0`} className="w-full h-full" allow="autoplay" allowFullScreen title="Clip" /></div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-lg text-sm font-semibold" style={{ backgroundColor: `${classificationOptions.find(o => o.id === selectedClip.type)?.color}20`, color: classificationOptions.find(o => o.id === selectedClip.type)?.color }}>{selectedClip.type}</span>
                <span className="text-sm text-gray-400">{selectedClip.confidence}% confidence</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-white/5 rounded-lg text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2"><Download className="w-4 h-4" />Download</button>
                <button className="px-4 py-2 bg-white/5 rounded-lg text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2"><Share2 className="w-4 h-4" />Share</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
