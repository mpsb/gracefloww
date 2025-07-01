const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Hero Section */}
      <section className="text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-yellow-500 mb-6 font-display tracking-tighter">
            Evangelize and Engage.
          </h1>
          <p className="text-md md:text-lg text-gray-600 max-w-3xl mx-auto">
            We help Catholic parishes, ministries, and groups in Melbourne
            connect, grow, and thrive with simple software tools like people
            directories, bulletin boards, and event management. Gracefloww
            empowers you to bring people together — wherever they are.
          </p>
          <div className="mt-10">
            <a
              href="/tools"
              className="bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Explore our tools
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
