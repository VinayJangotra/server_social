import axios from "axios"
import { prismaClient } from "../../clients/db";
import JWTService from "../../services/jwt";
interface GoogleTokenResult {
  iss?: string;
  azp?: string;
  aud?: string;
  sub?: string;
  email?: string;
  email_verified?: string;
  nbf?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  iat?: string;
  exp?: string;
  jti?: string;
}

const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    const googleToken = token;
    const googleOauthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
    googleOauthURL.searchParams.append('id_token', googleToken);
    const {data}=await axios.get<GoogleTokenResult>(googleOauthURL.toString(),{
        responseType:'json'
    });
    // Check that the user exist or not
    const user = await prismaClient.user.findUnique({
      where: {
        email: data.email
      }
    })
    if(!user){
      await prismaClient.user.create({
        data: {
          email: data.email || "", // Provide a default value
          firstName: data.given_name || "", // Provide a default value
          lastName: data.family_name || "", // Provide a default value
          profileImageURl: data.picture || "", // Provide a default value
        },
      });
    }
   const userInDb = await prismaClient.user.findUnique({
      where: {
        email: data.email
      }
   });
   if(!userInDb)throw new Error("User with email is not found");
   const userToken = JWTService.generateTokenUser(userInDb);
   console.log(userToken);
    return  userToken;
  },
  
};
export const resolvers = { queries };
