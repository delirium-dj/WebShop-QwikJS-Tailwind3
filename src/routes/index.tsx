import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Hero } from "../components/Hero";
import { Categories } from "../components/home/Categories";
import { Banner } from "../components/home/Banner";
import { FeaturedProducts } from "../components/home/FeaturedProducts";
import { getLatestProducts } from "../data/mockProducts";

export const useFeaturedProducts = routeLoader$(async () => {
  return getLatestProducts(4);
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
