'using strcit';

// @title Script que guarda direcciones de Ethereum con clave primaria el ID de usuario de Slack
// @author Andres Sanchez Martinez
//Utilizamos las librerias nativas de el AWS que nos dan acceso a la base de datos y iniciamos sesion buscando la zona como parametro
const AWS = require('aws-sdk');
const baseETH = new AWS.DynamoDB.DocumentClient({region: 'eu-west-2'});

//Token que nos permite saber de donde viene el mensaje, rechazar los de origen desconocidos
const origin = SLACK_VERIFICATION_TOKEN;

exports.handler = (event, context, callback) => {
    
    //Sabemos que nos pasan todos los parametros como String
    var uid = event.user_id;
    var text = event.text;
    
    if(event.token == origin){
   
        //Realizamos comprobaciones sobre el texto para comprobar que pertenece a una direccion
        if (text.includes('0x') && text.length==42){
        
            //Construimos el JSON a pasar a la base de datos
            var params = {
                Item: {
                    sid: uid,
                    addr: text
                },
        
                TableName: TABLE_NAME
            };
            
             //Se envia la nueva entrada a nuestra base de datos de direcciones manejando posibles errores
            baseETH.put(params, function(err, data){
               
                if(err) callback(data);
                
                else callback(null,{
                    "response_type": "in_channel",
                    "text": "Accomplished",
                    "attachments": [{
                        "text":'Setting ETH address for ' + event.user_name +': ' +event.text
                    }]
                });
            });
        }
    
        //Se ha recibido el mensaje pero no se puede incluir en nuestra base de datos porque la direccion es erronea
        else callback(null,{
            "text": "Failure",
            "attachments": [{
            "text":'Make sure your message constains only a valid Ethereum address'
            }]
        });
    }
}