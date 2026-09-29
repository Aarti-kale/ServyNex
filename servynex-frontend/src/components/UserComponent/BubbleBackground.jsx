import { useEffect, useState } from "react";

export default function BubbleCursor() {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const handleMove = (e) => {
      setPositions((prev) => {
        const newPos = [{ x: e.clientX, y: e.clientY }, ...prev];
        return newPos.slice(0, 5);
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      {positions.map((pos, index) => (
        <span
          key={index}
          style={{
            position: "fixed",
            left: pos.x,
            top: pos.y,
            width: 10,
            height: 10,
            backgroundColor: "#0e8a5f",
            borderRadius: "50%",
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
            opacity: 1 - index * 0.2,
            transition: "all 0.1s linear",
            zIndex: 9999,
          }}
        />
      ))}
    </>
  );
}
