import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { X, Heart, Star, Info, Flame } from 'lucide-react';
import "./styles/MainBox.css";
import CarDetailModal from "./CarDetailModal";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800";

interface MainBoxProps {
  filters?: {
    make?: string;
    minPrice?: number;
    maxPrice?: number;
    year?: number;
  };
}

const MainBox = ({ filters = {} }: MainBoxProps) => {
  const [cards, setCards] = useState<any[]>([]);
  const [dbPool, setDbPool] = useState<any[]>([]);
  const [nextId, setNextId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [swipeDirection, setSwipeDirection] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchData = useCallback(async (pageNum: number, isInitial: boolean = false) => {
    if (pageNum > 1) setFetchingMore(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams();
      if (filters.make) params.append('make', filters.make);
      if (filters.minPrice) params.append('min_price', filters.minPrice.toString());
      if (filters.maxPrice) params.append('max_price', filters.maxPrice.toString());
      if (filters.year) params.append('year', filters.year.toString());
      params.append('page', pageNum.toString());
      params.append('limit', '15');

      const response = await api.get(`/cars?${params.toString()}`);
      const data = response.data;

      if (isInitial) {
        setDbPool(data);
        if (data.length > 0) {
          const initialStack = data.slice(0, 3).map((car: any, i: number) => ({
            ...car,
            instanceId: i
          }));
          setCards(initialStack);
          setNextId(3);
        }
      } else {
        setDbPool(prev => [...prev, ...data]);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, [filters]);

  useEffect(() => {
    setPage(1);
    fetchData(1, true);
  }, [filters, fetchData]);

  const handleSwipe = useCallback(async (action: "like" | "pass" | "superlike", instanceId: number, carId: string) => {
    // Set exit animation direction based on action
    if (action === "like") setSwipeDirection({ x: 1000, y: 0 });
    else if (action === "pass") setSwipeDirection({ x: -1000, y: 0 });
    else if (action === "superlike") setSwipeDirection({ x: 0, y: -1000 });

    // Send swipe to backend
    api.post("/swipes", { car_id: carId, action }).catch(err => console.error("Error saving swipe:", err));

    setCards((prev) => {
      const remainingStack = prev.filter((card) => card.instanceId !== instanceId);
      
      // Get next car from pool
      // We find the first car in the pool that isn't already in the cards stack
      const nextCarFromPool = dbPool.find(pCar => 
        !remainingStack.some(sCar => sCar._id === pCar._id) && 
        pCar._id !== carId
      );

      if (nextCarFromPool) {
        const nextCard = { ...nextCarFromPool, instanceId: nextId };
        setNextId(id => id + 1);
        
        // Remove the car we just used from the pool to keep it fresh
        setDbPool(prevPool => prevPool.filter(p => p._id !== nextCarFromPool._id));

        return [nextCard, ...remainingStack];
      }
      return remainingStack;
    });
  }, [dbPool, nextId]);

  // Refill pool if running low
  useEffect(() => {
    if (dbPool.length < 5 && !fetchingMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage);
    }
  }, [dbPool.length, fetchingMore, loading, page, fetchData]);

  const manualSwipe = (action: "like" | "pass" | "superlike") => {
    if (cards.length === 0) return;
    const topCard = cards[cards.length - 1];
    handleSwipe(action, topCard.instanceId, topCard._id);
  };

  if (loading) return <div className="loading-screen">Finding rides...</div>;

  return (
    <main className="main-div">
      <div className="card-stack">
        <AnimatePresence mode="popLayout">
          {cards.length > 0 ? (
            cards.map((car, index) => {
              const isTop = index === cards.length - 1;
              const depth = cards.length - 1 - index; 

              return (
                <motion.div
                  key={car.instanceId}
                  className="swipe-card"
                  drag={isTop ? true : false}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 100) handleSwipe("like", car.instanceId, car._id);
                    else if (info.offset.x < -100) handleSwipe("pass", car.instanceId, car._id);
                    else if (info.offset.y < -100) handleSwipe("superlike", car.instanceId, car._id);
                  }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ 
                    scale: 1 - depth * 0.05, 
                    opacity: 1 - depth * 0.25,
                    y: depth * -10,
                    zIndex: index,
                  }}
                  exit={{ 
                    x: swipeDirection.x,
                    y: swipeDirection.y,
                    opacity: 0,
                    rotate: swipeDirection.x / 20,
                    transition: { duration: 0.4, ease: "easeIn" } 
                  }}
                  style={{
                    gridArea: "1 / 1",
                    cursor: isTop ? "grab" : "default"
                  }}
                >

                  <div 
                    className="card-image" 
                    style={{ backgroundImage: `url(${car.image_url || DEFAULT_IMAGE})` }}
                  >
                    <div className="card-overlay">
                      <div className="card-header-info">
                        <h2>{car.specs?.make} {car.specs?.model} <span className="year">{car.specs?.year}</span></h2>
                      </div>
                      <p className="location">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        {car.location?.type === 'Point' ? 'Nearby' : 'Global'}
                      </p>
                      <div className="price-tag">
                        ₹{car.rates?.per_day}/day
                      </div>
                    </div>
                    <button 
                      className="info-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCar(car);
                        setIsDetailOpen(true);
                      }}
                    >
                      <Info size={20} />
                    </button>

                    {isTop && (
                      <div className="action-buttons">
                        <button className="action-btn btn-nope" onClick={(e) => { e.stopPropagation(); manualSwipe('pass'); }}>
                          <X size={28} strokeWidth={2.5} />
                        </button>
                        <button className="action-btn btn-super" onClick={(e) => { e.stopPropagation(); manualSwipe('superlike'); }}>
                          <Star size={20} strokeWidth={2.5} fill="currentColor" />
                        </button>
                        <button className="action-btn btn-like" onClick={(e) => { e.stopPropagation(); manualSwipe('like'); }}>
                          <Heart size={26} strokeWidth={2.5} fill="currentColor" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="empty-state fade-in">
              <div className="empty-pulse">
                 <Flame size={48} fill="white" color="white" />
              </div>
              <h2>All caught up!</h2>
              <p>No more rides in your area. Check back later or adjust your filters.</p>
              <button className="swipe-more-btn" onClick={() => window.location.reload()}>
                Refresh Feed
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      <CarDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        car={selectedCar} 
      />
    </main>
  );
};

export default MainBox;
