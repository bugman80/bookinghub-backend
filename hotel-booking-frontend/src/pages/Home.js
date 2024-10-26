import React from 'react';

const Home = () => {

  const access = localStorage.getItem('access');

  return (
    <div>
      <h1 className="text-3xl font-bold">Benvenuto a MyHotel {access?.name} {access?.lastname}</h1>
      <p className="mt-4 text-gray-700">Scegli l'hotel perfetto per il tuo soggiorno.</p>
    </div>
  );
};

export default Home;
