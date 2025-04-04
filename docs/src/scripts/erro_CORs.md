Como muitos desses proxies gratuitos costumam sair do ar, uma solução mais estável seria hospedar seu próprio proxy CORS ou configurar o servidor da API para permitir requisições do seu domínio.

### Opções para resolver o problema:

#### 1️⃣ **Usar um proxy CORS alternativo**
Tente esses serviços gratuitos:
- [AllOrigins](https://allorigins.win/) → Exemplo de uso:  
  ```
  https://api.allorigins.win/raw?url=http://sdw24.sa-east-1.elasticbeanstalk.com/champions
  ```
- [Thingproxy](https://thingproxy.freeboard.io/) → Exemplo de uso:  
  ```
  https://thingproxy.freeboard.io/fetch/http://sdw24.sa-east-1.elasticbeanstalk.com/champions
  ```

#### 2️⃣ **Criar seu próprio proxy CORS**
Se precisar de uma solução mais confiável, pode rodar um proxy CORS em um servidor próprio com **Node.js** e Express:

```javascript
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(cors());

app.use(
  "/proxy",
  createProxyMiddleware({
    target: "http://sdw24.sa-east-1.elasticbeanstalk.com",
    changeOrigin: true,
    pathRewrite: { "^/proxy": "" },
  })
);

app.listen(8080, () => {
  console.log("Proxy CORS rodando na porta 8080");
});
```
Depois, você pode fazer requisições assim:
```
http://seuservidor:8080/proxy/champions
```

#### 3️⃣ **Configurar o servidor da API**
Se você tiver controle sobre o servidor, pode permitir CORS diretamente no backend adicionando este cabeçalho HTTP:
```
Access-Control-Allow-Origin: *
```
Ou, se estiver usando **Express.js**, pode ativar o CORS assim:
```javascript
const cors = require("cors");
app.use(cors());
```
