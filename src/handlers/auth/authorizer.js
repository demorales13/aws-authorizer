import jwt from "jsonwebtoken";
import got from "got";
//import request from '../../lib/request';

// Se debe mirar de donde se toma la dirección de verificación de token
const URL = "https://dev.registro.solucionesbolivarsites.com/login-system/devbolivarconmigo/verify";
const isInMaintenance = false;

export async function handler(event, context, callback) {
  // SE PODRÏA RETORNAR SI ESTÁ MANTENIMIENTO
  if (isInMaintenance) {
    const policy = generatePolicy("undefined", "Deny", event.methodArn);

    return {
      ...policy,
      context: null,
    };
  }

  if (!event.authorizationToken) {
    throw "Unauthorized";
  }

  const token = event.authorizationToken.replace("Bearer ", "");

  try {
    // SE VERIFICA SI EL TOKEN ES VALIDO
    let options = {
      headers: {
        "x-access-token": token,
      },
      responseType: "json",
    };
    const { body } = await got.post(URL, options);

    // SI NO FUE VERIFICADO CORRECTAMENTE
    if (!body.uid) {
      throw "Unauthorized";
    }

    // SE CREA LA POLITICA USANDO EL ID DEL USUARIO
    const policy = generatePolicy(body.uid, "Allow", event.methodArn);

    return {
      ...policy,
      context: body,
    };

  } catch (error) {
    console.log("ERROR: Authorizer");
    console.log(error);
    throw "Unauthorized";
  }
}

const generatePolicy = (principalId, effect, methodArn) => {
  const apiGatewayWildcard = methodArn.split("/", 2).join("/") + "/*";

  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: apiGatewayWildcard,
        },
      ],
    },
  };
};

