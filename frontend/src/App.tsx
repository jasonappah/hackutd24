import { Route, Routes } from 'react-router-dom';
import { Home} from './components/Home';
import Layout from './components/AppLayout';

function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
      {/* <Route element={<Layout />}>
      </Route> */}
    </Routes>
  );
}

export default App;