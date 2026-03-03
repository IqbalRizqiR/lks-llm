import { NextRequest, NextResponse } from "next/server";
import { ForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import cognitoClient from "@/lib/cognito";
import * as crypto from "crypto"
import Base64 from "crypto-js/enc-base64";
import { HmacSHA256 } from "crypto-js";

export async function POST(request: NextRequest) {
   const { username } = await request.json();
      var clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || ""
      var clientSecret = process.env.NEXT_SECRET_COGNITO_ID || ""
      const secretHash = HmacSHA256(username + clientId, clientSecret).toString(Base64)

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
