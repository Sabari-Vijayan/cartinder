import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./styles/MainBox.css";

// Fallback image in case the DB doesn't have one
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800";

const MainBox = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [dbPool, setDbPool] = useState<any[]>([]);
  const [nextId, setNextId] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data from MongoDB on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cars");
        const data = response.data;
        
        if (data.length > 0) {
          setDbPool(data);
          // Initialize stack with first 3 cars
          const initialStack = data.slice(0, 3).map((car: any, i: number) => ({
            ...car,
            instanceId: i
          }));
          setCards(initialStack);
          setNextId(3);
        }
      } catch (error) {
        console.error("Error fetching cars from DB:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSwipe = useCallback((direction: "left" | "right", instanceId: number) => {
    console.log(`Swiped ${direction} on instance ${instanceId}`);
    
    setCards((prev) => {
      const newStack = prev.filter((card) => card.instanceId !== instanceId);
      
      if (dbPool.length > 0) {
        // Get a random car from the pool to keep it infinite
        const randomCar = dbPool[Math.floor(Math.random() * dbPool.length)];
        const nextCard = { ...randomCar, instanceId: nextId };
        setNextId(id => id + 1);
        return [nextCard, ...newStack];
      }
      return newStack;
    });
  }, [dbPool, nextId]);

  if (loading) return <div className="main-div"><h2>Loading Cars...</h2></div>;

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
                  drag={isTop ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 100) handleSwipe("right", car.instanceId);
                    else if (info.offset.x < -100) handleSwipe("left", car.instanceId);
                  }}
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ 
                    scale: 1 - depth * 0.05, 
                    opacity: 1,
                    y: depth * -15,
                    zIndex: index,
                  }}
                  exit={{ 
                    x: info => info > 0 ? 500 : -500,
                    opacity: 0,
                    scale: 0.5,
                    transition: { duration: 0.4 } 
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
                      <h2>{car.specs?.make} {car.specs?.model} <span className="year">{car.specs?.year}</span></h2>
                      <p className="location">📍 {car.location?.type === 'Point' ? 'Nearby' : 'Global'}</p>
                      <p className="price">₹{car.rates?.per_day}/day</p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="empty-state">
              <h2>No cars found in database.</h2>
              <p>Try adding some cars to your MongoDB collection!</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default MainBox;