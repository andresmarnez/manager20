# ERC20 Pool manager para commandos en Slack

### Un bot que envía tokens ERC20 para gente registrada

Para instalar:

- Crea una base de datos DynamoDB en AWS:
    - Accede a tu panel de AWS y crea una base de datos NoSQL y una tabla.
    
- Crea las funciones Lambda:
    - Accede a Lambda en tu panel de AWS y añade las siguiente funciones:
        - add: 
            - Esta funcion se encargará de leer los parametros de slack y asignar la direccion enviada al usuario que ejecuta el comando.
            - En la conexión a la base de datos modifica los parametros de ser necesario. En mi caso con la zona de lanzamiento fue suficiente.
        - sendpool:
            - Verifica los parametros de entrada y recoge los datos asociados al usuario mencionado. Despues envia una petición GET al servidor con los parametros necesarios para enviar la transacción.
        
- Configura las salidas API GETAWAY para ambas funciones:
    - add:
        - function: YOUR LAMBDA ADD FUNCTION
        - method: GET
        - integration request: 
            -  mapping templates:
                - content-type: application/json
                - content: {   
                   
                    "token" : "$input.params('token')",
                    "user_id" : "$input.params('user_id')",
                    "user_name" : "$input.params('user_name')",
                    "text" : "$input.params('text')"
                }

    - sendpool:
        - function: YOUR LAMBDA SENDPOOL FUNCTION
        - method: GET
        - integration request: 
            -  mapping templates:
                - content-type: application/json
                - content: {   
                   
                    "token" : "$input.params('token')",
                    "text" : "$input.params('text')"
                }

- Crear comandos de Slack.
    - Ves a https://slack.com/intl/es-es/get-started
    - Registrate y crea un espacio de trabajo.
    - Ve a https://api.slack.com/apps.
    - Busca Slash commands como integraciones al sitio de trabajo.
    - Crea 2 commandos:
        - add:
            - `url` utiliza la url de la API para la funcion add.
            - `token` guarda este token y utilizalo en tu funcion para comprobar el origen del mensaje.
