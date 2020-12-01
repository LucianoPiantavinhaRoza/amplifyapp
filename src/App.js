import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './logo.svg';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';

const initialFormState = { name: '', description: '' }

function App() {

  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(notesFromAPI.map(async note => {
      if (note.image) {
        const image = await Storage.get(note.image);
        note.image = image;
      }
      return note;
    }))
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }

  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchNotes();
  }
  
  return (

    <div className="App">

    <img 
    src={logo} 
    className="App-logo" 
    alt="logo" 
    />

    <h1>Gerenciador de Anotações</h1>

    <section className="App-form">
      <input
      className="Form-input"
      onChange={e => setFormData({ ...formData, 'name': e.target.value})}
      placeholder="Título da Nota"
      value={formData.name}
      />

      <input
      className="Form-input"
      onChange={e => setFormData({ ...formData, 'description': e.target.value})}
      placeholder="Descrição da Nota"
      value={formData.description}
      />

      <input
      className="Form-input"
      type="file"
      onChange={onChange}
      />

      <button type="submit" onClick={createNote}>Criar Nota</button>
    </section>

    <section className="App-list">
      <div style={{marginBottom: 30}}>
        {
          notes.map(note => (
            <div className="List-body" key={note.id || note.name}>
              <h2 className="List-titulo">{note.name}</h2>
              <p className="List-descricao">{note.description}</p>
              {
                note.image && <img
                              className="List-imagem"  
                              src={note.image} 
                              alt="Imagem da nota." 
                              style={{width: 150, padding: 10, margin: 10}} 
                              />
              }
              <button 
              type="button" 
              className="List-button" 
              onClick={() => deleteNote(note)}>Excluir Nota
              </button>
            </div>
          ))
        }
      </div>
    </section>

    <AmplifySignOut buttonText="Sair do Sistema"/>

    <footer>
      <p>
        Trabalho desenvolvido por <b><i>Luciano Piantavigna Rosa</i></b> e <b><i>Juliana Larissa Costa Busato</i></b> para a disciplina de <b><u>Sistemas Distribuídos</u></b> da <b><u>FAESA</u></b>.
      </p>
    </footer>

    </div>
  );
}

export default withAuthenticator(App);
