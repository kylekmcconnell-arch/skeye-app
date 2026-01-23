import { useState, useEffect, useRef } from 'react';
import { Camera, TrendingUp, Users, Bell, Search, Play, Eye, Zap, Globe, Shield, Radio, Wifi, AlertTriangle, MapPin, Grid, List, ThumbsUp, MessageCircle, Share2, Download, Plus, Minus, X, Settings, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Volume2, Save, Trash2, Circle, Target, Crosshair, Clock, Filter, Heart, Reply, Award, Lock, CreditCard, HardDrive, Mail, User, LogOut, ChevronDown, ChevronUp, Send, Bookmark, Flag, MoreHorizontal } from 'lucide-react';
import logo from './logo.png';
import cameraImg from './camera.png';

const mockDevices = [
  { id: 1, name: 'Home (Rooftop)', location: 'Lisbon, Portugal', status: 'online', detections: 127, signal: 98, lat: 38.7223, lng: -9.1393, serial: 'SKY-2024-0847-A1' },
  { id: 2, name: 'Home (Barn)', location: 'Lisbon, Portugal', status: 'online', detections: 89, signal: 92, lat: 38.7223, lng: -9.1393, serial: 'SKY-2024-1293-B2' },
  { id: 3, name: 'Lake House (Roof)', location: 'Austin, TX', status: 'offline', detections: 203, signal: 0, lat: 30.2672, lng: -97.7431, serial: 'SKY-2024-0156-C3' },
  { id: 4, name: 'Beach House (Roof)', location: 'San Diego, CA', status: 'online', detections: 56, signal: 87, lat: 32.7157, lng: -117.1611, serial: 'SKY-2024-2048-D4' },
];

const mockClips = [
  { id: 1, title: 'GIMBAL - Navy F/A-18 Encounter', location: 'East Coast, USA', timestamp: '2 min ago', views: 12400, classification: 'UAP', confidence: 87, verified: true, likes: 892, comments: 234, videoId: 'QKHg-vnTFsM' },
  { id: 2, title: 'GO FAST - High Speed Object', location: 'Atlantic Ocean', timestamp: '15 min ago', views: 8900, classification: 'UAP', confidence: 91, verified: true, likes: 456, comments: 123, videoId: 'u1hNYs55sqs' },
  { id: 3, title: 'FLIR1 Tic Tac - USS Nimitz', location: 'San Diego, CA', timestamp: '1 hour ago', views: 25600, classification: 'UAP', confidence: 96, verified: true, likes: 1834, comments: 567, videoId: '2TumprpOwHY' },
  { id: 4, title: 'Jellyfish UAP - Iraq 2018', location: 'Iraq', timestamp: '3 hours ago', views: 21000, classification: 'UAP', confidence: 72, verified: true, likes: 1567, comments: 445, videoId: 'dGOXuuhYoLk' },
];

const classifyClips = [
  { id: 1, videoId: 'QKHg-vnTFsM', title: 'Rotating Object - East Coast' },
  { id: 2, videoId: 'u1hNYs55sqs', title: 'High Speed Target - Atlantic' },
  { id: 3, videoId: '2TumprpOwHY', title: 'Tic Tac Shape - Pacific' },
  { id: 4, videoId: 'dGOXuuhYoLk', title: 'Unknown Object - Middle East' },
  { id: 5, videoId: 'SpeSpA3e56A', title: 'Night Vision Capture - Nevada' },
];

