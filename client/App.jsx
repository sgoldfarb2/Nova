import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './Components/Landing';
import Visualizer from './Components/Visualizer';
import NotFound from './Components/404';

const SERVER_URI = 'http://localhost:3000/api/schema';

const App = () => {
  const [schema, setSchema] = useState(JSON.parse(sessionStorage.getItem('schema')) || null);
  const [invalidSchema, setInvalidSchema] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const handleUrlClick = (e, url, history) => {
    if (e.key === 'Enter') {
      setInvalidSchema(false);
      setLoadingState(true);
      const postBody = { uri: url };
      fetch(SERVER_URI, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postBody),
      })
        .then(res => res.json())
        .then((data) => {
          setSchema(data);
          return data;
        })
        .then((data) => {
          sessionStorage.setItem('schema', JSON.stringify(data));
          setLoadingState(false);
          history.push('/visualizer');
        })
        .catch(err => setInvalidSchema(true));
    }
  };

  return (
    <Router>
      <div>
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <Landing
                {...props}
                loadingState={loadingState}
                invalidSchema={invalidSchema}
                handleUrlClick={handleUrlClick}
              />
            )}
          />
          <Route
            path="/visualizer"
            render={props => <Visualizer {...props} schemaGraph={schema} />}
          />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
