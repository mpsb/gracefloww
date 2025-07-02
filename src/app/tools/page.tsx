const Home = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-yellow-500 mb-6 font-display tracking-tighter">
            Tools for Faith & Community
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-yellow-500 mb-6 font-display tracking-tighter max-w-3xl mx-auto">
            Empowering Catholics to Deepen Their Faith and Build Stronger
            Communities.
          </h2>
          <div className="bg-container-background-color rounded-lg shadow-md p-6 max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-display">
              Confession Finder
            </h2>
            <p className="text-gray-600 mb-6">
              Find nearby Catholic churches offering confession on the day
              nearest to your location. This tool helps you locate the closest
              church with available confession times.
            </p>
            <a
              href="/tools/catholic-confession-finder"
              className="inline-block bg-yellow-700 hover:bg-yellow-800 text-white px-6 py-3 rounded-lg transition duration-200 font-bold"
            >
              Find a confession near you
            </a>
          </div>
          <h2 className="text-lg md:text-xl text-neutral-400 mb-6 font-display tracking-tighter max-w-3xl mx-auto italic mt-8">
            More tools to come...
          </h2>
        </div>
      </section>
    </div>
  );
};

export default Home;