const initialSightings = [
  { id: 1, lat: 34.0522, lng: -118.2437, type: 'Unknown', intensity: 0.7, city: 'Los Angeles', time: '5 min ago', videoId: 'QKHg-vnTFsM' },
  { id: 2, lat: 40.7128, lng: -74.0060, type: 'Unknown', intensity: 0.95, city: 'New York', time: '1 min ago', videoId: 'u1hNYs55sqs' },
  { id: 3, lat: 33.4484, lng: -112.0740, type: 'Unknown', intensity: 0.85, city: 'Phoenix', time: '3 min ago', videoId: '2TumprpOwHY' },
  { id: 4, lat: 32.7157, lng: -117.1611, type: 'Aircraft', intensity: 0.5, city: 'San Diego', time: '10 min ago', videoId: 'dGOXuuhYoLk' },
  { id: 5, lat: 30.2672, lng: -97.7431, type: 'Unknown', intensity: 0.8, city: 'Austin', time: '7 min ago', videoId: 'QKHg-vnTFsM' },
  { id: 6, lat: 29.7604, lng: -95.3698, type: 'Drone', intensity: 0.6, city: 'Houston', time: '15 min ago', videoId: 'u1hNYs55sqs' },
  { id: 7, lat: 47.6062, lng: -122.3321, type: 'Unknown', intensity: 0.75, city: 'Seattle', time: '4 min ago', videoId: '2TumprpOwHY' },
  { id: 8, lat: 41.8781, lng: -87.6298, type: 'Unknown', intensity: 0.88, city: 'Chicago', time: '6 min ago', videoId: 'dGOXuuhYoLk' },
  { id: 9, lat: 39.7392, lng: -104.9903, type: 'Drone', intensity: 0.65, city: 'Denver', time: '12 min ago', videoId: 'QKHg-vnTFsM' },
  { id: 10, lat: 25.7617, lng: -80.1918, type: 'Unknown', intensity: 0.92, city: 'Miami', time: '3 min ago', videoId: 'u1hNYs55sqs' },
  { id: 11, lat: 36.1699, lng: -115.1398, type: 'Unknown', intensity: 0.78, city: 'Las Vegas', time: '8 min ago', videoId: '2TumprpOwHY' },
  { id: 12, lat: 33.749, lng: -84.388, type: 'Unknown', intensity: 0.82, city: 'Atlanta', time: '2 min ago', videoId: 'dGOXuuhYoLk' },
  { id: 13, lat: 42.3601, lng: -71.0589, type: 'Bird', intensity: 0.4, city: 'Boston', time: '20 min ago', videoId: 'QKHg-vnTFsM' },
  { id: 14, lat: 37.7749, lng: -122.4194, type: 'Unknown', intensity: 0.91, city: 'San Francisco', time: '1 min ago', videoId: 'u1hNYs55sqs' },
  { id: 15, lat: 34.0522, lng: -118.3, type: 'Unknown', intensity: 0.86, city: 'West LA', time: '4 min ago', videoId: '2TumprpOwHY' },
  { id: 16, lat: 34.1, lng: -118.2, type: 'Drone', intensity: 0.55, city: 'Pasadena', time: '18 min ago', videoId: 'dGOXuuhYoLk' },
  { id: 17, lat: 40.75, lng: -73.99, type: 'Unknown', intensity: 0.89, city: 'Manhattan', time: '2 min ago', videoId: 'QKHg-vnTFsM' },
  { id: 18, lat: 40.68, lng: -73.95, type: 'Unknown', intensity: 0.77, city: 'Brooklyn', time: '9 min ago', videoId: 'u1hNYs55sqs' },
  { id: 19, lat: 3.139, lng: 101.6869, type: 'Unknown', intensity: 0.84, city: 'Kuala Lumpur', time: '5 min ago', videoId: '2TumprpOwHY' },
  { id: 20, lat: 51.5074, lng: -0.1278, type: 'Unknown', intensity: 0.79, city: 'London', time: '7 min ago', videoId: 'dGOXuuhYoLk' },
  { id: 21, lat: 35.6762, lng: 139.6503, type: 'Unknown', intensity: 0.88, city: 'Tokyo', time: '3 min ago', videoId: 'QKHg-vnTFsM' },
  { id: 22, lat: 48.8566, lng: 2.3522, type: 'Drone', intensity: 0.52, city: 'Paris', time: '25 min ago', videoId: 'u1hNYs55sqs' },
];

const newSightingCities = [
  { city: 'Dallas', lat: 32.7767, lng: -96.7970 },
  { city: 'Portland', lat: 45.5152, lng: -122.6784 },
  { city: 'Detroit', lat: 42.3314, lng: -83.0458 },
  { city: 'Nashville', lat: 36.1627, lng: -86.7816 },
  { city: 'Salt Lake City', lat: 40.7608, lng: -111.8910 },
  { city: 'Orlando', lat: 28.5383, lng: -81.3792 },
  { city: 'Minneapolis', lat: 44.9778, lng: -93.2650 },
  { city: 'Cleveland', lat: 41.4993, lng: -81.6944 },
  { city: 'Tampa', lat: 27.9506, lng: -82.4572 },
  { city: 'Albuquerque', lat: 35.0844, lng: -106.6504 },
];

const notifications = [
  { id: 1, type: 'detection', device: 'Home (Rooftop)', message: 'Unknown object detected', time: '2 min ago', videoId: 'QKHg-vnTFsM', read: false },
  { id: 2, type: 'detection', device: 'Beach House (Roof)', message: 'Drone activity detected', time: '15 min ago', videoId: 'u1hNYs55sqs', read: false },
  { id: 3, type: 'comment', user: 'SkyWatcher_AZ', message: 'replied to your comment on "Phoenix Lights"', time: '1 hour ago', read: false },
  { id: 4, type: 'upvote', user: 'NightOwl_TX', message: 'upvoted your classification', time: '2 hours ago', read: true },
  { id: 5, type: 'detection', device: 'Home (Barn)', message: 'Aircraft passing overhead', time: '3 hours ago', videoId: '2TumprpOwHY', read: true },
];

const communityCategories = [
  { id: 'general', name: 'General Discussion', icon: MessageCircle, count: 1234 },
  { id: 'unclassified', name: 'Unclassified Detections', icon: Eye, count: 567 },
  { id: 'north-america', name: 'North America', icon: Globe, count: 892 },
  { id: 'europe', name: 'Europe', icon: Globe, count: 456 },
  { id: 'asia-pacific', name: 'Asia Pacific', icon: Globe, count: 234 },
  { id: 'equipment', name: 'Equipment & Setup', icon: Camera, count: 345 },
  { id: 'analysis', name: 'Analysis & Research', icon: Target, count: 189 },
];

