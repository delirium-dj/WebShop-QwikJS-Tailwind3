import { component$ } from '@builder.io/qwik';
import { Hero } from '../Hero';
import { Categories } from './Categories';
import { Banner } from '../Banner';

export default component$(() => {
  return (
    <>
      <Hero />
      <Categories />

      <Banner />
    </>
  );
});
