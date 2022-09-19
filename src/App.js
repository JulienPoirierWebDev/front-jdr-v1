import React from "react";
import Home from "./pages/Home/Home";
import Hub from "./pages/Hub/Hub";
import CharacterCreation from "./pages/AdventureAsPlayableCharacter/components/CharacterCreation";
import AdventureCreation from "./pages/AdventureCreation";
import AdventureAsPlayableCharacter from "./pages/AdventureAsPlayableCharacter/AdventureAsPlayableCharacter";
import AdventureAsGameMaster from "./pages/AdventureAsGameMaster/AdventureAsGameMaster";


import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import requests from "./services/requests";
import NotFound from "./pages/NotFound/NotFound";


const App = () => {
  return <main>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="vos-aventures" element={<Hub />}/>
        <Route path="creer-un-personnage" element={<CharacterCreation />}/>
        <Route path="creer-une-aventure" element={<AdventureCreation />}/>
        <Route path="vivre-une-aventure/:slug" element={<AdventureAsPlayableCharacter />}/>
        <Route path="maitriser-une-aventure/:slug" element={<AdventureAsGameMaster />}/>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  </main>;
};

export default App;
