import { useState } from "react";
import { useHistory } from "react-router";

export default function JoinClass() {
  const history = useHistory();
  const [unique, setunique] = useState();

  const uniqueHandler = (e) => {
    setunique(e.target.value);
  };
  const makeRoute = () => {
    if (unique) {
      history.push(`video/${unique}`);
    } else {
      alert("Fill all the field.");
    }
  };
  return (
    <div>
      <input
        type="text"
        name="unique"
        placeholder="enter unique key"
        onChange={uniqueHandler}
      />

      <button onClick={makeRoute}>Submit</button>
    </div>
  );
}
