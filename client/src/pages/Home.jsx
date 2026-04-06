import { useState } from "react";
import UploadBox from "../components/UploadBox";
import ResultCard from "../components/ResultCard";

export default function Home() {
  const [result, setResult] = useState(null);

  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>
        Civic Issue Reporter
      </h1>

      <UploadBox setResult={setResult} />
      <ResultCard result={result} />
    </div>
  );
}