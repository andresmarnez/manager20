'using strcit';

// @title Script que envia tokens erc20 desde una pool a un usuario registrado
// @author Andres Sanchez Martinez
//Utilizamos las librerias nativas de el AWS que nos dan acceso a la base de datos y uso de http.
const AWS = require('aws-sdk');
const baseETH = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'});
const origin = SLACK_VERIFICATION_TOKEN;

exports.handler = (event, context, callback) => {

    //Recortamos espacios al principio y al final y seccionamos el texto donde deben haber solo 2 valores: 1Cantidad 2Usuario en formato <@U1234|user>
    var text = event.text;
    var args = text.trim().split(" ");
    
    if(args.length == 2 && text.includes("|","@","<",">") && event.token == origin){
        
        var user = args[1].split("|");
        var sid = user[0].slice(2, user[0].length);
        var amnt = args[0];


        if(isNaN(parseFloat(amnt))){
            
            callback(null,{
                "text":"Failure",
                "attachments": [{
                    "text":'You should add a valid amount.'
                }]
            });
            return;
        }
        
        let busca = {
            TableName: 'slackdir',
            Key: {
                "sid": sid
            }
        };
        
        //Buscamos en nuestra base de datos si hay una direccion asignada para el usuario
        baseETH.get(busca, function(err,data){
            
            if(err){
                callback(err);
                return;
            }

            //Si nos devuelve un JSON vacio es que no existe constancia del usuario
            else if(Object.keys(data).length==0){
                callback(null,{
                    "text":"Failure",
                    "attachments": [{
                        "text":'The user has not set an Ethereum address.'
                    }]
                });
                return;
            }

            //Obtenemos la informacion de la base de datos y operamos en ella para sacar la direccion de ethereum
            var jsonarray = JSON.stringify(data).split("\"");
            var addr = jsonarray[5];
            
            //Formamos la URL de peticion de nuestro EC2
            var ec2 = "/sendpool?addr=" + addr +"&amount="+amnt;
            
            //Iniciamos la connexion http como servicio segun la libreria
            const svc = new AWS.Service({
 
                endpoint: YOUR_FUNCTION_ENDPOINT,
                convertResponseTypes: false,
                apiConfig: {
                    metadata: {
                        protocol: 'rest-json'
                    },
                    operations: {
                        sendpool: {
                            http: {
                                method: 'GET',
                                requestUri: ec2
                            },
                        },
                    }
                }
            });
            svc.isGlobalEndpoint = true;

            //Ejecutamos la operacion definida para hacer un GET a EC2 y devolvemos el contenido de tener respuesta y no ser error
            svc.sendpool({}, (err, data) => {
             
                if (err) {  
                    callback(null,{
                        "text":"Failure",
                        "attachments": [{
                        "text":'There has been an error while creating the transaction. Contact the owner @marnez for more details. ERROR: 001'
                        }]
                    });
                return;
                }
                
                else{
                    callback(null,data)
                    return;
                }
            });
        });
    }
    
    else callback(null,{
        "text":"Failure",
        "attachments": [{
            "text":'The command was not called correctly, make sure you specify the amount (XX.YY) followed by the @user. Example: /sendpool 150.00 @example.'
        }]
    });
    
    return;
}
