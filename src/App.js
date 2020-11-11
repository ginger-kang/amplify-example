import React, { useEffect, useState } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { createPicture } from './graphql/mutations';
import { listPictures } from './graphql/queries';
import { withAuthenticator } from '@aws-amplify/ui-react';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const initialState = { name: '', description: '' };

const App = () => {
  const [formState, setFormState] = useState(initialState);
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    fetchPictures();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchPictures() {
    try {
      const pictureData = await API.graphql(graphqlOperation(listPictures));
      const pictures = pictureData.data.listPictures.items;
      setPictures(pictures);
    } catch (err) {
      console.log('error fetching todos');
    }
  }

  async function addPicture() {
    try {
      if (!formState.name || !formState.description) return;
      const picture = { ...formState };
      setPictures([...pictures, picture]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createPicture, { input: picture }));
    } catch (err) {
      console.log('error creating todo:', err);
    }
  }

  return (
    <div style={styles.container}>
      <h2>Amplify pictures</h2>
      <input
        onChange={(event) => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={(event) => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <button style={styles.button} onClick={addPicture}>
        add picture
      </button>
      {pictures.map((picture, index) => (
        <div key={picture.id ? picture.id : index} style={styles.picture}>
          <p style={styles.pictureName}>{picture.name}</p>
          <p style={styles.pictureDescription}>{picture.description}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    width: 400,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: 'none',
    backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: 'black',
    color: 'white',
    outline: 'none',
    fontSize: 18,
    padding: '12px 0px',
  },
};
export default withAuthenticator(App);
