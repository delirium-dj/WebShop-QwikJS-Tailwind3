import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { Hero } from "../components/Hero";
import { Categories } from "../components/home/Categories";
import { Banner } from "../components/home/Banner";
import { FeaturedProducts } from "../components/home/FeaturedProducts";
import { getAllProducts } from "~/services/api/products";
import { mapApiProductsToProducts } from "~/utils/product-mapper";

export const useFeaturedProducts = routeLoader$(async () => {
  // Fetch from the real API (FakeStore)
  const apiProducts = await getAllProducts({ limit: 4, sort: 'desc' });
  
  // Transform the data to our internal format
  if (apiProducts && apiProducts.length > 0) {
    return mapApiProductsToProducts(apiProducts);
  }

  // Fallback to empty
  return [];
});

export default component$(() => {
  const featured = useFeaturedProducts();

  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts products={featured.value} />
      <Banner />
    </>
  );
});

export const head: DocumentHead = {
  title: "Reconstruct Shop QwikJS",
  meta: [
    {
      name: "description",
      content: "Reconstruct Shop QwikJS",
    },
  ],
};
