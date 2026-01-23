import { useState, useEffect, useRef } from 'react';
import { Camera, TrendingUp, Users, Bell, Search, Play, Eye, Zap, Globe, Shield, Radio, Wifi, AlertTriangle, MapPin, Grid, List, ThumbsUp, MessageCircle, Share2, Download, Plus, Minus } from 'lucide-react';
import logo from './logo.png';

const mockDevices = [
  { id: 1, name: 'Rooftop Alpha', location: 'San Francisco, CA', status: 'online', detections: 127, signal: 98, lat: 37.7749, lng: -122.4194 },
  { id: 2, name: 'Observatory Beta', location: 'Denver, CO', status: 'online', detections: 89, signal: 92, lat: 39.7392, lng: -104.9903 },
  { id: 3, name: 'Station Gamma', location: 'Austin, TX', status: 'offline', detections: 203, signal: 0, lat: 30.2672, lng: -97.7431 },
  { id: 4, name: 'Outpost Delta', location: 'Seattle, WA', status: 'online', detections: 56, signal: 87, lat: 47.6062, lng: -122.3321 },
];

const mockClips = [
  { id: 1, title: 'Unidentified Object - High Speed', location: 'Phoenix, AZ', timestamp: '2 min ago', views: 12400, classification: 'UAP', confidence: 87, verified: true, likes: 892, comments: 234 },
  { id: 2, title: 'Formation - 3 Objects', location: 'Miami, FL', timestamp: '15 min ago', views: 8900, classification: 'Under Review', confidence: 0, verified: false, likes: 456, comments: 123 },
  { id: 3, title: 'Drone Swarm Detected', location: 'Las Vegas, NV', timestamp: '1 hour ago', views: 5600, classification: 'Drone', confidence: 96, verified: true, likes: 234, comments: 67 },
  { id: 4, title: 'Night Sky Anomaly', location: 'Chicago, IL', timestamp: '3 hours ago', views: 21000, classification: 'UAP', confidence: 72, verified: true, likes: 1567, comments: 445 },
];

const mockSightings = [
  { id: 1, lat: 37.7749, lng: -122.4194, type: 'UAP', intensity: 0.9, city: 'San Francisco', time: '2 min ago' },
  { id: 2, lat: 34.0522, lng: -118.2437, type: 'Drone', intensity: 0.7, city: 'Los Angeles', time: '5 min ago' },
  { id: 3, lat: 40.7128, lng: -74.0060, type: 'UAP', intensity: 0.95, city: 'New York', time: '1 min ago' },
  { id: 4, lat: 33.4484, lng: -112.0740, type: 'UAP', intensity: 0.85, city: 'Phoenix', time: '3 min ago' },
  { id: 5, lat: 25.7617, lng: -80.1918, type: 'Aircraft', intensity: 0.5, city: 'Miami', time: '10 min ago' },
  { id: 6, lat: 41.8781, lng: -87.6298, type: 'UAP', intensity: 0.8, city: 'Chicago', time: '7 min ago' },
  { id: 7, lat: 29.7604, lng: -95.3698, type: 'Drone', intensity: 0.6, city: 'Houston', time: '15 min ago' },
  { id: 8, lat: 47.6062, lng: -122.3321, type: 'UAP', intensity: 0.75, city: 'Seattle', time: '4 min ago' },
  { id: 9, lat: 39.7392, lng: -104.9903, type: 'Satellite', intensity: 0.4, city: 'Denver', time: '20 min ago' },
  { id: 10, lat: 36.1699, lng: -115.1398, type: 'UAP', intensity: 0.92, city: 'Las Vegas', time: '1 min ago' },
];

const classificationOptions = ['UAP', 'Drone', 'Aircraft', 'Satellite', 'Bird', 'Weather', 'Unknown'];

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedClip, setSelectedClip] = useState(null);
  const [selectedClassification, setSelectedClassification] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [time, setTime] = useState(new Date());
  const [activeDevices, setActiveDevices] = useState(2847);
  const [totalDetections, setTotalDetections] = useState(14892);

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
              <Zap className="w-4 h-4 text-yellow-400" />
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
            <button className="relative p-2 hover:bg-white/5 rounded-lg">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">3</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xs font-bold">JD</div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 overflow-hidden">
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
          {activeTab === 'map' && <GlobalMapView sightings={mockSightings} devices={mockDevices} />}
          {activeTab === 'devices' && <DevicesView devices={mockDevices} />}
          {activeTab === 'trending' && <TrendingView clips={mockClips} selectedClip={selectedClip} setSelectedClip={setSelectedClip} viewMode={viewMode} setViewMode={setViewMode} />}
          {activeTab === 'classify' && <ClassifyView selectedClassification={selectedClassification} setSelectedClassification={setSelectedClassification} />}
          {activeTab === 'community' && <CommunityView />}
        </main>
      </div>
    </div>
  );
}

