import React, { useState, useRef } from "react";

function PreviewCard() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("Your Greeting Message");
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 150, y: 150 });
  const [namePosition, setNamePosition] = useState({ x: 150, y: 100 });
  const [fromPosition, setFromPosition] = useState({ x: 150, y: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggingText, setDraggingText] = useState("");
  const canvasRef = useRef(null);
  const [nameError, setNameError] = useState("");
  const [textError, setTextError] = useState("");
  const [fromError, setFromError] = useState("");
  const [imageError, setImageError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
          setImageError("");
        };
        reader.readAsDataURL(file);
      } else {
        setImageError("Please upload a valid image file.");
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImageError("");
      };
      reader.readAsDataURL(file);
    } else {
      setImageError("Please upload a valid image file.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const drawTextOnImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.font = "30px 'Dancing Script', cursive";
      ctx.fillStyle = "brown";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(name, namePosition.x, namePosition.y);
      ctx.fillText(text, textPosition.x, textPosition.y);
      ctx.fillText(from, fromPosition.x, fromPosition.y);
    };

    if (image) {
      img.src = image;
    }
  };

  const handleDownload = () => {
    let valid = true;
    if (!name) {
      setNameError("Name is required.");
      valid = false;
    } else {
      setNameError("");
    }

    if (!text) {
      setTextError("Message is required.");
      valid = false;
    } else {
      setTextError("");
    }

    if (!from) {
      setFromError("From is required.");
      valid = false;
    } else {
      setFromError("");
    }

    if (!image) {
      setImageError("Please upload an image.");
      valid = false;
    } else {
      setImageError("");
    }

    if (!valid) return;

    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "greeting-card.png";
    link.click();
  };

  const handleMouseDown = (e) => {
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;

    if (
      mouseX >= namePosition.x - 100 &&
      mouseX <= namePosition.x + 100 &&
      mouseY >= namePosition.y - 30 &&
      mouseY <= namePosition.y + 30
    ) {
      setIsDragging(true);
      setDraggingText("name");
    } else if (
      mouseX >= textPosition.x - 100 &&
      mouseX <= textPosition.x + 100 &&
      mouseY >= textPosition.y - 30 &&
      mouseY <= textPosition.y + 30
    ) {
      setIsDragging(true);
      setDraggingText("text");
    } else if (
      mouseX >= fromPosition.x - 100 &&
      mouseX <= fromPosition.x + 100 &&
      mouseY >= fromPosition.y - 30 &&
      mouseY <= fromPosition.y + 30
    ) {
      setIsDragging(true);
      setDraggingText("from");
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const mouseX = e.nativeEvent.offsetX;
      const mouseY = e.nativeEvent.offsetY;

      if (draggingText === "name") {
        setNamePosition({ x: mouseX, y: mouseY });
      } else if (draggingText === "text") {
        setTextPosition({ x: mouseX, y: mouseY });
      } else if (draggingText === "from") {
        setFromPosition({ x: mouseX, y: mouseY });
      }

      drawTextOnImage();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingText("");
  };

  React.useEffect(() => {
    if (image) {
      drawTextOnImage();
    }
  }, [image, text, name, from, namePosition, textPosition, fromPosition]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-purple-50">
      <div className="bg-white items-center rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Gift Card
          </h1>
          {image && (
            <div className="w-full items-center mb-4 relative">
              <label className="block text-sm font-medium text-gray-700">
                You Can Drag Text
              </label>
              <canvas
                ref={canvasRef}
                width={500}
                height={500}
                className="border border-gray-300 mb-4 w-full max-w-full mx-auto"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => setIsDragging(false)}
              ></canvas>
            </div>
          )}
          <div className="w-full mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              File Upload
            </label>
            <div
              className="w-full p-6 border-2 border-dashed border-gray-300 rounded-md flex justify-center items-center text-center bg-gray-100 cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <div className="flex flex-col items-center space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-16 w-16 text-gray-500"
                >
                  <path
                    d="M19 17H6a4 4 0 1 1 0-8h.35a5.507 5.507 0 0 1 10.3 0H19a4 4 0 1 1 0 8z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <p className="text-sm text-black">Browse Files</p>
                <p className="text-sm text-gray-500">
                  Drag & Drop your file here
                </p>
              </div>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            {imageError && (
              <p className="text-red-500 text-xs mt-1">{imageError}</p>
            )}
          </div>
          <div className="w-full mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Dear
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
            {nameError && (
              <p className="text-red-500 text-xs mt-1">{nameError}</p>
            )}
          </div>
          <div className="w-full mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Message
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your greeting"
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
            {textError && (
              <p className="text-red-500 text-xs mt-1">{textError}</p>
            )}
          </div>
          <div className="w-full mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              From
            </label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Enter your name or signature"
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
            {fromError && (
              <p className="text-red-500 text-xs mt-1">{fromError}</p>
            )}
          </div>
          <div className="mb-4">
            <button
              onClick={handleDownload}
              className="bg-green-500 text-white py-2 px-6 w-full"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewCard;
