import { Navigate, Route, Routes } from 'react-router-dom';
import SurveyPage from './SurveyPage';
import AdminPage from './AdminPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SurveyPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
