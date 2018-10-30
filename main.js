//Codigo creado por Andres Sanchez Martinez.
//Utilizamos las librerias instaladas en el entorno para poder iniciar las funciones.
//Script para correr un bot que envia tokens comunicandose mediante http en el puerto 3000.
const web3 = require('web3');
const express = require('express');
const sign = require('ethereumjs-tx');

const bot = express();

//Nos conectamos mediante web3 a nuestro endpoint en Infura.
web3js = new web3(new web3.providers.HttpProvider("https://ropsten.infura.io/v3/"+YOUR_INFURA_API));

bot.get('/sendt',function(req,res){

    //Obtenemos las variables pasadas por la funcion lambda.
    //Expresamos las variables necesarias para la creacion de una RawTransaction menos nonce.
    var toAddr = req.query.addr;                                                                        //Direccion destinataria
    var amount = req.query.amount;                                                                      //Cantidad a enviar
    var myAddr = '0x41322ED3e97490fF9baf450085F4Af703887a851';                                          //Diraccion de la 'pool'
    var key = Buffer.from(YOUR_PRIVATE_KEY, 'hex')    //Clave privada en hex
    var abi = ABI_OF_SMART_CONTACT
    var caddr = ADDR_OF_SMART_CONTRACT;                                            //Address donde esta alojado el contrato
    var datetime = new Date();

    var contract = new web3js.eth.Contract(abi,caddr);

    //Utilizamos las funciones de web3 para conseguir en numero de trnasacciones de la red para la direccion para el nonce.
    web3js.eth.getTransactionCount(myAddr).then(function(v){

    var count = v;
    actual = contract.methods.balanceOf(myAddr).call();

        if(actual > amount){
                
            var tokens = web3js.utils.toHex(amount);
    
            //Configuramos nuestra transaccion.
            var rawTran = {
                "from":myAddr, 
                "gasPrice":web3js.utils.toHex(20* 1e9),
                "gasLimit":web3js.utils.toHex(7600027),
                "to":caddr,
                "value":"0x0",
                "data":contract.methods.transfer(toAddr, tokens).encodeABI(),
                "nonce":web3js.utils.toHex(count)}

            //Simplemente para constatar en la consola el tiempo de ejecucion.
            console.log('-----------------------'+datetime+'-----------------------');
            console.log(rawTran);

            //Mediante ethereumjs-tx creamos la transaccion.
            var transaction = new sign(rawTran);

            //Firmamos la transaccion con nuestra clave privada.
            transaction.sign(key);

            //Envimos la transaccion firmada y esperamos a recibir el hash unico de transaccion.
            web3js.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex')).on('transactionHash',console.log)
            .catch(function onError(error) {
                res.status(400).send({
                        "text":"Failure",
                        "attachments": [{
                        "text":'The command was not called correctly, make sure you specify the amount (number) followed by the @user. Example: /sendpool 150 @example.'
                        }]
                    });
                return;
            });
                    
            //Todo se ha ejecutado correctamente, se acepta el pago de tokens a dicho usuario.
            res.status(200).send({
                "response_type": "in_channel",
                "text":"Accomplished",  
                "attachments": [{
                "text":'We sent a transaction of '+ amount +' tokens to: '+toAddr
            }]});
        };
    });
});

bot.listen(3000, () => console.log('Listening to port 3000 for GET proposals'));