import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Home from "./pages/Home.tsx";
import Game from "./pages/Game.tsx";
import History from "./pages/History.tsx";
import Profile from "./pages/Profile.tsx";
import Shop from "./pages/Shop.tsx";
// import { useSocket } from "./services/SocketContext.tsx";
import { SocketProvider } from "./services/SocketContext.tsx";
console.log({ Landing, Login, Register, Home, Game, History, Profile, Shop });


const App = () => {
  const [isClient, setIsClient]= useState(false);

  useEffect(()=>{
    setIsClient(true);
  });


  return (
        <main className="main-content">
        {isClient ?(
        <SocketProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PROTECTED ROUTES */}
            {/* <Route element={<ProtectedRoute />}> */}
              <Route path="/home" element={<Home />} />
              <Route path="/game" element={<Game />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/shop" element={<Shop />} />
            {/* </Route> */}
          </Routes>
        </SocketProvider>
         ) : (
          <p>Loading...</p> // Placeholder while waiting for hydration
        )}
      </main>
  );
};

export default App;
