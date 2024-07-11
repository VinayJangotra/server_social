import { User } from "@prisma/client";;
import JWT from "jsonwebtoken"
const JWT_SECRET="Hello_World"
class JWTService{
    public static async generateTokenUser(user:User){
        const payload={
            id:user?.id,
            email:user?.email,
        }
        const token = JWT.sign(payload,JWT_SECRET);
        return token;
    }
}
export default JWTService;