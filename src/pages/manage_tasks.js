import React, { useEffect, useState } from "react";

//la fonction principale

export function Manage_tasks() {
    const [content, setContent]=useState(<TaskList showForm ={showForm}/>);
//apelle de la fonction qui affiche la liste des taches
    function showList(){
        setContent(<TaskList showForm={showForm}/>);
    }
//apelle de la fonction qui affiche le formulaire
    function showForm(task) {
        setContent(<TaskForm tasks={task} showList={showList}/>);
    }

    return(
        <div className="container my-5">
           {content}
        </div>
    );
}



//création de la fonction qui affiche la liste des tache
function TaskList(props) {
    const [tasks, SetTasks] = useState([])
//création de la fonction qui apporte les donnée depuis le fichier
    function fetshTasks(){
        fetch("http://localhost:3006/tasks")
        .then((response)=>{
           if(!response.ok){
            throw new Error("Reponse inatendu du serveur")
           }
           return response.json()
        })
        .then((data)=>{
            SetTasks(data);
        })
        .catch((error)=> console.log("erreur",error));
    }



    useEffect(()=>fetshTasks(), []);
    

    //création de la fonction qui supprime une tache 
    function deleteTask(id){
        fetch("http://localhost:3006/tasks/" + id,{
            method : "DELETE",           
        })
        .then((response)=>response.json())
        .then((data) =>fetshTasks());
    }

    return( 
        <>
        <h2 className="text-center mb-3">Liste des taches</h2>
        <button onClick={() => props.showForm({})} type="button" className="btn btn-primary me-2">Créer</button>
        <button onClick={() => fetshTasks()} type="button" className="btn btn-outline-primary me-2">Rafraichir</button>
        <table className="table">
            <thead>
                <tr>
                    <th>id</th>
                    <th>titre</th>
                    <th>Déscription</th>
                    <th>date</th>
                    <th>heur</th>   
                    <th>action</th> 
                                   
                </tr>
            </thead>
            <tbody>
                {
                    //lister les données importé depuis le fichier Json dans des colonnes d'un tableau
                    
                    tasks.map((tasks,index) =>{

                        return(
                            <tr key={index}>
                                <td>{tasks.id}</td>
                                <td>{tasks.title}</td>
                                <td>{tasks.description}</td>
                                <td>{tasks.date}</td>
                                <td>{tasks.time}</td>
                                <td style={{width:"10px", whiteSpace: "nowrap"}}>
                                    <button onClick={()=>props.showForm(tasks)} type="button" className="btn btn-primary btn-sm me-2">modifier</button>
                                    <button onClick={()=>deleteTask(tasks.id)} type="button" className="btn btn-danger btn-sm">supprimer</button>
                                </td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
        </>
    );
}
//création de l'application qui affiche le formulaire
function TaskForm(props) {
    
    const [errorMessage, setErrorMessage] = useState("");
//création de la fonction qui valide que touts les champs sont bien remplis
    function hundleSubmit(event){
        event.preventDefault();
        const formData=new FormData(event.target);
        const task=Object.fromEntries(formData.entries());
        if(!task.title || !task.description || !task.date || !task.time ){
            console.log("Veuillez remplir toute les champs necessaire!!!");
            setErrorMessage(
                <div className="alert alert-warning" role="alert">
                    Veuillez remplir toute les champs necessaire!!!
                </div>
            )
            return;
        }





       //la condition qui permet de modifie une tache ou l'ajouter
       if(props.tasks.id){
        //la fonction qui permet de modifier une tache déja ajouter
        fetch("http://localhost:3006/tasks/" + props.tasks.id,{
            method : "PATCH",
            headers:{
               "content-type" : "application/json",
               'Accept': 'application/json'
            },
            body:JSON.stringify(task)
        })
        .then((response)=>{
            if (!response.ok) {
                throw new Error("la reponse du serveur est négatif")
            }
            return response.json()
        })
        .then((data) =>
        props.showList()
    )
        .catch((error)=> 
        {console.log("erreur",error);});
       }else{
        //la fonction qui permet d'ajouter une nouvelle tache
        fetch("http://localhost:3006/tasks",{
            method : "POST",
            headers:{
               "content-type" : "application/json",
            },
            body:JSON.stringify(task)
        })
        .then((response)=>{
            if (!response.ok) {
                throw new Error("la reponse du serveur est négatif")
            }
            return response.json()
        })
        .then((data) =>
        props.showList()
    )
        .catch((error)=> 
        {console.log("erreur",error);});
    }
}
    //créer le formulaire qui est à la fois pour ajouter une nouvelle tache et aussi pour créer une nouvelle tache
    return(
        <>
        <h2 className="text-center mb-3">{props.tasks.id ? "Modifier la tache":"créer une nouvelle tache"}</h2>
           
        <div className="row">
        <div className="col-lg-6 mx-auto">
            {errorMessage}
            <form onSubmit={(event) => hundleSubmit(event)}>
                {props.tasks.id && <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">ID</label>
                    <div className="col-sm-8">
                        <input readOnly className="form-control-plaintext" name="id" defaultValue={props.tasks.id}/>
                    </div>
                </div>}

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">titre</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="title" defaultValue={props.tasks.title}/>
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">description</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="description" defaultValue={props.tasks.description}/>
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">date</label>
                    <div className="col-sm-8">
                        <input type="date" className="form-control" name="date" defaultValue={props.tasks.date}/>
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">heur</label>
                    <div className="col-sm-8">
                        <input type="time" className="form-control" name="time" defaultValue={props.tasks.time}/>
                    </div>
                </div>

                <div className="row">
                    <div className="offset-sm-4 col-sm-4 d-grid">
                        <button type="submit" className="btn btn-primary btn-sm me-3">Sauvegarder</button>
                    </div>
                    <div className="col-sm-4 d-grid">
                        <button onClick={() => props.showList()} type="button" className="btn btn-secondary me-2">annuler</button>
                    </div>
                </div>
            </form>

        </div>
        </div>
        </>
    );
}