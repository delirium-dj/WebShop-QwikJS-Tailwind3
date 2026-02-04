import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from '@builder.io/qwik-city';
import { Hero } from '../components/Hero';
import { Categories } from '../components/home/Categories';
import { Banner } from '../components/home/Banner';
import { FeaturedProducts } from '../components/home/FeaturedProducts';

export const useFeaturedProducts = routeLoader$(async () => {
  return [
    {
      id: 1,
      title: 'Classic Jacket',
      price: 120,
      image: '/images/products/jacket.jpg',
    },
    {
      id: 2,
      title: 'Summer Dress',
      price: 90,
      image: '/images/products/dress.jpg',
    },
    {
      id: 3,
      title: 'Leather Bag',
      price: 150,
      image: '/images/products/bag.jpg',
    },
    {
      id: 4,
      title: 'Sneakers',
      price: 110,
      image: '/images/products/sneakers.jpg',
    },
  ];
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
