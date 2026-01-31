import "./styles/MainBox.css";

const MainBox = () => {
  // Simulating data for the cards to keep code DRY (Don't Repeat Yourself)
  const cars = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: "Car data" }));

  return (
    <main className="main-div" aria-label="Car Listings Dashboard">
      <section 
        className="container" 
        role="list" 
        aria-label="List of available cars"
      >
        {cars.map((car) => (
          <article 
            key={car.id} 
            className="card" 
            role="listitem" 
            tabIndex={0} 
            aria-labelledby={`car-title-${car.id}`}
          >
            <h2 id={`car-title-${car.id}`}>{car.title} {car.id}</h2>
          </article>
        ))}
      </section>
    </main>
  );
};

export default MainBox;