function GlobalMapView({ sightings, devices }) {
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 });
  const [zoom, setZoom] = useState(4);
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [mapLayer, setMapLayer] = useState('sightings');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    const scale = 0.5 / zoom;
    setMapCenter(prev => ({
      lat: Math.max(-85, Math.min(85, prev.lat + dy * scale)),
      lng: prev.lng - dx * scale
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(1, Math.min(12, prev + delta)));
  };

  const latLngToXY = (lat, lng) => {
    const x = ((lng - mapCenter.lng) * zoom * 8 + 50);
    const y = ((mapCenter.lat - lat) * zoom * 8 + 50);
    return { x: `${x}%`, y: `${y}%` };
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 relative overflow-hidden">
        {/* Dark themed map background */}
        <div 
          ref={mapRef}
          className="absolute inset-0 bg-gray-900 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Map tiles using dark CartoDB tiles */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: `url(https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/${Math.floor(zoom)}/${Math.floor((mapCenter.lng + 180) / 360 * Math.pow(2, Math.floor(zoom)))}/${Math.floor((1 - Math.log(Math.tan(mapCenter.lat * Math.PI / 180) + 1 / Math.cos(mapCenter.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, Math.floor(zoom)))}.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.8) saturate(0.8)'
          }} />
          
          {/* Grid overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Sightings markers */}
          {mapLayer === 'sightings' && sightings.map((sighting) => {
            const pos = latLngToXY(sighting.lat, sighting.lng);
            return (
              <div
                key={sighting.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                style={{ left: pos.x, top: pos.y }}
                onClick={(e) => { e.stopPropagation(); setSelectedSighting(sighting); }}
              >
                <div className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full animate-ping opacity-30"
                  style={{ 
                    backgroundColor: sighting.type === 'UAP' ? 'rgba(168,85,247,0.5)' : sighting.type === 'Drone' ? 'rgba(59,130,246,0.5)' : 'rgba(34,197,94,0.5)',
                    animationDuration: '2s' 
                  }} 
                />
                <div className={`relative w-4 h-4 rounded-full border-2 transition-transform group-hover:scale-150 ${
                  sighting.type === 'UAP' ? 'border-purple-400 bg-purple-500 shadow-purple-500/50' : 
                  sighting.type === 'Drone' ? 'border-blue-400 bg-blue-500 shadow-blue-500/50' : 
                  'border-green-400 bg-green-500 shadow-green-500/50'
                }`} style={{ boxShadow: `0 0 20px currentColor` }} />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-gray-900/95 px-3 py-2 rounded-lg text-xs border border-green-500/30 shadow-xl">
                    <div className="font-semibold text-white">{sighting.city}</div>
                    <div className={`text-xs ${sighting.type === 'UAP' ? 'text-purple-400' : sighting.type === 'Drone' ? 'text-blue-400' : 'text-green-400'}`}>{sighting.type} • {sighting.time}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Device markers */}
          {mapLayer === 'devices' && devices.map((device) => {
            const pos = latLngToXY(device.lat, device.lng);
            return (
              <div
                key={device.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                style={{ left: pos.x, top: pos.y }}
              >
                <div className={`relative w-6 h-6 rounded-lg flex items-center justify-center ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}>
                  <Camera className="w-3 h-3 text-white" />
                </div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-gray-900/95 px-3 py-2 rounded-lg text-xs border border-green-500/30 shadow-xl">
                    <div className="font-semibold text-white">{device.name}</div>
                    <div className="text-gray-400">{device.location}</div>
                    <div className={`text-xs ${device.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>{device.status}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          <div className="bg-gray-900/90 backdrop-blur rounded-lg border border-green-500/20 p-1 flex gap-1">
            {['sightings', 'devices', 'heat'].map((layer) => (
              <button key={layer} onClick={() => setMapLayer(layer)} className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${mapLayer === layer ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'}`}>
                {layer.charAt(0).toUpperCase() + layer.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-1 z-20">
          <button onClick={() => handleZoom(1)} className="w-10 h-10 bg-gray-900/90 backdrop-blur border border-green-500/20 rounded-lg flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          <button onClick={() => handleZoom(-1)} className="w-10 h-10 bg-gray-900/90 backdrop-blur border border-green-500/20 rounded-lg flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
            <Minus className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur rounded-lg border border-green-500/20 p-3 z-20">
          <h4 className="text-xs font-semibold text-gray-400 mb-2">LEGEND</h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-xs text-gray-300">UAP Sighting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-300">Drone Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-gray-300">Aircraft/Other</span>
            </div>
          </div>
        </div>

        {/* Coordinates display */}
        <div className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur rounded-lg border border-green-500/20 px-3 py-2 z-20">
          <div className="text-xs font-mono text-green-400">
            {mapCenter.lat.toFixed(4)}°N, {Math.abs(mapCenter.lng).toFixed(4)}°W
          </div>
          <div className="text-xs text-gray-500">Zoom: {zoom}x</div>
        </div>

        {/* Selected sighting panel */}
        {selectedSighting && (
          <div className="absolute top-20 left-4 w-72 bg-gray-900/95 backdrop-blur rounded-xl border border-green-500/20 p-4 z-30 shadow-2xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white">{selectedSighting.city}</h3>
                <p className="text-xs text-gray-400">{selectedSighting.time}</p>
              </div>
              <button onClick={() => setSelectedSighting(null)} className="text-gray-400 hover:text-white">×</button>
            </div>
            <div className={`inline-block px-2 py-1 rounded text-xs font-bold ${
              selectedSighting.type === 'UAP' ? 'bg-purple-500/20 text-purple-400' : 
              selectedSighting.type === 'Drone' ? 'bg-blue-500/20 text-blue-400' : 
              'bg-green-500/20 text-green-400'
            }`}>{selectedSighting.type}</div>
            <div className="mt-3 pt-3 border-t border-gray-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Confidence</span>
                <span className="text-green-400">{Math.round(selectedSighting.intensity * 100)}%</span>
              </div>
              <div className="mt-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: `${selectedSighting.intensity * 100}%` }} />
              </div>
            </div>
            <button className="w-full mt-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30 transition-colors">
              View Full Report
            </button>
          </div>
        )}
      </div>

      {/* Activity Feed Sidebar */}
      <div className="w-72 border-l border-green-500/10 bg-gray-950/80 overflow-y-auto flex-shrink-0">
        <div className="p-3 border-b border-green-500/10">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Radio className="w-4 h-4 text-green-400" />Live Activity Feed</h3>
        </div>
        <div className="p-3 space-y-2">
          {sightings.slice(0, 6).map((sighting) => (
            <div 
              key={sighting.id} 
              className="p-3 bg-white/5 rounded-lg border border-transparent hover:border-green-500/30 cursor-pointer transition-all"
              onClick={() => setSelectedSighting(sighting)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Eye className={`w-4 h-4 ${sighting.type === 'UAP' ? 'text-purple-400' : sighting.type === 'Drone' ? 'text-blue-400' : 'text-green-400'}`} />
                  <span className="text-xs text-gray-400">{sighting.city}</span>
                </div>
                <span className="text-[10px] text-gray-500">{sighting.time}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-white">{sighting.type} detected</span>
                <span className={`text-xs px-2 py-0.5 rounded ${sighting.intensity >= 0.8 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {Math.round(sighting.intensity * 100)}%
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
  return (
    <div className="h-full p-5 overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-white">My Devices</h2>
          <p className="text-sm text-gray-400 mt-1">Manage your Skeye camera network</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all">+ Add Device</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {devices.map((device) => (
          <div key={device.id} className={`relative p-5 rounded-2xl border transition-all cursor-pointer group ${device.status === 'online' ? 'bg-gradient-to-br from-green-500/5 to-green-600/5 border-green-500/20 hover:border-green-500/40' : 'bg-white/5 border-gray-800 hover:border-gray-700'}`}>
            <div className={`absolute top-4 right-4 flex items-center gap-2 px-2 py-1 rounded-full text-xs ${device.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              {device.status === 'online' ? 'Live' : 'Offline'}
            </div>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                <Camera className="w-8 h-8 text-gray-600" />
                {device.status === 'online' && <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent" />}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">{device.name}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{device.location}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Wifi className={`w-4 h-4 ${device.signal > 80 ? 'text-green-400' : 'text-yellow-400'}`} />
                    <span className="text-xs text-gray-400">{device.signal > 0 ? `${device.signal}%` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400">{device.detections}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-800">
              <button className="flex-1 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">View Feed</button>
              <button className="flex-1 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Settings</button>
              <button className="flex-1 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">History</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendingView({ clips, selectedClip, setSelectedClip, viewMode, setViewMode }) {
  const [filter, setFilter] = useState('all');
  const filteredClips = clips.filter(clip => filter === 'all' || (filter === 'uap' && clip.classification === 'UAP') || (filter === 'verified' && clip.verified));
  return (
    <div className="h-full flex">
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-white">Trending Clips</h2>
            <p className="text-sm text-gray-400 mt-1">Latest verified footage from the network</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/5 rounded-lg p-1">
              {[{ id: 'all', label: 'All' }, { id: 'uap', label: 'UAP' }, { id: 'verified', label: 'Verified' }].map((f) => (
                <button key={f.id} onClick={() => setFilter(f.id)} className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${filter === f.id ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'}`}>{f.label}</button>
              ))}
            </div>
            <div className="flex items-center bg-white/5 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-500/20 text-green-400' : 'text-gray-400'}`}><Grid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-500/20 text-green-400' : 'text-gray-400'}`}><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
          {filteredClips.map((clip) => (
            <div key={clip.id} onClick={() => setSelectedClip(clip)} className={`group cursor-pointer rounded-2xl border border-transparent hover:border-green-500/30 bg-white/5 overflow-hidden transition-all ${viewMode === 'list' ? 'flex items-center gap-4 p-4' : ''}`}>
              <div className={`relative bg-gradient-to-br from-gray-800 to-gray-900 ${viewMode === 'grid' ? 'aspect-video' : 'w-44 h-24'} flex-shrink-0`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-green-500/30 transition-colors"><Play className="w-5 h-5 text-white ml-0.5" /></div>
                </div>
                <div className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold uppercase ${clip.classification === 'UAP' ? 'bg-purple-500 text-white' : clip.classification === 'Drone' ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-black'}`}>{clip.classification}</div>
                {clip.verified && <div className="absolute top-2 right-2 p-1 rounded bg-green-500"><Shield className="w-3 h-3 text-white" /></div>}
                {clip.confidence > 0 && <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 text-[10px] text-green-400">{clip.confidence}% AI</div>}
              </div>
              <div className={viewMode === 'grid' ? 'p-4' : 'flex-1'}>
                <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">{clip.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400"><MapPin className="w-3 h-3" /><span>{clip.location}</span><span className="text-gray-600">•</span><span>{clip.timestamp}</span></div>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{clip.views.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{clip.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{clip.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedClip && (
        <div className="w-80 border-l border-green-500/10 bg-gray-950/80 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Clip Details</h3>
              <button onClick={() => setSelectedClip(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl relative mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors"><Play className="w-6 h-6 text-green-400 ml-0.5" /></button>
              </div>
            </div>
            <h4 className="font-semibold text-white">{selectedClip.title}</h4>
            <p className="text-sm text-gray-400 mt-1">{selectedClip.location} • {selectedClip.timestamp}</p>
            <div className="mt-4 p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 uppercase">AI Classification</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${selectedClip.classification === 'UAP' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>{selectedClip.classification}</span>
              </div>
              {selectedClip.confidence > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1"><span className="text-gray-400">Confidence</span><span className="text-green-400">{selectedClip.confidence}%</span></div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: `${selectedClip.confidence}%` }} /></div>
                </div>
              )}
            </div>
            <div className="mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-green-400" /><span className="font-medium text-white">Blockchain Verified</span></div>
              <p className="text-xs text-gray-400 mt-2">Cryptographically signed on Solana</p>
              <code className="block mt-2 text-[10px] text-green-400/60">0x7f8a...3d2e</code>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <button className="flex-1 py-2.5 bg-green-500/20 text-green-400 rounded-xl text-sm font-medium hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2"><Download className="w-4 h-4" />Download</button>
              <button className="flex-1 py-2.5 bg-white/5 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"><Share2 className="w-4 h-4" />Share</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClassifyView({ selectedClassification, setSelectedClassification }) {
  return (
    <div className="h-full p-5 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Help Classify Footage</h2>
          <p className="text-gray-400 mt-2">Contribute to the collective intelligence</p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-500/10 rounded-full">
            <span className="text-green-400 font-bold">+50 $SKEYE</span>
            <span className="text-gray-400 text-sm">per classification</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-green-500/20 overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors group"><Play className="w-9 h-9 text-green-400 ml-1 group-hover:scale-110 transition-transform" /></button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-4 text-white">
                <Play className="w-5 h-5" />
                <div className="flex-1 h-1 bg-gray-600 rounded-full"><div className="w-1/4 h-full bg-green-400 rounded-full" /></div>
                <span className="text-xs">0:08 / 0:32</span>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-lg text-xs font-bold">NEEDS REVIEW</div>
          </div>
          <div className="p-6">
            <h3 className="font-semibold text-white mb-4">What do you see?</h3>
            <div className="grid grid-cols-4 gap-3">
              {classificationOptions.map((option) => (
                <button key={option} onClick={() => setSelectedClassification(option)} className={`p-4 rounded-xl border transition-all ${selectedClassification === option ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-gray-700 bg-white/5 text-gray-300 hover:border-gray-600'}`}>
                  <span className="text-2xl mb-2 block">{option === 'UAP' && '👽'}{option === 'Drone' && '🚁'}{option === 'Aircraft' && '✈️'}{option === 'Satellite' && '🛰️'}{option === 'Bird' && '🦅'}{option === 'Weather' && '⛈️'}{option === 'Unknown' && '❓'}</span>
                  <span className="text-sm font-medium">{option}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-6">
              <button className={`flex-1 py-3 rounded-xl font-semibold transition-all ${selectedClassification ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/30' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`} disabled={!selectedClassification}>Submit Classification</button>
              <button className="px-6 py-3 bg-white/5 rounded-xl text-gray-400 hover:bg-white/10 transition-colors">Skip</button>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-between text-sm"><span className="text-gray-400">Your progress today</span><span className="text-green-400 font-semibold">12 / 20 clips</span></div>
              <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden"><div className="w-3/5 h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunityView() {
  const discussions = [
    { id: 1, title: 'Phoenix lights spotted again', author: 'SkyWatcher_AZ', replies: 156, tags: ['UAP'], pinned: true },
    { id: 2, title: 'Camera placement tips', author: 'TechExplorer', replies: 89, tags: ['Tips'], pinned: false },
    { id: 3, title: 'NJ drone swarm analysis', author: 'DataAnalyst99', replies: 234, tags: ['Drone'], pinned: true },
  ];
  const leaderboard = [
    { rank: 1, name: 'SkyHunter_Pro', points: 45680, badge: '👑' },
    { rank: 2, name: 'NightOwl_TX', points: 38920, badge: '🥈' },
    { rank: 3, name: 'TruthSeeker', points: 32100, badge: '🥉' },
  ];
  return (
    <div className="h-full flex">
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div><h2 className="text-2xl font-bold text-white">Community</h2><p className="text-sm text-gray-400 mt-1">Join the discussion</p></div>
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-sm font-semibold">New Discussion</button>
        </div>
        <div className="space-y-3">
          {discussions.map((d) => (
            <div key={d.id} className="p-4 bg-white/5 rounded-2xl border border-transparent hover:border-green-500/30 cursor-pointer transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center font-bold flex-shrink-0">{d.author[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">{d.pinned && <span className="text-yellow-400">📌</span>}<h3 className="font-semibold text-white">{d.title}</h3></div>
                  <div className="flex items-center gap-2 mt-1"><span className="text-sm text-gray-400">by {d.author}</span></div>
                  <div className="flex items-center gap-2 mt-2">{d.tags.map((tag) => (<span key={tag} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">{tag}</span>))}</div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400"><MessageCircle className="w-4 h-4" /><span>{d.replies}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-72 border-l border-green-500/10 bg-gray-950/80 overflow-y-auto">
        <div className="p-4 border-b border-green-500/10"><h3 className="font-semibold text-white flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" />Top Contributors</h3></div>
        <div className="p-4 space-y-2">
          {leaderboard.map((user) => (
            <div key={user.rank} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <span className={`w-6 text-center font-bold ${user.rank === 1 ? 'text-yellow-400' : user.rank === 2 ? 'text-gray-300' : 'text-orange-400'}`}>{user.badge || user.rank}</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center text-sm font-bold text-green-400">{user.name[0]}</div>
              <div className="flex-1 min-w-0"><p className="text-sm text-white truncate">{user.name}</p></div>
              <span className="text-sm text-green-400 font-semibold">{user.points.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-green-500/10">
          <h3 className="font-semibold text-white mb-3">Your Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-xl text-center"><p className="text-2xl font-bold text-green-400">156</p><p className="text-[10px] text-gray-500 uppercase">Classifications</p></div>
            <div className="p-3 bg-white/5 rounded-xl text-center"><p className="text-2xl font-bold text-green-400">12.4k</p><p className="text-[10px] text-gray-500 uppercase">$SKEYE</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
