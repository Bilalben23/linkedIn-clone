import { hash } from "bcrypt";

export const hashPassword = async (password) => {
    const saltRounds = 10;
    return await hash(password, saltRounds);
}