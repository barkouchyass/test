import React, { useEffect, useState } from "react";

// Fonction principale de la page
export function Timeline_tasks() {
    return (
        <div className="container my-5">
            <TaskList />
        </div>
    );
}

// Fonction qui liste les tâches
function TaskList() {
    const [tasks, setTasks] = useState([]); // État pour stocker les tâches
    const [showPastTasks, setShowPastTasks] = useState(false); // État pour afficher les tâches passées

    // Fonction pour récupérer les tâches depuis le serveur
    function fetchTasks() {
        fetch("http://localhost:3006/tasks/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Échec de la réponse du serveur");
                }
                return response.json();
            })
            .then((data) => {
                setTasks(data); // Met à jour l'état avec les données récupérées
            })
            .catch((error) => console.log("Erreur : ", error));
    }

    // Utilisation de useEffect pour appeler fetchTasks au chargement initial
    useEffect(() => {
        fetchTasks();
    }, []);

    const today = new Date();
    const currentDateString = today.toISOString().split('T')[0]; // Format YYYY-MM-DD

    // Filtrer les tâches en tâches passées et futures
    const pastTasks = tasks.filter(task => new Date(task.date) < new Date(currentDateString));
    const futureTasks = tasks.filter(task => new Date(task.date) >= new Date(currentDateString));

    // Trier les tâches passées et futures par date et heure
    const sortedPastTasks = pastTasks.sort(
        (a, b) => new Date(a.date) - new Date(b.date) || new Date(a.time) - new Date(b.time)
    );
    const sortedFutureTasks = futureTasks.sort(
        (a, b) => new Date(a.date) - new Date(b.date) || new Date(a.time) - new Date(b.time)
    );

    // Gestion du scroll pour afficher les tâches passées
    const handleScroll = (event) => {
        if (event.target.scrollTop === 0) {
            setShowPastTasks(true);
        }
    };

    return (
        <>
            <h2 className="text-center mb-3">Timeline des tâches</h2>
            <button onClick={() => fetchTasks()} type="button" className="btn btn-primary me-2">Rafraîchir</button>

            <div
                style={{ maxHeight: '160px', overflowY: 'scroll' }}
                onScroll={handleScroll}
            >
                <table className="table" style={{ height: '20vh' }}>
                    <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Heure</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {showPastTasks && sortedPastTasks.map((task, index) => (
                            <tr key={index} className="table-danger">
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>{task.date}</td>
                                <td>{task.time}</td>
                            </tr>
                        ))}
                        {sortedFutureTasks.map((task, index) => (
                            <tr key={index} className="table-info">
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>{task.date}</td>
                                <td>{task.time}</td>
                            </tr>
                        ))}
                    </tbody>
                    
                </table>
            </div>
        </>
    );
}