const communityPosts = [
  { id: 1, category: 'north-america', title: 'Multiple sightings over Phoenix last night - anyone else see this?', author: 'SkyWatcher_AZ', avatar: 'S', time: '2 hours ago', upvotes: 234, comments: 89, pinned: true, content: 'Around 9:30 PM local time, I captured what appears to be a formation of 5 objects moving in perfect sync...' },
  { id: 2, category: 'unclassified', title: 'Need help identifying this object from my footage', author: 'NewObserver22', avatar: 'N', time: '4 hours ago', upvotes: 156, comments: 67, pinned: false, content: 'Captured this last night around midnight. The object seemed to hover for about 2 minutes before accelerating rapidly...' },
  { id: 3, category: 'general', title: 'Best camera settings for night sky monitoring?', author: 'TechExplorer', avatar: 'T', time: '6 hours ago', upvotes: 89, comments: 45, pinned: false, content: 'Looking to optimize my Skeye camera for better night captures. What ISO and exposure settings are you all using?' },
  { id: 4, category: 'equipment', title: 'New firmware update - improved detection accuracy', author: 'SkeyeOfficial', avatar: '✓', time: '1 day ago', upvotes: 567, comments: 123, pinned: true, verified: true, content: 'We\'ve just released firmware v2.4.1 with significant improvements to the AI detection algorithm...' },
  { id: 5, category: 'analysis', title: 'Statistical analysis of NJ drone swarm data', author: 'DataAnalyst99', avatar: 'D', time: '2 days ago', upvotes: 445, comments: 178, pinned: false, content: 'I\'ve compiled data from 47 separate sightings and found some interesting patterns...' },
  { id: 6, category: 'europe', title: 'Strange lights over London - 3 witnesses', author: 'UK_SkyWatch', avatar: 'U', time: '3 days ago', upvotes: 234, comments: 56, pinned: false, content: 'My neighbor and I both captured footage of unusual lights moving erratically over the Thames...' },
];

const classificationOptions = [
  { id: 'Unknown', label: 'Unknown', color: 'purple' },
  { id: 'Drone', label: 'Drone', color: 'blue' },
  { id: 'Aircraft', label: 'Aircraft', color: 'green' },
  { id: 'Bird', label: 'Bird', color: 'yellow' },
  { id: 'Weather', label: 'Weather', color: 'cyan' },
];

