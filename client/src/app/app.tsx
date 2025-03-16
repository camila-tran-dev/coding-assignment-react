import styles from './app.module.css';
import { Routes, Route } from 'react-router-dom';
/* pages import */
import Tickets from './tickets/tickets';
import TicketDetail from './ticket-detail/ticket-detail';


const App = () => {
  return (
    <div className={styles['app']}>
      {/* <h1>Ticketing App</h1> */}
      <Routes>
        <Route path="/" element={<Tickets />} />
        {/* Hint: Try `npx nx g component  --project=client --no-export` to generate this component  */}
        <Route path="/:id" element={<TicketDetail />} />
      </Routes>
    </div>
  );
};

export default App;
