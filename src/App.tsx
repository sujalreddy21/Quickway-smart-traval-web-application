import React, { useState, useEffect, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Bus, 
  Car, 
  Plane, 
  Clock, 
  DollarSign, 
  Star, 
  CheckCircle2, 
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import { cn } from './lib/utils';
import { getPopularPlaces, getTravelOptions, type TravelOption, type PopularPlace } from './services/geminiService';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "glass py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-green rounded-xl flex items-center justify-center shadow-lg">
            <Navigation className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold font-display tracking-tight text-slate-900">
            Quick<span className="text-brand-blue">Way</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Features', 'Destinations', 'About'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-slate-600 hover:text-brand-blue transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-blue transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <button 
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-t border-slate-200 md:hidden p-6 flex flex-col gap-4"
          >
            {['Home', 'Features', 'Destinations', 'About'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-lg font-medium text-slate-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const TravelOptionCard = ({ option, index, onSelect }: { option: TravelOption, index: number, onSelect: () => void }) => {
  const icons = {
    Budget: <Bus className="w-6 h-6" />,
    Medium: <Car className="w-6 h-6" />,
    Luxury: <Plane className="w-6 h-6" />
  };

  const colors = {
    Budget: "from-emerald-400 to-emerald-600",
    Medium: "from-blue-400 to-blue-600",
    Luxury: "from-purple-500 to-purple-700"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className={cn(
        "relative p-8 rounded-3xl glass flex flex-col gap-6 group overflow-hidden",
        option.isBestChoice && "ring-2 ring-brand-blue ring-offset-4"
      )}
    >
      {option.isBestChoice && (
        <div className="absolute top-4 right-4 bg-brand-blue text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
          Best Choice
        </div>
      )}

      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl bg-gradient-to-br",
        colors[option.type]
      )}>
        {icons[option.type]}
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-1 text-slate-900">{option.type}</h3>
        <p className="text-slate-500 text-sm">{option.transportType}</p>
      </div>

      <div className="flex items-center justify-between py-4 border-y border-slate-100">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Cost</span>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-800">{option.costINR}</span>
            <span className="text-sm font-medium text-slate-400">({option.costUSD})</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Time</span>
          <span className="text-xl font-bold text-slate-800">{option.time}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Route Breakdown</span>
        {option.routeSteps.map((step, i) => (
          <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
              {i + 1}
            </div>
            <span>{step}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Local Rates</span>
        {option.costBreakdown.slice(0, 3).map((item, i) => (
          <div key={i} className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">{item.item}</span>
            <span className="text-slate-900 font-bold">{item.cost}</span>
          </div>
        ))}
        {option.costBreakdown.length > 3 && (
          <span className="text-[10px] text-brand-blue font-bold text-center mt-1">+ {option.costBreakdown.length - 3} more details</span>
        )}
      </div>

      <button 
        onClick={onSelect}
        className="mt-auto w-full py-4 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 group-hover:bg-brand-blue transition-colors"
      >
        Select Route <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};

const RouteDetailModal = ({ option, onClose }: { option: TravelOption, onClose: () => void }) => {
  if (!option) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md p-8 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{option.type} Route Details</h3>
              <p className="text-slate-500 text-sm font-medium">{option.transportType}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-blue" /> Detailed Explanation
            </h4>
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <p className="text-slate-600 leading-relaxed">
                {option.detailedExplanation}
              </p>
            </div>
          </section>

          <section>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-green" /> Precautions & Tips
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {option.precautions.map((tip, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-emerald-900 text-sm font-medium leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-brand-blue" /> Local Rates & Cost Breakdown
            </h4>
            <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 space-y-3">
              {option.costBreakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">{item.item}</span>
                  <span className="text-brand-blue font-bold">{item.cost}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Route Steps</h4>
            <div className="space-y-4">
              {option.routeSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 p-4 rounded-2xl border border-slate-100 text-slate-700 text-sm font-medium">
                    {step}
                  </div>
                  {i < option.routeSteps.length - 1 && (
                    <div className="hidden md:block">
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Cost</span>
              <span className="text-xl font-black text-slate-900">{option.costINR}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</span>
              <span className="text-xl font-black text-slate-900">{option.time}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-10 py-4 bg-brand-blue text-white font-bold rounded-2xl shadow-xl shadow-brand-blue/20 hover:scale-105 transition-transform"
          >
            Got it, thanks!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PopularPlaceCard = ({ place, index, isSelected, onClick }: { place: PopularPlace, index: number, isSelected: boolean, onClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={cn(
        "p-8 rounded-[2.5rem] glass group cursor-pointer shadow-xl transition-all duration-300 border border-slate-100 flex flex-col gap-4",
        isSelected ? "ring-4 ring-brand-blue ring-offset-4 bg-brand-blue/5" : "hover:bg-slate-50 hover:scale-[1.02]"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
          <MapPin className="w-6 h-6" />
        </div>
        {isSelected && (
          <div className="bg-brand-blue text-white p-1.5 rounded-full shadow-lg">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}
      </div>
      
      <div>
        <h4 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-brand-blue transition-colors">{place.name}</h4>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
          {place.description}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
        <span>View Routes</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [popularPlaces, setPopularPlaces] = useState<PopularPlace[] | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PopularPlace | null>(null);
  const [startLocation, setStartLocation] = useState('');
  const [isLocationPromptOpen, setIsLocationPromptOpen] = useState(false);
  const [travelOptions, setTravelOptions] = useState<TravelOption[] | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<TravelOption | null>(null);
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!state || !city) return;

    setIsLoading(true);
    setPopularPlaces(null);
    setSelectedPlace(null);
    setTravelOptions(null);
    setSelectedRoute(null);
    
    try {
      const places = await getPopularPlaces(state, city);
      setPopularPlaces(places);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error("Failed to fetch popular places:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceSelect = (place: PopularPlace) => {
    setSelectedPlace(place);
    setIsLocationPromptOpen(true);
    setTravelOptions(null);
  };

  const handleConfirmLocation = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!startLocation || !selectedPlace) return;

    setIsLocationPromptOpen(false);
    setIsOptionsLoading(true);
    setTravelOptions(null);

    try {
      const options = await getTravelOptions(state, city, selectedPlace.name, startLocation);
      setTravelOptions(options);
      setTimeout(() => {
        optionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error("Failed to fetch travel options:", error);
    } finally {
      setIsOptionsLoading(false);
    }
  };

  const handleDetectCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // In a real app, we'd reverse geocode here.
        setStartLocation('My Current Location');
      });
    }
  };

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // In a real app, we'd reverse geocode here. 
        // For this demo, we'll just simulate detection.
        setState('California');
        setCity('San Francisco');
      });
    }
  };

  return (
    <div className="min-h-screen selection:bg-brand-blue/30">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden px-6">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              x: [0, 50, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -120, 0],
              x: [0, -80, 0],
              y: [0, 60, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-3xl" 
          />
        </div>

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-4xl w-full text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Globe className="w-4 h-4" /> Smart Travel Planning
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-slate-900"
          >
            Your Journey, <br />
            <span className="text-gradient">Simplified.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            QuickWay finds the smartest routes for your next adventure. 
            Compare budget, comfort, and luxury options in seconds.
          </motion.p>

          <motion.form 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="glass p-4 md:p-6 rounded-[2rem] md:rounded-full flex flex-col md:flex-row items-center gap-4 shadow-2xl"
          >
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-slate-200">
              <MapPin className="text-brand-blue w-5 h-5 shrink-0" />
              <input 
                type="text" 
                placeholder="Which state?"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="bg-transparent border-none outline-none w-full font-medium placeholder:text-slate-400 text-slate-900"
                required
              />
            </div>
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 md:py-0">
              <Search className="text-brand-green w-5 h-5 shrink-0" />
              <input 
                type="text" 
                placeholder="Which city/location?"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-transparent border-none outline-none w-full font-medium placeholder:text-slate-400 text-slate-900"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-blue transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Find Routes <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </motion.form>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={handleDetectLocation}
            className="mt-8 text-sm font-medium text-slate-500 hover:text-brand-blue flex items-center gap-2 mx-auto transition-colors"
          >
            <Navigation className="w-4 h-4" /> Detect my current location
          </motion.button>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400"
        >
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-slate-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Results Section */}
      <AnimatePresence>
        {popularPlaces && (
          <motion.div 
            id="destinations"
            ref={resultsRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-6 py-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-900">
                Explore <span className="text-brand-blue">{city}</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                We've curated the best places to visit. Select a destination to see how to get there.
              </p>
            </div>

            {/* Popular Places */}
            <div className="mb-24">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                  <Star className="text-yellow-400 fill-yellow-400" /> Popular Destinations
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {popularPlaces.map((place, i) => (
                  <div key={i}>
                    <PopularPlaceCard 
                      place={place} 
                      index={i} 
                      isSelected={selectedPlace?.name === place.name}
                      onClick={() => handlePlaceSelect(place)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Starting Location Prompt */}
            <AnimatePresence>
              {isLocationPromptOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-24 glass p-8 md:p-12 rounded-[3rem] max-w-2xl mx-auto shadow-2xl border-2 border-brand-blue/20"
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Navigation className="text-brand-blue w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Where are you starting from?</h3>
                    <p className="text-slate-500 mt-2">To find the best routes to {selectedPlace?.name}, we need your current location.</p>
                  </div>

                  <form onSubmit={handleConfirmLocation} className="space-y-6">
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-blue">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Enter your current location or hotel name"
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 p-5 pl-14 rounded-2xl outline-none focus:border-brand-blue transition-all font-medium text-slate-900"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        type="button"
                        onClick={handleDetectCurrentLocation}
                        className="flex-1 py-4 px-6 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                      >
                        <Navigation className="w-5 h-5" /> Use My Location
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 py-4 px-6 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-brand-blue transition-all shadow-lg"
                      >
                        Find Routes <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Travel Options Loading */}
            <AnimatePresence>
              {isOptionsLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 gap-4"
                >
                  <div className="w-12 h-12 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
                  <p className="text-slate-500 font-medium">Finding the best routes to {selectedPlace?.name}...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Travel Options */}
            <AnimatePresence>
              {travelOptions && (
                <motion.div
                  ref={optionsRef}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                      <Zap className="text-brand-blue fill-brand-blue" /> Smart Travel Routes to {selectedPlace?.name}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {travelOptions.map((option, i) => (
                      <div key={i}>
                        <TravelOptionCard 
                          option={option} 
                          index={i} 
                          onSelect={() => setSelectedRoute(option)}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section id="features" className="bg-slate-900 py-32 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                Why travelers <br />
                choose <span className="text-brand-green">QuickWay</span>
              </h2>
              <p className="text-slate-400 text-lg mb-12 max-w-md">
                We use advanced AI to analyze thousands of routes, ensuring you get the perfect balance of cost and comfort.
              </p>
              
              <div className="space-y-8">
                {[
                  { icon: <Shield className="text-brand-blue" />, title: "Secure Planning", desc: "Your data and travel plans are always private and encrypted." },
                  { icon: <Zap className="text-brand-green" />, title: "Instant Results", desc: "Get comprehensive route options in under 5 seconds." },
                  { icon: <Globe className="text-brand-blue" />, title: "Global Coverage", desc: "Routes available for over 10,000 cities worldwide." }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                      <p className="text-slate-400">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
              >
                <img 
                  src="https://picsum.photos/seed/travel-app/800/1000" 
                  alt="App Interface" 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              {/* Floating UI Elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 glass p-6 rounded-3xl z-20 hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-green/20 flex items-center justify-center">
                    <CheckCircle2 className="text-brand-green" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Route Optimized</p>
                    <p className="text-lg font-bold text-slate-900">Saved $42.50</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="about" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">Loved by explorers</h2>
            <p className="text-slate-500">Join over 500,000 travelers who plan with QuickWay.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Jenkins", role: "Solo Traveler", text: "QuickWay saved me so much time in Tokyo. The budget routes were incredibly accurate!", avatar: "https://i.pravatar.cc/150?u=sarah" },
              { name: "Marcus Chen", role: "Business Traveler", text: "The luxury options are perfect for when I'm on a tight schedule. Highly recommended.", avatar: "https://i.pravatar.cc/150?u=marcus" },
              { name: "Elena Rodriguez", role: "Digital Nomad", text: "I love the interface. It's so clean and the AI recommendations are spot on every time.", avatar: "https://i.pravatar.cc/150?u=elena" }
            ].map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col gap-6"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-600 italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4 mt-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
                  <div>
                    <p className="font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-gradient-to-br from-brand-blue to-brand-green p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-brand-blue/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight">Ready for your next <br /> adventure?</h2>
            <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Download QuickWay today and start traveling smarter. Available on iOS and Android.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-xl">
                <Globe className="w-6 h-6" /> App Store
              </button>
              <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-xl">
                <Zap className="w-6 h-6" /> Play Store
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Route Detail Modal */}
      <AnimatePresence>
        {selectedRoute && (
          <RouteDetailModal 
            option={selectedRoute} 
            onClose={() => setSelectedRoute(null)} 
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-slate-50 py-20 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                  <Navigation className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold font-display text-slate-900">QuickWay</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Making travel planning effortless with AI-driven route optimization and local insights.
              </p>
            </div>
            
            <div>
              <h5 className="font-bold mb-6 text-slate-900">Product</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-brand-blue transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-brand-blue transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-brand-blue transition-colors">Mobile App</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-slate-900">Company</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-brand-blue transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-brand-blue transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-brand-blue transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-slate-900">Legal</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-brand-blue transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-blue transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-brand-blue transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-xs">© 2026 QuickWay Technologies Inc. All rights reserved.</p>
            <div className="flex gap-6">
              {/* Social Icons would go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
