import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {/* Edit <code>src/App.js</code> and save to reload. */}
          Trabalho desenvolvido por <b><i>Luciano Piantavigna Rosa</i></b> e <b><i>Juliana Larissa Costa Busato</i></b>
          <br></br> 
          para a disciplina de <b><u>Sistemas Distribuídos</u></b> da <b><u>FAESA</u></b>.
        </p>
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}

export default App;
