//Codigo creado por Andres Sanchez Martinez.
//Utilizamos las librerias instaladas en el entorno para poder iniciar las funciones.
//Script para correr un bot que envia tokens comunicandose mediante http en el puerto 3000.
const web3 = require('web3');
const express = require('express');
const sign = require('ethereumjs-tx');

const bot = express();

//Utilizamos nuestro endpoint en Infura para acceder a la cadena.
web3js = new web3(new web3.providers.HttpProvider("https://ropsten.infura.io/v3/"+YOUR_ENDPOINT));

bot.get('/sendpool',function(req,res){

    //
    var abi = CONTRACT_ABI
    var caddr = CONTRACT_ADDR;                                            //Direccion donde esta alojado el contrato
    var contract = new web3js.eth.Contract(abi,caddr);

    //Obtenemos las variables pasadas por la funcion lambda.
    //Expresamos las variables necesarias para la creacion de una RawTransaction menos nonce.
    var toAddr = req.query.addr;                                                                        //Direccion destinataria
    var amount = req.query.amount;                                                                      //Cantidad a enviar
    var myAddr = '0x41322ED3e97490fF9baf450085F4Af703887a851';                                          //Direccion de la 'pool'
    var key = Buffer.from(YOUR_ADDR_PRIVATE_KEY, 'hex')    //Clave privada en hex
    var datetime = new Date();
    
    //Utilizamos las funciones de web3 para conseguir en numero de trnasacciones de la red para la direccion para el nonce.
    web3js.eth.getTransactionCount(myAddr).then(function(v){

        var count = v;
        actual = contract.methods.balanceOf(myAddr).call();

        if(actual > amount){
                    
            var tokens = web3js.utils.toHex(amount* 1e2);
        
            //Configuramos nuestra transaccion.
            var rawTran = {
                "from":myAddr, 
                "gasPrice":web3js.utils.toHex(20* 1e9),
                "gasLimit":web3js.utils.toHex(7600027),
                "to":caddr,
                "value":"0x0",
                "data":contract.methods.transfer(toAddr, tokens).encodeABI(),
                "nonce":web3js.utils.toHex(count)}

            //Mediante ethereumjs-tx creamos la transaccion.
            var transaction = new sign(rawTran);

            //Firmamos la transaccion con nuestra clave privada.
            transaction.sign(key);
            var serialized = transaction.serialize();

            console.log('-----------------------'+datetime+'-----------------------');
            console.log(rawTran);

            //Enviamos la transaccion firmada y esperamos a recibir el hash unico de transaccion.
            web3js.eth.sendSignedTransaction('0x'+serialized.toString('hex'))
            
            //Todo se ha ejecutado correctamente, se acepta el pago de tokens a dicho usuario.
            .on('transactionHash', function showInfo(transactionHash){
                    
                res.status(200).send({
                    "response_type": "in_channel",
                    "text":"Accomplished",  
                    "attachments": [{
                    "text":'We sent a transaction for '+ amount +' SlackTokens.\nProof: https://ropsten.etherscan.io/tx/'+transactionHash
                    }]
                });
            
                console.log('Tx de la transaccion: '+transactionHash);
                return;
                })

            //Manejamos el error sin enviarselo al usuario final.
            .on('error',function onError(error) {
                
                res.status(400).send({
                        "text":"Failure",
                        "attachments": [{
                        "text":'There has been an error while creating the transaction. Contact the owner @marnez for more details. ERROR: 002'
                        }]
                    });
                console.log(error);
                return;
            });
        }

        else{
            
            res.status(200).send({
                "response_type": "in_channel",
                "text":"Failure",  
                "attachments": [{
                "text":'The money sent exceeded the actual '+actual+' SlackTokens left on the pool account.'
                }]
            });
        }
    });
});

bot.listen(3000, () => console.log('MANAGER20: Escuchando el puerto 3000.'));