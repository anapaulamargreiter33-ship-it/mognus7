import axios from "axios";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Catalog from "@/components/Catalog";
import Craft from "@/components/Craft";
import Footer from "@/components/Footer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Home() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/products`)
      .then((r) => setProducts(r.data))
      .catch(() => setError(true));
  }, []);

  return (
    <main className="grain bg-bone text-ivory antialiased">
      <Nav />
      <Hero />
      <Marquee />
      <Catalog products={products} error={error} />
      <Craft />
      <Footer />
    </main>
  );
}
