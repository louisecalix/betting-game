import { useState, useEffect } from 'react';
import Header from '../components/headers/Header';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../services/SocketContext';
import avatar from '../assets/images/spidey.jpg';

const Profile = () => {
  const navigate = useNavigate();
  const { socket, isAuthenticated } = useSocket() || {};
  const [profile, setProfile] = useState({ data: { user_name: "", email: "", birthdate: "" } });
  const [withdraw, setWithdraw] = useState(0);

  useEffect(() => {
    // if (!isAuthenticated) {
    //   navigate("/login");
    // }

    if (!socket) return;

    const handleProfile = (data: { data: any; message: string }) => {
      console.log("Profile data received:", data);
      if (data.data) {
        setProfile(data);
      } else {
        console.error("Error fetching profile:", data.message);
      }
    };

    // console.log("req profile info...");
    socket.emit("userProfile");

    socket.on("sendProfile", handleProfile);

    return () => {
      socket.off("sendProfile", handleProfile);
    }
  }, [socket, isAuthenticated]);
  

  const userData = {
    username: profile?.data.user_name || "Loading...",
    avatar: {
      src: avatar,
      alt: "Avatar",}, 
    birthdate: profile?.data.birthdate || "Unknown"
  };


  const handleWithdraw = () => {
    if (socket) {
      socket.emit("deposit", withdraw);
    }
  };


  const handleLogout = () => {
    console.log("Logout button clicked");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    if (socket) {
      socket.disconnect();  
    }
    navigate("/");
    window.location.reload();

  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Header
        title="Profile"
        activePage="profile"
      />
      
      <div className="flex-1 overflow-hidden relative z-10 md:mx-6 lg:mx-20">
        <div className="p-4 overflow-auto h-full">
  
          <div className="relative mb-6 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/50 to-red-600/50 blur-md"></div>
            <div className="relative p-6 bg-black bg-opacity-80 backdrop-blur-sm rounded-xl border-2 border-yellow-500 overflow-hidden">
              <div className="flex flex-col md:flex-row items-center">
                <div className="relative mb-4 md:mb-0 md:mr-6">
                  <div className="absolute inset-0 bg-yellow-500 rounded-full blur-sm animate-pulse-slow"></div>
                  <img 
                    src={avatar}
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border-4 border-yellow-500 relative z-10"
                  />
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-yellow-500">{userData.username}</h1>
                  
                  <div className="mt-4">
                    {/* <div className="bg-gradient-to-r from-black to-red-900/30 p-3 rounded-lg border border-red-700/50">
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/60 border-2 border-yellow-500 rounded-xl p-6">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-yellow-500">Account Settings</h2>
                
                <div className="space-y-6">
                  {/* USER INFO */}
                  <div className="bg-gradient-to-r from-black to-red-900/20 p-4 rounded-lg border border-red-700/30">
                    <h3 className="text-xl font-semibold mb-4 text-yellow-500">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Username</label>
                        <input 
                          type="text" 
                          value={userData.username || "Loading..."} 
                          className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Email Address</label>
                        <input 
                          type="email" 
                          value={profile?.data.email || "Loading..."} 
                          className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>

          <div className="flex gap-4 justify-between bg-black/60 border-2 border-yellow-500 rounded-xl p-6 mt-6">
            <button 
              onClick={handleWithdraw}
              className="px-[20%] py-3 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-bold rounded-lg border-2 border-red-500 shadow-lg transform transition-transform hover:scale-105 flex items-center">
                Withdraw</button>

            <button
              onClick={handleLogout}
              className="hidden md:flex px-[20%] py-3 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-bold rounded-lg border-2 border-red-500 shadow-lg transform transition-transform hover:scale-105 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
          

          {/* <div className="mt-6 hidden md:flex justify-between">

          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;