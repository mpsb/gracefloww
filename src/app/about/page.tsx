const Home = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-yellow-500 mb-6 font-display tracking-tighter">
            About Gracefloww
          </h1>
          <p className="text-md md:text-lg text-gray-600 max-w-3xl mx-auto">
            At Gracefloww, we believe that faith, connection, and shared purpose
            are the bedrock of a thriving Catholic community. Our mission is to
            empower parishes, ministries, and individuals to connect,
            collaborate, and grow in their spiritual journey as one united
            family of believers. We strive to make it easier for all Catholics
            to live a life of holiness and health, rooted in the teachings of
            the Church and the spirit of service.
            <br />
            <br />
            Gracefloww was founded in 2025 by Matthew Bilo, a cradle Catholic
            who has dedicated over 15 years of service to Hong Kong Catholic
            parishes and Missionary Families for Christ, a Catholic lay
            organization. His journey began in his teenage years, driven by a
            deep commitment to faith and community. He is committed to
            continuing his lifelong commitment to fostering a strong Catholic
            community through Gracefloww in Melbourne.
            <br />
            <br />
            If you're interested in partnering with us or learning more, please
            reach out via email at <b>matthew@gracefloww.com</b>, or connect
            with us on{" "}
            <a
              href="https://www.linkedin.com/in/matthewbilo/"
              target="_blank"
              className="underline hover:text-gray-500 transition-all duration-300"
            >
              Linkedin
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
