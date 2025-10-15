import {useState} from 'react';
export default function AssignmentCreationForm({handleAssignmentSubmit}) {
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAssignment= {
        id: `${subject}_${new Date()}`,
        title: assignmentTitle,
        subject: subject,
        description: description,
        dueDate: dueDate,
        assignedOn: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format    
    };
    handleAssignmentSubmit(newAssignment);
  }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="assignmentTitle">Assignment Title:</label>
                <input
                type="text"
                id="assignmentTitle"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                required
                />
            </div>
            <div>
                <label htmlFor="subject">Subject:</label>
                <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                />
            </div>
            <div>
                <label htmlFor="subject">Description:</label>
                <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                />
            </div>
            <div>
                <label htmlFor="dueDate">Due Date:</label>
                <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                />
            </div>
            <div className="form-actions">
                <button type="submit">Create Assignment</button>
            </div>
        </form>

    )
}

