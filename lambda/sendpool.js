<<<<<<< HEAD
'using strcit';

// @title Script que envia tokens erc20 desde una pool a un usuario registrado
// @author Andres Sanchez Martinez
//Utilizamos las librerias nativas de el AWS que nos dan acceso a la base de datos y uso de http.
const AWS = require('aws-sdk');
const baseETH = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'});

exports.handler = (event, context, callback) => {
    
    var ec2 = "35.178.250.121:3000/sendt?";
    var addr;
    var jsonarray;
    var sid = '';
    var amnt = '';
    //Recortamos espacios al principio y al final y seccionamos el texto donde deben haber solo 2 valores: 1Cantidad 2Usuario en formato <@U1234|user>
    var text = event.text;
    var args = text.trim().split(" ");
    
    if(args.length == 2 && text.includes("|","@","<",">")){
        
        var user = args[1].split("|");
        sid = user[0].slice(2, user[0].length);
        amnt = args[0];
        
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
                        "text":'The user has not set a valid ETH address.'
                    }]
                });
                return;
            }

            //Obtenemos la informacion de la base de datos y operamos en ella para sacar la direccion de ethereum
            jsonarray = JSON.stringify(data).split("\"");
            addr = jsonarray[5];
            
            //Formamos la URL de peticion de nuestro EC2
            ec2 = "/sendt?addr=" + addr +"&amount="+amnt;
            
            //Iniciamos la connexion http como servicio segun la libreria
            const svc = new AWS.Service({
 
                endpoint: 'http://ec2-35-178-250-121.eu-west-2.compute.amazonaws.com:3000',
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
                        "text":'The command was not called correctly, make sure you specify the amount (number) followed by the @user. Example: /sendpool 150 @example.'
                        }]
                    });
                return;
                }
                
                callback(null,data)
            });

            return;
        });
    }
    
    else callback(null,{
        "text":"Failure",
        "attachments": [{
            "text":'The command was not called correctly, make sure you specify the amount (number) followed by the @user. Example: /sendpool 150 @example.'
        }]
    });
    
    return;
}
=======
'using strcit';

// @title Script que envia tokens erc20 desde una pool a un usuario registrado
// @author Andres Sanchez Martinez
//Utilizamos las librerias nativas de el AWS que nos dan acceso a la base de datos y uso de http.
const AWS = require('aws-sdk');
const baseETH = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'});

exports.handler = (event, context, callback) => {
    
    var ec2 = "35.178.250.121:3000/sendt?";
    var addr;
    var jsonarray;
    var sid = '';
    var amnt = '';
    //Recortamos espacios al principio y al final y seccionamos el texto donde deben haber solo 2 valores: 1Cantidad 2Usuario en formato <@U1234|user>
    var text = event.text;
    var args = text.trim().split(" ");
    
    if(args.length == 2 && text.includes("|","@","<",">")){
        
        var user = args[1].split("|");
        sid = user[0].slice(2, user[0].length);
        amnt = args[0];
        
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
                        "text":'The user has not set a valid ETH address.'
                    }]
                });
                return;
            }

            //Obtenemos la informacion de la base de datos y operamos en ella para sacar la direccion de ethereum
            jsonarray = JSON.stringify(data).split("\"");
            addr = jsonarray[5];
            
            //Formamos la URL de peticion de nuestro EC2
            ec2 = "/sendt?addr=" + addr +"&amount="+amnt;
            
            //Iniciamos la connexion http como servicio segun la libreria
            const svc = new AWS.Service({
 
                endpoint: 'http://ec2-35-178-250-121.eu-west-2.compute.amazonaws.com:3000',
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
                        "text":'The command was not called correctly, make sure you specify the amount (number) followed by the @user. Example: /sendpool 150 @example.'
                        }]
                    });
                return;
                }
                
                callback(null,data)
            });

            return;
        });
    }
    
    else callback(null,{
        "text":"Failure",
        "attachments": [{
            "text":'The command was not called correctly, make sure you specify the amount (number) followed by the @user. Example: /sendpool 150 @example.'
        }]
    });
    
    return;
}
>>>>>>> 5dcd2321892110303e86246df1e8c5b7f149c4eb
