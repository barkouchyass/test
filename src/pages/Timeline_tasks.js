import React, { useEffect, useState } from "react";


// la fonction principale de la page
export function Timeline_tasks() {
    return(
        <div className="container my-5">
            <TaskList/>
        </div>
    );
}


//création de la fonction qui liste les taches
function TaskList(){
    const[ tasks, setTasks] = useState([]);
    //la fonction qui importe les données depuis le fichier Json
    function fetchTasks() {
        fetch("http://localhost:3006/tasks/")
        .then((response)=>{
            if(!response.ok){
                throw new Error("réponse du serveur échouer")
            }
            return response.json()
        })
        .then((data)=> {
            setTasks(data);                         
        })
        .catch((error)=>console.log("Error : ", error));
    }

    useEffect(()=>fetchTasks(), [])

    return(
        <>
          <h2 className="text-center mb-3">Timeline des taches</h2>  
          <button onClick={() => fetchTasks()} type="button" className="btn btn-primary me-2">Rafraichir</button>
        <table className="table">
            <thead>
                <tr>
                    <th>titre</th>
                    <th>Déscription</th>
                    <th>date</th>
                    <th>heur</th>                                     
                </tr>
            </thead>
            <tbody>
                {
                    tasks
                    //trier les données par ordre chronomogique (date et heur) avant de les afficher 
                    .sort(
                        (a,b)=>{
                            const date1=new Date(a.date);
                            const date2=new Date(b.date);
                            const datediff=date1-date2;
                            if(datediff<0){
                                return -1;
                            }else if(datediff>0){
                                return 1;
                            }else{
                               const date3 = new Date(a.time);
                               const date4 = new Date(b.time);
                               const datediff1=date3-date4;
                               if(datediff1<=0){
                                    return -1;
                               }else {
                                   return 1;
                               }
                            }
                    
                        }
                    )
                    //afficher les données inscrit sur Json fail en mettant les taches qui ont déja passe en rouge et les tache qui ne sont pas encore mettent en vert
                    .map((tasks,index) =>{
                        const today = new Date();
                        const month = today.getMonth()+1;
                        const year = today.getFullYear();
                        const date = today.getDate();
                        const currentDate = year + "-" + month + "-" + date;
                        const date1=new Date(tasks.date);
                        const date2=new Date(currentDate);
                        const datedif=date2-date1;
                        
                        
                      
                        if(datedif<=0){
                            return(                                                       
                                <tr key={index} >
                                    <td className="table-info">{tasks.title}</td>
                                    <td className="table-info">{tasks.description}</td>
                                    <td className="table-info">{tasks.date}</td>
                                    <td className="table-info">{tasks.time}</td>                                
                                </tr>
                            );
                        }else{
                            // mettre ces lignes scrolable


                           return(                                                       
                                <tr key={index} >
                                    <td className="table-danger">{tasks.title}</td>
                                    <td className="table-danger">{tasks.description}</td>
                                    <td className="table-danger">{tasks.date}</td>
                                    <td className="table-danger">{tasks.time}</td>                                
                                </tr>
                            );
                        }
                        
                    })
                }
            </tbody>
        </table>
        </>
    );
}