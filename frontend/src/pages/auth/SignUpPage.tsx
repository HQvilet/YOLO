import React, { useState, type ReactNode } from 'react'
import { data, Link } from 'react-router-dom';
import Logo from '../../assets/Logo.tsx';

import { MdOutlineEmail, MdPassword } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import api from "../../services/api.config.ts"

interface UserSignUp{
        fullname: string,
        username: string,
        email: string,
        password: string,
}

const SignUpPage = () => {

    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<UserSignUp>({
        fullname: "",
        username: "",
        email: "",
        password: "",
    })
    const [isShowPass, setShowPass] = useState<boolean>(false);

    const handleSubmitForm = (e: React.SubmitEvent) => {
        e.preventDefault()
        signUp(formData)
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setFormData((prev) => ({...prev, [e.target.name] : e.target.value}))
    }

    const {
        mutate: signUp, 
        isError,
        error,
    } = useMutation({
        mutationFn: async (authData: UserSignUp) => {
            await api.post("/api/auth/signup",
                authData,
            ).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        onSuccess: () => {
            console.log("Sign up successfully.")
            queryClient.invalidateQueries({queryKey: ["authUser"]})
        }
    })
    

    return (
    <>
        <div className="flex justify-center h-screen gap-10 items-center mx-auto">
            <div className="text-5xl text-blue-400 font-bold">
                <Logo size={"5xl"} />
            </div>
            <div className="flex flex-col justify-center p-3 rounded-md bg-transparent border-4 border-violet-400 text-white">
                <form
                    className="flex flex-col justify-center items-center gap-4 m-1 "
                    onSubmit= {handleSubmitForm}
                >
                    <h4 className="text-3xl font-extrabold mb-4 text-violet-400">Sign Up</h4>
                    <div className="flex justify-between gap-2 w-full">
                        <div className="input_box border-2 border-gray-400 p-2 rounded-md">
                            <MdOutlineEmail/>
                            <input type="text"
                                name="fullname"
                                placeholder="Full Name"
                                className="bg-transparent w-32 flex-initial"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input_box border-2 border-gray-400 p-2 rounded-md">
                            <MdOutlineEmail/>
                            <input type="text"
                                name="username"
                                placeholder="User Name"
                                className="bg-transparent w-32 flex-initial"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="input_box border-2 border-gray-400 p-2 rounded-md w-full">
                        <MdOutlineEmail/>
                        <input type="email"
                            name="email"
                            placeholder="Email"
                            className="bg-transparent"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input_box border-2 border-gray-400 p-2 rounded-md w-full">
                        <MdPassword />
                        <input type={isShowPass ? "text": "password"}
                            name="password"
                            placeholder="Password"
                            className= "bg-transparent"
                            onChange={handleInputChange}
                        />
                        <button className="btn bg-transparent border-0 m-0 p-0" 
                            onClick={(e) => {
                                e.preventDefault();
                                setShowPass(prev => !prev)
                            }}
                        >
                            <FaEye/>
                        </button>
                    </div>
                    <div className="w-full flex flex-col ">
                        <button className="btn btn-info rounded-lg w-[80%] self-center bg-violet-500 text-2xl font-bold py-1" >Submit</button>
                        {isError && <div className="text-red-500 text-sm self-start">{"Neh"} </div>}
                    </div>                    
                    
                </form>
                <div className="flex flex-col gap-2 mt-4 mb-4">
                    <Link to="/login" className="flex">
                        <span className="font-bold underline">Already have an account.</span>
                        {/* <button className="btn rounded-full w-[70%]">Sign Up</button> */}
                    </Link>
                </div>
            </div>
        </div>
    </>
  )
}

export default SignUpPage