import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Static from "./Route/Static";
import ClassCreate from "./Route/ClassCreate";
import VideoStream from "./Route/VideoStream";
import JoinClass from "./Route/JoinClass";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Static} />
          <Route exact path="/class" component={ClassCreate} />
          <Route exact path="/join" component={JoinClass} />
          <Route exact path="/video/:id/:id2" component={VideoStream} />
          <Route exact path="/video/:id/" component={VideoStream} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
