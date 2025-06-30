const Home = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-yellow-500 mb-6 font-display tracking-tighter">
            Confession Finder
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-6">
            Find nearby Catholic churches in Melbourne offering confession on
            the day nearest to your location. This tool helps you locate the
            closest church with available confession times.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
