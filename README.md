# Soter para la cuenta account 17236 de Servifacil

Soter es una plataforma para llevar el control de la seguridad de las empresas.

En soter se puede llevar el contro de entrada y salida de contratistas
Frontend de plataforma Soter



# Como correr el proyecto

Para arrancar el proyecto es neceario contar con Docker instalado en tu computadora.

Una vez instalado docker, ir a la carpeta de docker del repo con:

```
cd docker/
```

Una vez dentro del la carpeta de **docker** corres :

```
docker compose up
```

Esto va a arrancar el proyecto algo asi:


```
$ docker compose up
WARN[0000] Found orphan containers ([lkf-addons]) for this project. If you removed or renamed this service in your compose file, you can run this command with the --remove-orphans flag to clean it up. 
[+] Running 1/1
 ✔ Container soter  Created                                                                                                                                                              0.0s 
Attaching to soter
yarn run v1.22.22
$ next dev --turbopack
soter  |    ▲ Next.js 15.0.2 (Turbopack)
soter  |    - Local:        http://localhost:3000
soter  | 
soter  |  ✓ Starting...
soter  | Attention: Next.js now collects completely anonymous telemetry regarding usage.
soter  | This information is used to shape Next.js' roadmap and prioritize features.
soter  | You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
soter  | https://nextjs.org/telemetry
```

Una vez que saga esto, ingresa en tu navegador a `http://localhost:3000`

Si gustas correr el proyecto en segundo plano, correr:

```
docker compuse up -d
```

Una vez que el proyecto este en segundo plano si deseas ver los logs corres

```
docker logs -f soter
```


