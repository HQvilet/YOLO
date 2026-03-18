import React, { useState, type EventHandler, type ReactNode } from 'react'
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo.tsx';

import { MdOutlineEmail, MdPassword } from 'react-icons/md';
import { FaEye } from 'react-icons/fa'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import api from "../../services/api.config.ts"
import { useQueryAuthUser } from '../../hooks/handleUser.ts';

interface UserLogIn {
    email: string,
    password: string,
}

const LoginPage = () => {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<UserLogIn>({
        email: "",
        password: "",
    })
    const [isShowPass, setShowPass] = useState<boolean>(false);

    const handleSubmitForm = (e: React.SubmitEvent) => {
        e.preventDefault()
        logIn(formData)
        
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setFormData((prev) => ({...prev, [e.target.name] : e.target.value}))
    }
    
    const {
        mutate: logIn,
        isError,
        error,
    } = useMutation({
        mutationFn: async (authData: UserLogIn) => {
            await api.post("/api/auth/login",
                authData,
            ).then(res => {
                return res.data.data
            }).catch(err => {
                console.log(err.message)
            })
        },
        onSuccess: () => {
            console.log("Log in successfully.")
            queryClient.invalidateQueries({queryKey: ["authUser"]})
        }
    })

  return (
    <>
        <div className="flex justify-center h-screen gap-10 items-center mx-auto">
            <div className="text-5xl">
                <Logo size={"5xl"}/>
            </div>
            <div className="flex flex-col justify-center p-3 rounded-md bg-transparent border-4 border-violet-400 text-white">
                <form 
                    className="flex flex-col justify-center items-center gap-4 m-1"
                    onSubmit= {handleSubmitForm}
                >
                    <h4 className="text-5xl font-extrabold mb-4 text-violet-700">Login</h4>

                    <div className="input_box border-2 border-gray-400 p-2 rounded-md hover:border-violet-600 w-full">
                        <MdOutlineEmail className=''/>
                        <input type="email"
                            name="email"
                            placeholder="Email"
                            className="bg-transparent w-32"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input_box border-2 border-gray-400 p-2 rounded-md w-full">
                        <MdPassword className='self-center' />
                        <input type={isShowPass ? "text": "password"}
                            name="password"
                            placeholder="Password"
                            className= "bg-transparent"
                            onChange={handleInputChange}
                        />
                        <button className="btn bg-transparent border-0 m-0 p-0" 
                            onClick={(e) => {
                                e.preventDefault();
                                setShowPass(value => !value);
                            }}
                        >
                            <FaEye/>
                        </button>
                    </div>
                    <div className="w-full flex flex-col ">
                        <button className="btn btn-info rounded-lg w-[80%] self-center bg-violet-500 text-2xl font-bold py-1" >Login</button>
                        {isError && <div className="text-red-500 text-sm self-start">{"Neh"} </div>}
                    </div>                    
                    
                </form>
                <div className="flex flex-col gap-2 mt-4 mb-4 justify-end">
                    <Link to="/signup" className="text-left mr-1 text-sm">
                        <span className=" font-bold underline">Don't have an account yet.</span>
                        {/* <button className="btn rounded-full w-[70%]">Sign Up</button> */}
                    </Link>
                </div>
            </div>
        </div>
    </>
  )
}

export default LoginPage