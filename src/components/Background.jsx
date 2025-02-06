import React, { useRef, useState, useEffect } from "react";

function Background({
  gridColor = "rgb(0, 0, 0)",
  rows = 20, // Number of rows in the grid
  backgroundColor = "white",
  lineWidth = 0.2, // Line width for the grid lines
}) {
  const [columns, setColumns] = useState(80); // Set initial number of columns
  const canvasRef = useRef(null);

  // Function to adjust the number of columns based on screen size
  const adjustColumns = () => {
    const width = window.innerWidth;
    if (width < 600) {
      setColumns(40); // Less columns for small screens
    } else if (width < 1000) {
      setColumns(60); // Medium columns for medium screens
    } else {
      setColumns(80); // More columns for larger screens
    }
  };

  useEffect(() => {
    adjustColumns(); // Adjust columns when component mounts

    // Adjust columns on window resize
    window.addEventListener("resize", adjustColumns);

    return () => {
      window.removeEventListener("resize", adjustColumns); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to fill the whole screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Set the background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate the grid size based on the number of rows and columns
    const gridSizeX = canvas.width / columns;
    const gridSizeY = canvas.height / rows;

    // Set grid line style
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = lineWidth; // Set the grid line width

    // Draw horizontal grid lines
    for (let y = 0; y <= rows; y++) {
      const yPosition = y * gridSizeY;
      ctx.beginPath();
      ctx.moveTo(0, yPosition);
      ctx.lineTo(canvas.width, yPosition);
      ctx.stroke();
    }

    // Draw vertical grid lines
    for (let x = 0; x <= columns; x++) {
      const xPosition = x * gridSizeX;
      ctx.beginPath();
      ctx.moveTo(xPosition, 0);
      ctx.lineTo(xPosition, canvas.height);
      ctx.stroke();
    }
  }, [gridColor, columns, rows, backgroundColor, lineWidth]);
  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, zIndex: -9999 }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: "-99",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 95%)",
        }}
      ></div>
    </>
  );
}

export default Background;
