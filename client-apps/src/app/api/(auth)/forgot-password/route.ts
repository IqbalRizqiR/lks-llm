import { NextRequest, NextResponse } from "next/server";
import { ForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import cognitoClient from "@/lib/cognito";
import CryptoJS from "crypto-js";

export async function POST(request: NextRequest) {
   const { username } = await request.json();
      var clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || ""
      var clientSecret = process.env.NEXT_SECRET_COGNITO_ID || ""
      const secretHash = CryptoJS.HmacSHA256(username + clientId, clientSecret).toString(CryptoJS.enc.Base64);

   const command = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      SecretHash: secretHash,
      Username: username,
   });

   try {
      await cognitoClient.send(command);
      return NextResponse.json(
         { message: "Password reset instructions sent" },
         { status: 200 }
      );
   } catch (error) {
      return NextResponse.json(
         { error: (error as Error).message },
         { status: 400 }
      );
   }
}
