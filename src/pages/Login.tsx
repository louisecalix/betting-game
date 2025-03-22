import { useState, useEffect } from "react";
import { useSocket } from "../services/SocketContext";
// import { connectSocket, disconnectSocket, getSocket } from "../services/socket";
// import { useAuth } from "../services/AuthContext";
import { FaCoins, FaUserCircle, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import coindrop from "../assets/images/coindrop.png";
import lm from "../assets/images/2.png";

const Login: React.FC = () => {
  const { socket, connectWithAuth } = useSocket() || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      socket.on('LoggedIn', (data) => {
        console.log('✅ Login Success:', data);
        setStatus('✅ ${data.message}');

        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.user_id);

        // Reconnect the socket with authentication data
        if (connectWithAuth) {
          connectWithAuth(data.token, data.user_id);
        }

        navigate('/home');
      });

      socket.on('logInError', (data) => {
        console.error('❌ Login Error:', data.error);
        setStatus('❌ Login Error, Try again');
      });

      return () => {
        socket.off('LoggedIn');
        socket.off('logInError');
      };
    }
  }, [socket, navigate, connectWithAuth]);

  const handleLogin = () => {
    if (socket) {
      console.log('📩 Sending Login Request:', { email, password });
      socket.emit('userLogIn', { email, password });
    } else {
      console.error('⚠️ Socket not connected.');
      setStatus('⚠️ Socket not connected. Please try again later.');
    }
  };



  return (
    <div className="min-h-screen bg-black text-white flex flex-col bg-gradient-to-b from-black to-red-900/30">
      <header className="py-4 px-6 flex justify-between items-center border-b border-yellow-500/30">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={lm} alt="logo" className="w-12 h-12 mr-2"></img>
          <h1 className="text-2xl font-bold text-yellow-400">LottoMoto</h1>
        </div>
        <div className="flex items-center gap-4">
          <a
            className="text-yellow-400 hover:text-yellow-300 transition-colors px-4 py-2 flex items-center cursor-pointer"
            onClick={() => navigate("/login")}
          >
            {" "}
            <FaUserCircle className="mr-2" /> Login{" "}
          </a>
          <a
            className="bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 
          hover:to-yellow-300 text-black font-bold px-4 py-2 rounded-md shadow-lg transition-all cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </a>
        </div>
      </header>

      {/* {MAIN FRAME} */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative"
        style={{
          backgroundImage: `url(${coindrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold tracking-wider text-yellow-400">
              LOGIN TO YOUR ACCOUNT
            </h2>
          </div>

          <div className="bg-black/85 rounded-lg border-2 border-yellow-500/70 shadow-[0_0_25px_rgba(255,215,0,0.3)] p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-6"
            >
              {/* <form onSubmit={handleSubmit} className="space-y-6"> */}
              {status && (
                <div className="p-3 text-sm bg-red-900/50 border border-red-500 rounded-md text-red-300">
                  {status}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-yellow-300 mb-2"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-yellow-600" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    required
                    className="block w-full rounded-md border-0 bg-black/90 py-3 pl-10 pr-4 text-white 
                    shadow-sm ring-1 ring-yellow-600 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-yellow-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-yellow-600" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 bg-black/90 py-3 pl-10 pr-4 text-white shadow-sm 
                    ring-1 ring-yellow-600 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-md font-semibold text-white bg-gradient-to-r 
                  from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 
                  hover:scale-[1.05] transition-all duration-500 ease-in-out 
                  border border-yellow-500/70 shadow-[0_0_15px_rgba(255,0,0,0.7)]"
                >
                  SIGN IN
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-yellow-400/90">
              Not a player?{" "}
              <a
                className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors 
                duration-300 underline cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Create an account here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
