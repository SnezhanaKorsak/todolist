import {v1} from "uuid";
import {todolistAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {ThunkType} from "./store";


export const todolistId1 = v1()
export const todolistId2 = v1()

export type FilterType = 'All' | 'Active' | 'Completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterType
}

type initialStateType = TodolistDomainType[]

export type TodolistsActionsType = ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodolistsAC>

const initialState: initialStateType = []


export const todolistsReducer = (state = initialState, action: TodolistsActionsType): initialStateType => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(f => f.id !== action.id)

        case "ADD-TODOLIST":
            const newTodolist: TodolistDomainType = {
               ...action.todolist,
                filter: "All"
            }

            return [newTodolist, ...state]

        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)

        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)

        case "SET-TODOLISTS":
            return action.todolists.map(tl => {
                return {...tl, filter: "All"}
            })

        default:
            return state
    }

}

export const removeTodolistAC = (todolistId: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        id: todolistId
    } as const
}
export const addTodolistAC = (todolist: TodolistType) => {
    return {
        type: 'ADD-TODOLIST',
        todolist
    } as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        id, title
    } as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        id, filter
    } as const
}

export const setTodolistsAC = (todolists: TodolistType[]) => {
    return {
        type: 'SET-TODOLISTS',
        todolists
    } as const
}

//thunk
export const fetchTodo = (): ThunkType => {
    return (dispatch: Dispatch) => {
        todolistAPI.getTodolists()
            .then(res => dispatch(setTodolistsAC(res.data)))
    }
}

export const createTodolistTC = (title: string): ThunkType => {
    return (dispatch: Dispatch) => {
        todolistAPI.createTodolist(title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(res.data.data.item))
                }
            })
    }
}

export const deleteTodolistTC = (todolistId: string): ThunkType => {
    return (dispatch: Dispatch) => {
        todolistAPI.deleteTodolists(todolistId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todolistId))
                }
            })
    }
}

export const updateTitleTodolistTC = (todolistId: string, title: string): ThunkType => {
    return (dispatch: Dispatch) => {
        todolistAPI.updateTodolist(todolistId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTodolistTitleAC(todolistId, title))
                }
            })
    }
}