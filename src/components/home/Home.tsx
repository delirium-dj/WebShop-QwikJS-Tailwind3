import { component$ } from '@builder.io/qwik';
import { Hero } from '../Hero';
import { Categories } from './Categories';
import { FeaturedProducts } from './FeaturedProducts';
import { Banner } from '../Banner';
import { routeLoader$ } from '@builder.io/qwik-city';

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
