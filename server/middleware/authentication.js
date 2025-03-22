import jwt from "jsonwebtoken";

const authenticateSocket = (socket, next) => {
    console.log("Handshake Data:", socket.handshake);
    const token = socket.handshake.auth?.token;
    // const token = socket.handshake.query?.token;
    console.log("TOKEN", token);

    if (!token) {
        return next(new Error("Authentication failed: No token provided"));
    }

    jwt.verify(token, process.env.API_SECRET_KEY, (err, decoded) => {
        if (err) {
            return next(new Error("Authentication failed: Invalid token"));
        }

        socket.user_id = decoded.user_id;
        console.log("AUTH FROM auth: ", socket.user_id); // Attach user ID to socket
        next(); // Continue connection
    });
};

export default authenticateSocket;
