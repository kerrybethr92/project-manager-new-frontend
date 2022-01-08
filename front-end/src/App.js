import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react'
import axios from 'axios';

const App = () => {
    // state hooks
    const [newTitle, setNewTitle] = useState('');
    const [newComplete, setNewComplete] = useState(false);
    const [garments, setGarments] = useState([]);

    // form change handlers:
    const handleNewTitleChange = (event) => {
        setNewTitle(event.target.value);
    }
    const handleNewCompleteChange = (event) => {
        setNewComplete(event.target.checked);
    }
    // new db item submit form handler
    const handleNewGarmentFormSubmit = (event) => {
        event.preventDefault();
        axios.post(
            'http://localhost:3000/garments',
            {
                title:newTitle,
                complete:newComplete
            }
        ).then(() => {
            axios
                .get('http://localhost:3000/garments')
                .then((response) => {
                    setGarments(response.data)
                })
        })
    }

    // delete handler
    const handleDelete = (garmentData) => {
        axios
            .delete(`http://localhost:3000/garments/${garmentData._id}`)
            .then(() => {
                axios
                    .get('http://localhost:3000/garments')
                    .then((response) => {
                        setGarments(response.data)
                    })
            })
    }

    // update complete handler
    const handleToggleComplete = (garmentData) => {
        axios
            .put(
                `http://localhost:3000/garments/${garmentData._id}`,
                {
                    title:garmentData.title,
                    isComplete:!garmentData.complete
                }
            )
            .then(() => {
                axios
                    .get('http://localhost:3000/garments')
                    .then((response) => {
                        setGarments(response.data)
                    })
            })
    }

    //invoke useEffect
    useEffect(() => {
        axios
            .get('http://localhost:3000/garments')
            .then((response) => {
                setGarments(response.data);
            })
    },[])

    return (
        <main>
            <h1>Garment List</h1>
            <section>
                <h2>Create a Garment</h2>
                <form onSubmit={handleNewGarmentFormSubmit}>
                    Title: <input type="text" onChange={handleNewTitleChange}/><br/>
                    Is Complete: <input type="checkbox" onChange={handleNewCompleteChange}/><br/>
                    <input type="submit" value="Create Garment"/>
                </form>
            </section>
            <section>
                <h2>Garments</h2>
                <ul>
                    {
                        garments.map((garment)=>{
                            return <li onClick = { () => {handleToggleComplete(garment)}} key={garment._id}>
                                {
                                    (garment.isComplete)?
                                        <strike>{garment.title}</strike>
                                    :
                                        garment.title
                                }
                                <button onClick={ (event)=>{ handleDelete(garment)}}>Delete</button>
                            </li>
                        })
                    }
                </ul>
            </section>
        </main>
    );
}

export default App;
