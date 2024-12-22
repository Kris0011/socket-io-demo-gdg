import { useState, useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";

function App() {
  const [socket, setSocket] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);

  const [rooms, setRooms] = useState<any>([]);

  const [recievedData, setRecievedData] = useState<any>([]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    socket.emit("message", { data, room });
  };

  const handleRoomSubmit = (e: any) => {
    e.preventDefault();
    socket.emit("roomMessage", { data, rooms });
  };

  useEffect(() => {
    const socket = io("http://localhost:9000");

    socket.on("connect", () => {
      setSocket(socket);
    });

    socket.on("message", (msg: string) => {
      console.log(msg);
      setRecievedData((prev: any) => [...prev, msg]);
    });

    socket.on("privateMessage", (msg: string) => {
      console.log(msg);
      setRecievedData((prev: any) => [...prev, msg]);
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <h1 className=" text-3xl">Socket.io app</h1>
      <h2 className=" text-2xl">Socket id: {socket?.id}</h2>

      <label htmlFor="room">Room</label>
      <input
        type="text"
        name=""
        id="room"
        onChange={(e) => setRooms(e.target.value)}
        className="bg-white border-black border-2 m-2 p-px text-black"
      />
      <button onClick={() => socket.emit("joinRoom", rooms)}>Join room</button>

      <label htmlFor="data">Data</label>
      <input
        type="text"
        name=""
        id="data"
        onChange={(e) => setData(e.target.value)}
        className="bg-white border-black border-2 m-2 p-px text-black"
      />

      <button onClick={handleRoomSubmit}>Send</button>
      {/* <h2></h2> */}

      <label htmlFor="room">To UserId:</label>
      <input
        type="text"
        name=""
        id="room"
        onChange={(e) => setRoom(e.target.value)}
        className="bg-white border-black border-2 m-2 p-px text-black"
      />

      <button onClick={handleSubmit}>Send</button>

      <div className="flex flex-col">
        {recievedData.map((item: any, index: number) => {
          return <p key={index}>{item}</p>;
        })}
      </div>
    </div>
  );
}

export default App;
