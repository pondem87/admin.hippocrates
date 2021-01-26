import React, { useEffect, useState } from 'react';
import { getUserTasks, setNewAdminTask } from '../../functions/usersFunctions';
import Loader from '../shared/loader';
import moment from 'moment';

const AdminTasks = ({token, iduser}) => {
    const [loading, setLoading] = useState(true)
    const [tasks, setTasks] = useState([])
    const [newtask, setNewTask] = useState('')
    const [disableSubmit, setDisableSubmit] = useState(false)

    useEffect(() => {
        getTasks();
    }, [])

    const getTasks = async() => {
        try {
            let t = await getUserTasks(token, iduser);
            setTasks(t)
        } catch (error) {
            console.log("Cannot get tasks: " + error)
        } finally {
            setLoading(false)
        }
    }

    const submitTask = async (e) => {
        e.preventDefault();

        try {
            setDisableSubmit(true)
            await setNewAdminTask(token, iduser, newtask);
            getTasks();
        } catch (error) {
            alert('Task failed to save')
        } finally {
            setDisableSubmit(false)
            setNewTask('')
        }
    }

    if (loading) return <Loader />

    return (
        <div>
            <form onSubmit={submitTask}>
                <div>
                    <input disabled={disableSubmit} type="submit" className="btn btn-success float-right my-1" value="save task" />
                </div>
                <div className="form-group">
                    <label htmlFor="newtask">Write completed tasks here:</label>
                    <textarea className="form-control" id="newtask" rows="2" value={newtask} onChange={(e) => setNewTask(e.target.value)} required ></textarea>
                </div>    
            </form>
            <ul className="list-group">
                {
                    tasks.map((task) => {
                        return (
                            <li key={task.idadmin_tasks} className="list-group-item">
                                {moment(task.datetime).fromNow()}: <span className="font-weight-bold text-capitalize">{task.admin}</span><br />
                                {task.description}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default AdminTasks;