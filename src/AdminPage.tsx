import { FormEvent, useMemo, useState } from 'react';
import type { SurveySubmission } from './types';

const ADMIN_PASSWORD = 'admin123';

const toCsv = (rows: SurveySubmission[]): string => {
  const header = ['Timestamp', 'Shoe size system', 'Shoe size value', 'Country', 'Sail number', 'Home yacht club'];
  const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

  const content = rows.map((row) => [
    row.timestamp,
    row.sizeSystem,
    row.shoeSize,
    row.country,
    row.sailNumber ?? '',
    row.homeYachtClub ?? '',
  ].map((value) => escapeCell(value)).join(','));

  return [header.join(','), ...content].join('\n');
};

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [authError, setAuthError] = useState('');
  const [submissions, setSubmissions] = useState<SurveySubmission[]>([]);
  const [loadError, setLoadError] = useState('');

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions');
      if (!response.ok) throw new Error('Failed to load submissions.');
      const data = await response.json();
      setSubmissions(data.submissions ?? []);
      setLoadError('');
    } catch {
      setLoadError('Could not load submissions from the server.');
    }
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== ADMIN_PASSWORD) {
      setAuthError('Incorrect password.');
      return;
    }

    setAuthorized(true);
    setAuthError('');
    await fetchSubmissions();
  };

  const csvData = useMemo(() => toCsv(submissions), [submissions]);

  const downloadCsv = () => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shoe-survey-submissions.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!authorized) {
    return (
      <main className="container">
        <section className="card">
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <label htmlFor="adminPassword">Password</label>
            <input
              id="adminPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {authError && <p className="error">{authError}</p>}
            <button className="button" type="submit">Log In</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <section className="card admin-card">
        <div className="admin-header">
          <h1>Submissions</h1>
          <div className="admin-actions">
            <button className="button secondary" type="button" onClick={fetchSubmissions}>Refresh</button>
            <button className="button" type="button" onClick={downloadCsv}>Download CSV</button>
          </div>
        </div>

        {loadError && <p className="error">{loadError}</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Shoe size system</th>
                <th>Shoe size value</th>
                <th>Country</th>
                <th>Sail number</th>
                <th>Home yacht club</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={6}>No submissions yet.</td>
                </tr>
              ) : (
                submissions.map((submission, index) => (
                  <tr key={`${submission.timestamp}-${index}`}>
                    <td>{new Date(submission.timestamp).toLocaleString()}</td>
                    <td>{submission.sizeSystem}</td>
                    <td>{submission.shoeSize}</td>
                    <td>{submission.country}</td>
                    <td>{submission.sailNumber ?? ''}</td>
                    <td>{submission.homeYachtClub ?? ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
