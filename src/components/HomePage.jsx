import { useState, useEffect } from 'react';
import '../styles/Home.css';
import fetchMock from '../auth/fetchMock.js';
import { useAuth } from "../auth/useAuth";
import AssignmentCreationForm from './AssignmentCreationForm.jsx';
import nounPersonIcon from '../assets/nounPersonIcon.svg'

export default function HomePage() {
  /* ---------------- Context state ---------------- */
  const { user, logout } = useAuth();

  /* ---------------- UI state ---------------- */
  const [assignmentsData, setAssignmentData] = useState([]);
  const [showCreateAssignment, setShowCreateAssignment] = useState(null);
  const [editAssignment, setEditAssignment] = useState(null);
  const [draft, setDraft] = useState({
      title: '',
      description: '',
      dueDate: '',
      subject: ''
  });
  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);
  const [error, setError] = useState(null);

  // Using mock fetch function to simulate API call
  async function fetchData() {
    try {
      const response = await fetchMock('/assignments');
      const assignments = await response.json();
      setAssignmentData(assignments);
    } catch (error) {
        console.error('Failed to fetch assignments:', error);
        setError('Failed to fetch assignments. Please try again later.');
    }
  }

  useEffect(() => {
      fetchData();
  }, []);

  /* ---------------- Events and Handlers ---------------- */
  const handleAssignmentSubmit = (assignmentObjData) => {
    setAssignmentData(prevData => [...prevData, assignmentObjData]);
    setShowCreateAssignment(false);
  }

  const editAssignmentData = (id) => {
    setEditAssignment(id);
    setDraft(assignmentsData.find(item => item.id === id));
  }

  const deleteAssignment = (id) => {
    setAssignmentData(prevData => prevData.filter(assignment => assignment.id !== id));
  }

  const onDraftChange = (e) => {
    const { name, value } = e.target;
    setDraft(prevDraft => ({
      ...prevDraft,
      [name]: value
    }));
  }

  const clearDraft = () => {
    setDraft({
      title: '',
      description: '',
      dueDate: '',
      subject: ''
    });
  }

  const saveEdit = () => {
    setAssignmentData(prevData => prevData.map(item => item.id === editAssignment ? { ...item, ...draft } : item));
    setEditAssignment(null);
    clearDraft();
  }

  const cancelEdit = () => {
    setEditAssignment(null);
    clearDraft();
  }

  return (
    <div className="layout homepage">
      <aside>
        <nav>
          <img src={nounPersonIcon} className="profile-picture-icon" alt="Profile Picture Icon" />
          <p className="user-info user-name">{userName}</p>
          <p className="user-info user-email">{userEmail}</p>
          <div className="nav-links">
            <p className="active">Home</p>
            <p >All Assignments</p>
          </div>
        </nav>
      </aside>
      <header>
        <div className="welcome-block">
          <h1>Welcome to the Home Page!</h1>
        </div>
        <div className="header-actions">
          <button onClick={logout} className="icon-btn">Logout</button>
        </div>
      </header>
      <main>
        <h2>Your Dashboard</h2>
        <div className="class-info">
          <div className="user-info">
            <label htmlFor="email">User Name: </label>
            <input type="text" id="name" name="name" value={userName} 
            onChange={(e) => setUserName(e.target.value)}
            disabled={user.role === 'user'}/>
          </div>
            <div className="user-info">
              <label htmlFor="email">User email: </label>
              <input type="email" id="emailField" name="emailAddress" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} disabled={user.role === 'user'}/>
            </div>
        </div>

        <div className="toolbar">
          <div className="title">All Assignments</div>
        </div>

        {error && (
          <div className="error-message">
            <p role="alert">{error}</p>
            <p>Please come back later to try again.</p>
          </div>
        )}
          
        <div className="card" role="region" aria-label="Files table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th >Description</th>
                <th >Due Date</th>
                <th>Subject</th>
                <th>Assigned On Date</th>
                {user.role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {assignmentsData.map(item => (
              <tr key={item.id}>
                {editAssignment === item.id ? (
                  <>
                    <td>
                      <input
                        name="title"
                        type="text"
                        value={draft.title}
                        onChange={onDraftChange}
                        autoFocus
                      />
                    </td>
                    <td>
                      <input
                        name="description"
                        type="text"
                        value={draft.description}
                        onChange={onDraftChange}
                      />
                    </td>
                    <td>
                      <input
                        name="dueDate"
                        type="date"
                        value={draft.dueDate}
                        onChange={onDraftChange}
                      />
                    </td>
                    <td>
                      <input
                        name="subject"
                        type="text"
                        value={draft.subject}
                        onChange={onDraftChange}
                      />
                    </td>
                    <td>{item.assignedOn}</td>
                    <td>
                        <button onClick={saveEdit}>Save</button>
                        <button onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>{item.dueDate}</td>
                    <td>{item.subject}</td>
                    <td>{item.assignedOn}</td>
                    {user.role === 'admin' && (
                      <td>
                        <button onClick={() => editAssignmentData(item.id)}>Edit</button>
                        <button onClick={() => deleteAssignment(item.id)}>Delete</button>
                      </td>
                    )}
                  </>
                  )}
              </tr>
              ))}
            </tbody>
          </table>
        </div>
        {user.role === 'admin' && (
          <div className="create-assignment">
            <button className="btn primary cr-assgmt" onClick={() => setShowCreateAssignment(true)}>Create Assignment</button>
          </div>
        )}
        {
          showCreateAssignment && (
            <div className="card">
              <AssignmentCreationForm
                handleAssignmentSubmit={handleAssignmentSubmit}
              />
              <div className="form-actions-cancel">
                <button className="btn cr-assgmt" onClick={() => setShowCreateAssignment(false)}>Cancel</button>
              </div>
            </div>
          )
        }
      </main>
    </div>
  );
}