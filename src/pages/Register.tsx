import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
// import { useSocket } from "../services/SocketContext";
import { connectSocket } from "../services/socket";
import { FaUserCircle, FaEnvelope, FaLock, FaCalendarAlt, FaPhone } from "react-icons/fa";
import coindrop from "../assets/images/coindrop.png";
import lm from "../assets/images/2.png";

const Register = () => {
  const navigate = useNavigate();
  const socket = connectSocket();
  // const {socket} = useSocket();

  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    birthdate: "",
    contact_num: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Sending registration data:", formData);

    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    socket.emit("registerUser", formData); // SEND DATA TO BACKEND/SERVER

    socket.once("accountCreated", (data) => {
      console.log("Account created successfully:", data);
      alert(data.message);
      navigate("/login");
    });

    socket.once("creationError", (error) => {
      console.error("Registration error:", error);
      alert(error.message);
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="py-4 px-6 flex justify-between items-center border-b border-yellow-500/30">
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <img src={lm} alt="logo" className="w-12 h-12 mr-2"></img>
          <h1 className="text-2xl font-bold text-yellow-400">LottoMoto</h1>
        </div>
        <div className="flex items-center gap-4">
          <a className="text-yellow-400 hover:text-yellow-300 transition-colors px-4 py-2 flex items-center cursor-pointer"
           onClick={() => navigate("/login")}>
            <FaUserCircle className="mr-2" />
            Login
          </a>
          <a className="bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 cursor-pointer hover:to-yellow-300 text-black font-bold px-4 py-2 rounded-md shadow-lg transition-all"
            onClick={() => navigate("/register")}>
            Register
          </a>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative">
        <div className="absolute inset-0 z-0">
          <div 
            style={{
              backgroundImage: `url(${coindrop})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.3, 
            }}
          ></div>
        </div>

        <div className="w-full max-w-md z-10 relative">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-wider text-yellow-400 drop-shadow-[0_0_8px_rgba(255,215,0,0.7)]">
              CREATE YOUR ACCOUNT
            </h2>
          </div>
          <div className="bg-black/80 rounded-lg border border-yellow-500/50 shadow-lg shadow-yellow-500/20 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="user_name" className="block text-sm font-medium text-yellow-300 mb-1">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserCircle className="text-yellow-600" />
                  </div>
                  <input
                    type="text"
                    name="user_name"
                    id="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 bg-black/80 py-2 pl-10 pr-3 text-white ring-1 ring-yellow-600 focus:ring-yellow-400 focus:ring-2"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-yellow-300 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-yellow-600" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 bg-black/80 py-2 pl-10 pr-3 text-white ring-1 ring-yellow-600 focus:ring-yellow-400 focus:ring-2"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-yellow-300 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-yellow-600" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 bg-black/80 py-2 pl-10 pr-3 text-white ring-1 ring-yellow-600 focus:ring-yellow-400 focus:ring-2"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="birthdate" className="block text-sm font-medium text-yellow-300 mb-1">Birthdate</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-yellow-600" />
                  </div>
                  <input
                    type="date"
                    name="birthdate"
                    id="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 bg-black/80 py-2 pl-10 pr-3 text-white ring-1 ring-yellow-600 focus:ring-yellow-400 focus:ring-2"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact_num" className="block text-sm font-medium text-yellow-300 mb-1">Contact Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-yellow-600" />
                  </div>
                  <input
                    type="text"
                    name="contact_num"
                    id="contact_num"
                    value={formData.contact_num}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 bg-black/80 py-2 pl-10 pr-3 text-white ring-1 ring-yellow-600 focus:ring-yellow-400 focus:ring-2"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <a onClick={() => navigate("/login")} className="text-sm text-yellow-400 hover:text-yellow-300 cursor-pointer">Already registered?</a>
                <button 
                  type="submit" 
                  className="px-6 py-2 rounded-md bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-bold border border-yellow-500/50 shadow-md hover:shadow-yellow-500/20"
                >
                  REGISTER
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;