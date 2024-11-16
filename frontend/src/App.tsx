import { Route, Routes } from 'react-router-dom';
import { Home} from './components/Home';
import Layout from './components/AppLayout';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;