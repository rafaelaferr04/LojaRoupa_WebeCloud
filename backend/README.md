# Backend Atelier WEC

REST API em Flask com MongoDB para suporte ao frontend.

## Setup

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Se o PowerShell bloquear a ativação do ambiente virtual:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## Configurar MongoDB

Antes de correr a API, define as variáveis de ambiente com os teus dados reais:

```powershell
$env:MONGODB_CONNECTION_STRING="mongodb+srv://UTILIZADOR:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority"
$env:DATABASE_NAME="atelier_wec"
```

## Run

```powershell
flask --app app run --debug
```

API local:

```text
http://127.0.0.1:5000
```

## Endpoints

Produtos:

```text
GET    /products
GET    /products/<id>
POST   /products
PUT    /products/<id>
PATCH  /products/<id>
DELETE /products/<id>
```

Filtros em produtos:

```text
/products?categoryKey=mulher
/products?subcategory=Vestidos
/products?group=Pronto a vestir
/products?search=casaco
```

Utilizadores:

```text
GET    /users
GET    /users/<id>
POST   /users
PUT    /users/<id>
PATCH  /users/<id>
DELETE /users/<id>
```

Encomendas:

```text
GET    /orders
GET    /orders/<id>
POST   /orders
PUT    /orders/<id>
PATCH  /orders/<id>
DELETE /orders/<id>
```

Filtro por email:

```text
/orders?userEmail=email@exemplo.com
```
