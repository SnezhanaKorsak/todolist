import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {
    changeTodolistFilterAC,
    createTodolistTC,
    deleteTodolistTC,
    fetchTodo,
    FilterType,
    TodolistDomainType,
    updateTitleTodolistTC
} from "./todolist-reducer";
import React, {useCallback, useEffect} from "react";
import {addTaskTC, deleteTaskTC, updateTaskStatusTC, updateTaskTitleTC} from "./tasks-reducer";
import {TaskStatuses, TaskType} from "../../api/tasks-api";
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../components/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {TasksStateType} from "../../app/App";

export const TodolistsList = () => {

    const dispatch = useDispatch()
    const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    useEffect(() => {
        dispatch(fetchTodo())
    }, [])

    const removeTask = useCallback((taskId: string, todoId: string) => {
        dispatch(deleteTaskTC(todoId, taskId))
    }, [dispatch])

    const addTask = useCallback((taskTitle: string, todoId: string) => {
        dispatch(addTaskTC(todoId, taskTitle))
    }, [dispatch])

    const changeStatus = useCallback((taskId: string, status: TaskStatuses, todoId: string) => {
        dispatch(updateTaskStatusTC(todoId, taskId, status))
    }, [dispatch])

    const changeFilter = useCallback((todoId: string, value: FilterType) => {
        dispatch(changeTodolistFilterAC(todoId, value))
    }, [dispatch])

    const removeTodolist = useCallback((todoId: string) => {
        dispatch(deleteTodolistTC(todoId))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(createTodolistTC(title))
    }, [dispatch])

    const changeTitleTask = useCallback((todoId: string, newTitle: string, task: TaskType) => {
        dispatch(updateTaskTitleTC(todoId, task, newTitle))
    }, [dispatch])

    const changeTitleTodolist = useCallback((todoId: string, newTitle: string) => {
        dispatch(updateTitleTodolistTC(todoId, newTitle))
    }, [dispatch])


    return <>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm callback={addTodolist}/>
        </Grid>

        <Grid container spacing={3}>
            {todolists.map(tl => {
                let taskForTodolist = tasks[tl.id]

                return <Grid item key={tl.id}>
                    <Paper style={{padding: "10px"}}>
                        <Todolist todoId={tl.id}
                                  title={tl.title}
                                  tasks={taskForTodolist}
                                  removeTask={removeTask}
                                  filter={tl.filter}
                                  entityStatus={tl.entityStatus}
                                  changeFilter={changeFilter}
                                  addTask={addTask}
                                  changeStatus={changeStatus}
                                  removeTodolist={removeTodolist}
                                  changeTitle={changeTitleTask}
                                  changeTitleTodolist={changeTitleTodolist}
                        /></Paper>
                </Grid>
            })}
        </Grid>
    </>
}