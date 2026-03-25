
export interface UserLogIn{
    email: string,
    password: string,
}

export interface UserSignUp{
    fullname: string,
    username: string,
    email: string,
    password: string,
}

export interface UserInterface{
    _id: string,
    fullname: string,
    username: string,
    profileImg: string,
    coverImg: string,
}

export interface UserImageData{
    coverImg: string | undefined,
    profileImg?: string,
}