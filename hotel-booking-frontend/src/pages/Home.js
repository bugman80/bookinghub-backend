import React from 'react';
import { getUserData } from '../api'

const Home = () => {

  const data = getUserData();
  const backgroundImageUrl = `${process.env.REACT_APP_BACKEND_URL}/static/images/hotel_background.jpg`;

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url("${backgroundImageUrl}")` }}
    >
      <div className="text-center text-white bg-black bg-opacity-80 p-8 rounded-lg">
        <h1 className="text-3xl font-bold">Benvenuto, {data?.firstname} {data?.lastname} su Prenotiamo</h1>
        <p className="mt-4 text-gray-300">Scegli l'hotel perfetto per il tuo soggiorno tra le numerose offerte del nostro catalogo</p>
        <p className="mt-4 text-gray-300">e goditi una esperienza indimenticabile nelle migliori location del mondo</p>
        <p className="mt-4 text-gray-300">cosa aspetti? Prenotiamo!</p>
      </div>
    </div>
  );
};

export default Home;
