import { useState } from "react";

function AddCountryForm({ onAdd, color, error }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={"Enter country name"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <button type="submit" style={{ backgroundColor: color }}>
        Add
      </button>
    </form>
  );
}

export default AddCountryForm;