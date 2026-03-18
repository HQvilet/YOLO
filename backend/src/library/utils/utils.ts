import bcrypt from "bcryptjs"

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(8);
    const res = await bcrypt.hash(password, salt);
    return res;
}

export const getImgNameFromUrl = (url: String) => {
    return url.split("/").pop()?.split(".")[0];
}