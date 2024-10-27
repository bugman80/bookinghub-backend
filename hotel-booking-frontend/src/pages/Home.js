import React from 'react';
import { getUserData } from '../api'

const Home = () => {

  const data = getUserData();

  return (
    <div>
      <h1 className="text-3xl font-bold">Benvenuto, {data?.firstname} {data?.lastname} Prenotiamo?</h1>
      <p className="mt-4 text-gray-700">Scegli l'hotel perfetto per il tuo soggiorno.</p>
    </div>
  );
};

export default Home;