const timeRanges = [
  { id: '1h', label: '1 Hour' },
  { id: '24h', label: '24 Hours' },
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: 'all', label: 'All Time' },
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

  const tabs = [
    { id: 'map', label: 'Map', icon: Globe },
    { id: 'devices', label: 'Devices', icon: Camera },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'classify', label: 'Classify', icon: Eye },
    { id: 'community', label: 'Community', icon: Users },
  ];

  const handleNotificationClick = (notif) => {
    setNotificationsList(prev => prev.map(n => n.id === notif.id ? {...n, read: true} : n));
    if (notif.type === 'detection') {
      setSelectedNotification(notif);
    }
    setShowNotifications(false);
  };

  return (
    <div className="h-screen bg-gray-950 text-white overflow-hidden flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-600/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-50 border-b border-green-500/20 bg-gray-950/90 backdrop-blur-xl flex-shrink-0">
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
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search..." className="w-40 pl-9 pr-3 py-1.5 bg-white/5 border border-gray-800 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/50" />
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }} className="relative p-2 hover:bg-white/5 rounded-lg">
                <Bell className="w-5 h-5 text-gray-400" />
                {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <button className="text-xs text-green-400 hover:text-green-300">Mark all read</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notificationsList.map((notif) => (
                      <div key={notif.id} onClick={() => handleNotificationClick(notif)} className={`p-3 border-b border-gray-800/50 hover:bg-white/5 cursor-pointer transition-colors ${!notif.read ? 'bg-green-500/5' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'detection' ? 'bg-purple-500/20' : notif.type === 'comment' ? 'bg-blue-500/20' : 'bg-green-500/20'}`}>
                            {notif.type === 'detection' && <Eye className="w-4 h-4 text-purple-400" />}
                            {notif.type === 'comment' && <MessageCircle className="w-4 h-4 text-blue-400" />}
                            {notif.type === 'upvote' && <ThumbsUp className="w-4 h-4 text-green-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">{notif.type === 'detection' ? notif.device : notif.user}</p>
                            <p className="text-xs text-gray-400 truncate">{notif.message}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{notif.time}</p>
                          </div>
                          {!notif.read && <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }} className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xs font-bold cursor-pointer hover:shadow-lg hover:shadow-green-500/30 transition-all">
                JD
              </button>
              
              {showProfile && (
                <div className="absolute right-0 top-12 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-green-500/10 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-lg font-bold">JD</div>
                      <div>
                        <p className="font-semibold text-white">John Doe</p>
                        <p className="text-xs text-gray-400">john@example.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-400">12,450</p>
                        <p className="text-[10px] text-gray-500">$SKEYE</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-white">156</p>
                        <p className="text-[10px] text-gray-500">Classifications</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-white">#47</p>
                        <p className="text-[10px] text-gray-500">Rank</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">Edit Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left">
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <span className="text-sm text-gray-300">Subscription</span>
                        <span className="ml-2 text-xs text-green-400">Pro Plan</span>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left">
                      <HardDrive className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <span className="text-sm text-gray-300">Storage</span>
                        <span className="ml-2 text-xs text-gray-500">45GB / 100GB</span>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">Change Password</span>
                    </button>
                    <div className="border-t border-gray-800 mt-2 pt-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-500/10 rounded-lg transition-colors text-left">
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-400">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 overflow-hidden" onClick={() => { setShowNotifications(false); setShowProfile(false); }}>
        <nav className="w-16 border-r border-green-500/10 bg-gray-950/50 flex flex-col items-center py-4 gap-1 flex-shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${isActive ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 text-green-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-r-full" />}
                <Icon className="w-5 h-5" />
                <span className="text-[8px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <main className="flex-1 overflow-hidden">
          {activeTab === 'map' && <GlobalMapView devices={mockDevices} />}
          {activeTab === 'devices' && <DevicesView devices={mockDevices} />}
          {activeTab === 'trending' && <TrendingView clips={mockClips} selectedClip={selectedClip} setSelectedClip={setSelectedClip} viewMode={viewMode} setViewMode={setViewMode} />}
          {activeTab === 'classify' && <ClassifyView />}
          {activeTab === 'community' && <CommunityView />}
        </main>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedNotification(null)}>
          <div className="bg-gray-900 rounded-2xl border border-green-500/20 w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div>
                <h3 className="font-semibold text-white">{selectedNotification.device}</h3>
                <p className="text-xs text-gray-400">{selectedNotification.message} • {selectedNotification.time}</p>
              </div>
              <button onClick={() => setSelectedNotification(null)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="aspect-video bg-black">
              <iframe src={`https://www.youtube.com/embed/${selectedNotification.videoId}?autoplay=0&rel=0`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Detection" />
            </div>
            <div className="p-4">
              <h4 className="text-sm font-semibold text-white mb-3">Classify this detection</h4>
              <div className="flex flex-wrap gap-2">
                {classificationOptions.map((opt) => (
                  <button key={opt.id} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors">{opt.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GlobalMapView({ devices }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const heatLayerRef = useRef(null);
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [sightings, setSightings] = useState(initialSightings);
  const [timeRange, setTimeRange] = useState('24h');
  const [activeFilters, setActiveFilters] = useState(['Unknown', 'Drone', 'Aircraft', 'Bird', 'Weather']);
  const [searchQuery, setSearchQuery] = useState('');
  const [userClassification, setUserClassification] = useState(null);

  // Add new sightings periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const randomCity = newSightingCities[Math.floor(Math.random() * newSightingCities.length)];
      const types = ['Unknown', 'Drone', 'Aircraft', 'Bird', 'Weather'];
      const newSighting = {
        id: Date.now(),
        lat: randomCity.lat + (Math.random() - 0.5) * 0.5,
        lng: randomCity.lng + (Math.random() - 0.5) * 0.5,
        type: types[Math.floor(Math.random() * types.length)],
        intensity: 0.5 + Math.random() * 0.5,
        city: randomCity.city,
        time: 'Just now',
        videoId: classifyClips[Math.floor(Math.random() * classifyClips.length)].videoId
      };
      setSightings(prev => [newSighting, ...prev].slice(0, 50));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    const loadScripts = async () => {
      if (!window.L) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      
      if (!window.L.heatLayer) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      
      initMap();
    };

    loadScripts();

    function initMap() {
      if (mapRef.current) return;

      mapRef.current = window.L.map(mapContainerRef.current, {
        center: [39.8, -98.5],
        zoom: 4,
        zoomControl: false,
        attributionControl: false
      });

      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(mapRef.current);

      window.L.control.zoom({ position: 'topright' }).addTo(mapRef.current);

      setMapReady(true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle location search
  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapRef.current) return;
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        mapRef.current.flyTo([parseFloat(lat), parseFloat(lon)], 10, { duration: 2 });
      }
    } catch (error) {
      console.log('Search failed');
    }
  };

  // Update markers and heatmap
  useEffect(() => {
    if (!mapRef.current || !mapReady || !window.L) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
    }

    const filteredSightings = sightings.filter(s => activeFilters.includes(s.type));

    // Add heat layer
    if (window.L.heatLayer) {
      const heatData = filteredSightings.map(s => [s.lat, s.lng, s.intensity]);
      heatLayerRef.current = window.L.heatLayer(heatData, {
        radius: 35,
        blur: 25,
        maxZoom: 10,
        gradient: { 0.2: '#22c55e', 0.4: '#84cc16', 0.6: '#eab308', 0.8: '#f97316', 1: '#ef4444' }
      }).addTo(mapRef.current);
    }

    // Add markers
    filteredSightings.forEach((item) => {
      const colors = { Unknown: '#a855f7', Drone: '#3b82f6', Aircraft: '#22c55e', Bird: '#eab308', Weather: '#06b6d4' };
      const color = colors[item.type] || '#a855f7';

      const pulseHtml = `
        <div style="position: relative; width: 20px; height: 20px;">
          <div style="position: absolute; width: 30px; height: 30px; left: -5px; top: -5px; border-radius: 50%; background: ${color}40; animation: pulse 2s ease-out infinite;"></div>
          <div style="position: absolute; width: 12px; height: 12px; left: 4px; top: 4px; border-radius: 50%; background: ${color}; border: 2px solid ${color}cc; box-shadow: 0 0 10px ${color}aa;"></div>
        </div>
      `;

      const icon = window.L.divIcon({ html: pulseHtml, className: 'custom-marker', iconSize: [20, 20], iconAnchor: [10, 10] });
      const marker = window.L.marker([item.lat, item.lng], { icon }).addTo(mapRef.current);
      marker.on('click', () => setSelectedSighting(item));
      markersRef.current.push(marker);
    });

    if (!document.getElementById('marker-pulse-styles')) {
      const style = document.createElement('style');
      style.id = 'marker-pulse-styles';
      style.textContent = `@keyframes pulse { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2); opacity: 0; } } .custom-marker { background: transparent !important; border: none !important; }`;
      document.head.appendChild(style);
    }
  }, [sightings, activeFilters, mapReady]);

  const toggleFilter = (filterId) => {
    setActiveFilters(prev => prev.includes(filterId) ? prev.filter(f => f !== filterId) : [...prev, filterId]);
  };

  const handleClassify = () => {
    if (userClassification && selectedSighting) {
      setSightings(prev => prev.map(s => s.id === selectedSighting.id ? {...s, type: userClassification} : s));
      setSelectedSighting(null);
      setUserClassification(null);
    }
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 relative overflow-hidden">
        <div ref={mapContainerRef} className="absolute inset-0 bg-gray-900" />

        {/* Search Bar */}
        <div className="absolute top-4 left-4 z-[1000]">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search location..."
                className="w-64 pl-9 pr-3 py-2 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
              />
            </div>
            <button onClick={handleSearch} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors">Go</button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="absolute top-4 right-16 z-[1000]">
          <div className="bg-gray-900/90 backdrop-blur rounded-lg border border-gray-700 p-1 flex gap-1">
            {timeRanges.map((range) => (
              <button key={range.id} onClick={() => setTimeRange(range.id)} className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${timeRange === range.id ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'}`}>
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Toggles */}
        <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur rounded-lg border border-gray-700 p-3 z-[1000]">
          <h4 className="text-xs font-semibold text-gray-400 mb-2">FILTER BY TYPE</h4>
          <div className="space-y-1.5">
            {classificationOptions.map((opt) => {
              const colors = { Unknown: 'bg-purple-500', Drone: 'bg-blue-500', Aircraft: 'bg-green-500', Bird: 'bg-yellow-500', Weather: 'bg-cyan-500' };
              const isActive = activeFilters.includes(opt.id);
              return (
                <button key={opt.id} onClick={() => toggleFilter(opt.id)} className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded transition-colors ${isActive ? 'bg-white/10' : 'opacity-50 hover:opacity-75'}`}>
                  <div className={`w-3 h-3 rounded-full ${colors[opt.id]} ${isActive ? 'shadow-lg' : ''}`} style={{ boxShadow: isActive ? `0 0 10px currentColor` : 'none' }} />
                  <span className="text-xs text-gray-300">{opt.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 bg-green-400 rounded-full" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sighting Detail Modal */}
        {selectedSighting && (
          <div className="absolute top-20 left-4 w-80 bg-gray-900/95 backdrop-blur rounded-xl border border-gray-700 overflow-hidden z-[1000] shadow-2xl">
            <div className="aspect-video bg-black">
              <iframe src={`https://www.youtube.com/embed/${selectedSighting.videoId}?autoplay=0&rel=0`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Sighting" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-white">{selectedSighting.city}</h3>
                  <p className="text-xs text-gray-400">{selectedSighting.time}</p>
                </div>
                <button onClick={() => setSelectedSighting(null)} className="text-gray-400 hover:text-white">&times;</button>
              </div>
              <div className={`inline-block px-2 py-1 rounded text-xs font-bold mb-3 ${selectedSighting.type === 'Unknown' ? 'bg-purple-500/20 text-purple-400' : selectedSighting.type === 'Drone' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                {selectedSighting.type}
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">Confidence</span>
                  <span className="text-green-400">{Math.round(selectedSighting.intensity * 100)}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: `${selectedSighting.intensity * 100}%` }} />
                </div>
              </div>
              <h4 className="text-xs font-semibold text-gray-400 mb-2">CLASSIFY THIS SIGHTING</h4>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {classificationOptions.map((opt) => (
                  <button key={opt.id} onClick={() => setUserClassification(opt.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${userClassification === opt.id ? 'bg-green-500/20 text-green-400 border border-green-500' : 'bg-gray-800 text-gray-400 border border-transparent hover:bg-gray-700'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <button onClick={handleClassify} disabled={!userClassification} className={`w-full py-2 rounded-lg text-xs font-medium transition-all ${userClassification ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                Submit Classification (+50 $SKEYE)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Activity Feed */}
      <div className="w-72 border-l border-green-500/10 bg-gray-950/80 overflow-y-auto flex-shrink-0">
        <div className="p-3 border-b border-green-500/10">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-green-400 animate-pulse" />
            Live Activity Feed
          </h3>
        </div>
        <div className="p-3 space-y-2">
          {sightings.slice(0, 10).map((s) => (
            <div key={s.id} className="p-3 bg-white/5 rounded-lg border border-transparent hover:border-green-500/30 cursor-pointer transition-all" onClick={() => setSelectedSighting(s)}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Eye className={`w-4 h-4 ${s.type === 'Unknown' ? 'text-purple-400' : s.type === 'Drone' ? 'text-blue-400' : 'text-green-400'}`} />
                  <span className="text-xs text-gray-400">{s.city}</span>
                </div>
                <span className="text-[10px] text-gray-500">{s.time}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-white">{s.type} detected</span>
                <span className={`text-xs px-2 py-0.5 rounded ${s.intensity >= 0.8 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {Math.round(s.intensity * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DevicesView({ devices }) {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const openModal = (type, device) => { setSelectedDevice(device); setActiveModal(type); };
  const closeModal = () => { setActiveModal(null); setSelectedDevice(null); };

  return (
    <div className="h-full p-5 overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <div><h2 className="text-2xl font-bold text-white">My Devices</h2><p className="text-sm text-gray-400 mt-1">Manage your Skeye camera network</p></div>
        <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all">+ Add Device</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {devices.map((device) => (
          <div key={device.id} className={`relative p-5 rounded-2xl border transition-all ${device.status === 'online' ? 'bg-gradient-to-br from-green-500/5 to-transparent border-green-500/20 hover:border-green-500/40' : 'bg-gradient-to-br from-gray-800/30 to-transparent border-gray-700/50 hover:border-gray-600'}`}>
            <div className={`absolute top-4 right-4 flex items-center gap-2 px-2 py-1 rounded-full text-xs ${device.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              {device.status === 'online' ? 'Live' : 'Offline'}
            </div>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 flex items-center justify-center"><img src={cameraImg} alt="SKEYE Camera" className="w-full h-full object-contain drop-shadow-2xl" /></div>
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
              <button onClick={() => openModal('feed', device)} className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-all ${device.status === 'online' ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'}`} disabled={device.status !== 'online'}>View Feed</button>
              <button onClick={() => openModal('settings', device)} className="flex-1 py-2.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Settings</button>
              <button onClick={() => openModal('history', device)} className="flex-1 py-2.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">History</button>
            </div>
          </div>
        ))}
      </div>

      {activeModal === 'feed' && selectedDevice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-gray-900 rounded-2xl border border-green-500/20 w-full max-w-4xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div><h3 className="font-semibold text-white">{selectedDevice.name} - Live Feed</h3><p className="text-xs text-gray-400">{selectedDevice.location}</p></div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /><span className="text-xs text-red-400">REC</span></div>
                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
            </div>
            <div className="aspect-video bg-black relative">
              <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><Camera className="w-16 h-16 text-gray-700 mx-auto mb-4" /><p className="text-gray-500">Live feed streaming...</p><p className="text-xs text-gray-600 mt-1">Demo mode - Connect camera for live view</p></div></div>
              <div className="absolute top-4 left-4 bg-black/60 px-2 py-1 rounded text-xs text-white font-mono">{new Date().toLocaleTimeString()}</div>
              <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded text-xs text-green-400">1080p • 30fps</div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'settings' && selectedDevice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-gray-900 rounded-2xl border border-green-500/20 w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3"><Settings className="w-5 h-5 text-green-400" /><h3 className="font-semibold text-white">Device Settings</h3></div>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div><label className="block text-xs text-gray-400 mb-2">Device Name</label><input type="text" defaultValue={selectedDevice.name} className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50" /></div>
              <div><label className="block text-xs text-gray-400 mb-2">Location</label><input type="text" defaultValue={selectedDevice.location} className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50" /></div>
              <div><label className="block text-xs text-gray-400 mb-2">WiFi Password</label><input type="password" defaultValue="••••••••••" className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50" /></div>
            </div>
            <div className="p-4 border-t border-gray-800 flex items-center justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 text-gray-400 hover:bg-white/5 rounded-lg text-sm font-medium">Cancel</button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'history' && selectedDevice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-gray-900 rounded-2xl border border-green-500/20 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div><h3 className="font-semibold text-white">{selectedDevice.name} - History</h3><p className="text-xs text-gray-400">{selectedDevice.detections} total</p></div>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {[{ time: 'Today, 9:34 PM', type: 'Unknown', duration: '0:32', confidence: 87 }, { time: 'Today, 8:12 PM', type: 'Aircraft', duration: '0:18', confidence: 94 }, { time: 'Today, 6:45 PM', type: 'Drone', duration: '1:24', confidence: 91 }].map((clip, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors">
                  <div className="w-20 h-14 bg-gray-800 rounded-lg flex items-center justify-center relative"><Play className="w-5 h-5 text-gray-600" /><span className="absolute bottom-1 right-1 text-[10px] bg-black/60 px-1 rounded">{clip.duration}</span></div>
                  <div className="flex-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${clip.type === 'Unknown' ? 'bg-purple-500/20 text-purple-400' : clip.type === 'Drone' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>{clip.type}</span>
                    <p className="text-xs text-gray-400 mt-1">{clip.time}</p>
                  </div>
                  <span className={`text-xs ${clip.confidence >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>{clip.confidence}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrendingView({ clips, selectedClip, setSelectedClip, viewMode, setViewMode }) {
  const [filter, setFilter] = useState('all');
  const [playingClipId, setPlayingClipId] = useState(null);
  const [userClassification, setUserClassification] = useState(null);
  const filteredClips = clips.filter(clip => filter === 'all' || (filter === 'uap' && clip.classification === 'UAP') || (filter === 'verified' && clip.verified));

  const handlePlayClick = (e, clipId) => { e.stopPropagation(); setPlayingClipId(playingClipId === clipId ? null : clipId); };

  return (
    <div className="h-full flex">
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div><h2 className="text-2xl font-bold text-white">Trending Clips</h2><p className="text-sm text-gray-400 mt-1">Latest verified footage</p></div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/5 rounded-lg p-1">
              {[{ id: 'all', label: 'All' }, { id: 'uap', label: 'UAP' }, { id: 'verified', label: 'Verified' }].map((f) => (<button key={f.id} onClick={() => setFilter(f.id)} className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${filter === f.id ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'}`}>{f.label}</button>))}
            </div>
            <div className="flex items-center bg-white/5 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-500/20 text-green-400' : 'text-gray-400'}`}><Grid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-500/20 text-green-400' : 'text-gray-400'}`}><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
          {filteredClips.map((clip) => (
            <div key={clip.id} onClick={() => setSelectedClip(clip)} className="group cursor-pointer rounded-2xl border border-transparent hover:border-green-500/30 bg-white/5 overflow-hidden transition-all">
              {viewMode === 'list' ? (
                <div className="flex items-stretch gap-4 p-3">
                  <div className={`relative bg-black flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${playingClipId === clip.id ? 'w-96 aspect-video' : 'w-44 h-24'}`}>
                    {playingClipId === clip.id ? (<iframe src={`https://www.youtube.com/embed/${clip.videoId}?autoplay=1&rel=0`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={clip.title} />) : (<><img src={`https://img.youtube.com/vi/${clip.videoId}/mqdefault.jpg`} alt={clip.title} className="w-full h-full object-cover" /><div className="absolute inset-0 flex items-center justify-center bg-black/30" onClick={(e) => handlePlayClick(e, clip.id)}><div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-green-500/30 transition-colors"><Play className="w-4 h-4 text-white ml-0.5" /></div></div></>)}
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold uppercase bg-purple-500 text-white`}>{clip.classification}</div>
                  </div>
                  <div className="flex-1 py-1">
                    <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">{clip.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400"><MapPin className="w-3 h-3" /><span>{clip.location}</span><span className="text-gray-600">•</span><span>{clip.timestamp}</span></div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{clip.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{clip.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{clip.comments}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <><div className="relative bg-black aspect-video overflow-hidden"><img src={`https://img.youtube.com/vi/${clip.videoId}/mqdefault.jpg`} alt={clip.title} className="w-full h-full object-cover" /><div className="absolute inset-0 flex items-center justify-center bg-black/30" onClick={(e) => handlePlayClick(e, clip.id)}><div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-green-500/30 transition-colors"><Play className="w-5 h-5 text-white ml-0.5" /></div></div><div className="absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold uppercase bg-purple-500 text-white">{clip.classification}</div></div><div className="p-4"><h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">{clip.title}</h3><div className="flex items-center gap-2 mt-2 text-xs text-gray-400"><MapPin className="w-3 h-3" /><span>{clip.location}</span></div></div></>
              )}
            </div>
          ))}
        </div>
      </div>
      {selectedClip && (
        <div className="w-96 border-l border-green-500/10 bg-gray-950/80 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-white">Clip Details</h3><button onClick={() => setSelectedClip(null)} className="text-gray-400 hover:text-white text-xl">&times;</button></div>
            <h4 className="font-semibold text-white">{selectedClip.title}</h4>
            <p className="text-sm text-gray-400 mt-1">{selectedClip.location} • {selectedClip.timestamp}</p>
            <div className="mt-4 p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between"><span className="text-xs text-gray-400 uppercase">AI Classification</span><span className="px-2 py-1 rounded text-xs font-bold bg-purple-500/20 text-purple-400">{selectedClip.classification}</span></div>
              <div className="mt-3"><div className="flex items-center justify-between text-xs mb-1"><span className="text-gray-400">Confidence</span><span className="text-green-400">{selectedClip.confidence}%</span></div><div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: `${selectedClip.confidence}%` }} /></div></div>
            </div>
            <div className="mt-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <h5 className="text-sm font-semibold text-white mb-3">Submit Your Classification</h5>
              <div className="flex flex-wrap gap-2">
                {classificationOptions.map((opt) => (<button key={opt.id} onClick={() => setUserClassification(opt.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${userClassification === opt.id ? 'bg-green-500/20 text-green-400 border border-green-500' : 'bg-gray-800 text-gray-400 border border-transparent hover:bg-gray-700'}`}>{opt.label}</button>))}
              </div>
              <button disabled={!userClassification} className={`w-full mt-3 py-2.5 rounded-lg text-sm font-medium transition-all ${userClassification ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>Submit (+50 $SKEYE)</button>
            </div>
            <div className="mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-green-400" /><span className="font-medium text-white">Blockchain Verified</span></div>
              <code className="block mt-2 text-[10px] text-green-400/60">0x7f8a...3d2e</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClassifyView() {
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [selectedClassification, setSelectedClassification] = useState(null);
  const [classified, setClassified] = useState(12);
  const currentClip = classifyClips[currentClipIndex];

  const handleSubmit = () => { if (!selectedClassification) return; setClassified(prev => prev + 1); setSelectedClassification(null); setCurrentClipIndex(prev => (prev + 1) % classifyClips.length); };
  const handleSkip = () => { setSelectedClassification(null); setCurrentClipIndex(prev => (prev + 1) % classifyClips.length); };

  return (
    <div className="h-full p-5 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Help Classify Footage</h2>
          <p className="text-gray-400 mt-2">Contribute to the collective intelligence</p>
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20"><span className="text-green-400 font-bold">+50 $SKEYE</span><span className="text-gray-400 text-sm">per classification</span></div>
        </div>
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="aspect-video bg-black relative">
            <iframe key={currentClip.videoId} src={`https://www.youtube.com/embed/${currentClip.videoId}?autoplay=0&rel=0`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={currentClip.title} />
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur rounded-lg border border-gray-700"><span className="text-xs text-gray-400">Clip {currentClipIndex + 1} of {classifyClips.length}</span></div>
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-yellow-500/90 rounded-lg"><span className="text-xs font-bold text-black">NEEDS REVIEW</span></div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Select Classification</h3>
            <div className="flex flex-wrap gap-2">
              {classificationOptions.map((opt) => (<button key={opt.id} onClick={() => setSelectedClassification(opt.id)} className={`px-4 py-2.5 rounded-xl border transition-all ${selectedClassification === opt.id ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'}`}>{opt.label}</button>))}
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={handleSubmit} disabled={!selectedClassification} className={`flex-1 py-3.5 rounded-xl font-semibold transition-all ${selectedClassification ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/30' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>Submit Classification</button>
              <button onClick={handleSkip} className="px-8 py-3.5 bg-gray-800 rounded-xl text-gray-400 hover:bg-gray-700 hover:text-white transition-colors font-medium">Skip</button>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-between text-sm mb-2"><span className="text-gray-400">Your progress today</span><span className="text-green-400 font-semibold">{classified} / 20 clips</span></div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-300" style={{ width: `${(classified / 20) * 100}%` }} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunityView() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [selectedPost, setSelectedPost] = useState(null);
  const [sortBy, setSortBy] = useState('hot');

  const filteredPosts = communityPosts.filter(p => activeCategory === 'general' ? true : p.category === activeCategory);
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'hot') return (b.upvotes + b.comments * 2) - (a.upvotes + a.comments * 2);
    if (sortBy === 'new') return 0;
    if (sortBy === 'top') return b.upvotes - a.upvotes;
    return 0;
  });

  return (
    <div className="h-full flex">
      {/* Sidebar - Categories */}
      <div className="w-64 border-r border-green-500/10 bg-gray-950/80 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-green-500/10">
          <h3 className="font-semibold text-white">Categories</h3>
        </div>
        <div className="p-2">
          {communityCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${activeCategory === cat.id ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-sm">{cat.name}</span>
                <span className="text-xs text-gray-500">{cat.count}</span>
              </button>
            );
          })}
        </div>
        <div className="p-4 border-t border-green-500/10">
          <button className="w-full py-2.5 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all">+ New Post</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-white">{communityCategories.find(c => c.id === activeCategory)?.name || 'Community'}</h2>
              <p className="text-sm text-gray-400 mt-1">Join the discussion</p>
            </div>
            <div className="flex items-center bg-white/5 rounded-lg p-1">
              {[{ id: 'hot', label: 'Hot' }, { id: 'new', label: 'New' }, { id: 'top', label: 'Top' }].map((s) => (
                <button key={s.id} onClick={() => setSortBy(s.id)} className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${sortBy === s.id ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'}`}>{s.label}</button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {sortedPosts.map((post) => (
              <div key={post.id} onClick={() => setSelectedPost(post)} className="p-4 bg-white/5 rounded-2xl border border-transparent hover:border-green-500/30 cursor-pointer transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <button className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-green-400"><ChevronUp className="w-5 h-5" /></button>
                    <span className="text-sm font-semibold text-white">{post.upvotes}</span>
                    <button className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-red-400"><ChevronDown className="w-5 h-5" /></button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.pinned && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold rounded">PINNED</span>}
                      {post.verified && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded">OFFICIAL</span>}
                      <span className="px-2 py-0.5 bg-white/10 text-gray-400 text-[10px] rounded">{communityCategories.find(c => c.id === post.category)?.name}</span>
                    </div>
                    <h3 className="font-semibold text-white mt-2 hover:text-green-400 transition-colors">{post.title}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${post.verified ? 'bg-green-500 text-white' : 'bg-gradient-to-br from-green-400/50 to-green-600/50 text-white'}`}>{post.avatar}</div>
                        <span>{post.author}</span>
                      </div>
                      <span>{post.time}</span>
                      <div className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.comments} comments</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar - Stats & Leaderboard */}
      <div className="w-72 border-l border-green-500/10 bg-gray-950/80 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-green-500/10">
          <h3 className="font-semibold text-white flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" />Top Contributors</h3>
        </div>
        <div className="p-4 space-y-2">
          {[{ rank: 1, name: 'SkyHunter_Pro', points: 45680, badge: '👑' }, { rank: 2, name: 'NightOwl_TX', points: 38920, badge: '🥈' }, { rank: 3, name: 'TruthSeeker', points: 32100, badge: '🥉' }].map((user) => (
            <div key={user.rank} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <span className={`w-6 text-center font-bold ${user.rank === 1 ? 'text-yellow-400' : user.rank === 2 ? 'text-gray-300' : 'text-orange-400'}`}>{user.badge}</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center text-sm font-bold text-green-400">{user.name[0]}</div>
              <div className="flex-1 min-w-0"><p className="text-sm text-white truncate">{user.name}</p></div>
              <span className="text-sm text-green-400 font-semibold">{user.points.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-green-500/10">
          <h3 className="font-semibold text-white mb-3">Your Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-xl text-center"><p className="text-2xl font-bold text-green-400">156</p><p className="text-[10px] text-gray-500 uppercase">Posts</p></div>
            <div className="p-3 bg-white/5 rounded-xl text-center"><p className="text-2xl font-bold text-green-400">1.2k</p><p className="text-[10px] text-gray-500 uppercase">Karma</p></div>
          </div>
        </div>
        <div className="p-4 border-t border-green-500/10">
          <h3 className="font-semibold text-white mb-3">Community Rules</h3>
          <div className="space-y-2 text-xs text-gray-400">
            <p>1. Be respectful to all members</p>
            <p>2. No spam or self-promotion</p>
            <p>3. Cite sources when possible</p>
            <p>4. Keep discussions on topic</p>
          </div>
        </div>
      </div>
    </div>
  );
}
