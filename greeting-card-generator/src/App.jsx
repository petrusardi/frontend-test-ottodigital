import React, { useState } from "react";
import PreviewCard from "./components/PreviewCard";

function App() {
  const [cardData, setCardData] = useState(null);

  const handleCardGeneration = (data) => {
    setCardData(data);
  };

  return (
    <div>
      <PreviewCard cardData={cardData} />
    </div>
  );
}

export default App;
