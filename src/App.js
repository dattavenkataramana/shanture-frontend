 
 import React, { useState, useEffect } from 'react';
 import axios from 'axios';
 import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
 import jsPDF from 'jspdf';
 import 'bootstrap/dist/css/bootstrap.min.css';
 import './App.css'
 const App = () => {
   const [tasks, setTasks] = useState([]);
   const [newTask, setNewTask] = useState('');
 
   useEffect(() => {
     fetchTasks();
   }, []);
 
   const fetchTasks = async () => {
     const response = await axios.get('http://localhost:5000/api/tasks');
     setTasks(response.data);
   };
 
   const addTask = async () => {
     if (newTask.trim()) {
       const response = await axios.post('http://localhost:5000/api/tasks', { description: newTask });
       setTasks([...tasks, response.data]);
       setNewTask('');
     }
   };
 
   const deleteTask = async (id) => {
     await axios.delete(`http://localhost:5000/api/tasks/${id}`);
     setTasks(tasks.filter(task => task.id !== id));
   };
 
   const toggleCompletion = async (id) => {
     const task = tasks.find(task => task.id === id);
     const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !task.completed });
     setTasks(tasks.map(task => task.id === id ? response.data : task));
   };
 
   const downloadPDF = () => {
     const doc = new jsPDF();
     tasks.forEach((task, index) => {
       doc.text(20, 10 + 10 * index, `${task.completed ? '[x]' : '[ ]'} ${task.description}`);
     });
     doc.save('tasks.pdf');
   };
 
   return (
     <Container>
       <Row className="mt-4">
         <Col className="text-center">
           <img src='https://i.ibb.co/94nQT3W/shanture-png.png' alt="Shanture Logo" /> 
           <h1>To-Do List</h1>
         </Col>
       </Row>
       <Row className="mt-4">
         <Col>
           <Form inline>
             <Form.Control
               type="text"
               placeholder="Add a new task"
               value={newTask}
               onChange={(e) => setNewTask(e.target.value)}
               className="mr-2"
             />
             <Button style={{marginTop:"30px"}} onClick={addTask}>Add Task</Button>
           </Form>
         </Col>
       </Row>
       <Row className="mt-4">
         <Col>
           <ListGroup>
             {tasks.map(task => (
               <ListGroup.Item key={task.id} className={task.completed ? 'completed' : ''}>
                 <Form.Check
                   type="checkbox"
                   checked={task.completed}
                   onChange={() => toggleCompletion(task.id)}
                   label={task.description}
                   className="mr-2"
                 />
                 <Button variant="danger" onClick={() => deleteTask(task.id)}>Delete</Button>
               </ListGroup.Item>
             ))}
           </ListGroup>
         </Col>
       </Row>
       <Row className="mt-4">
         <Col className="text-center">
           <Button onClick={downloadPDF}>Download as PDF</Button>
         </Col>
       </Row>
     </Container>
   );
 };
 
 export default App;
  
 