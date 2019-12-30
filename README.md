<h1 align="center">
  <img alt="Gympoint" title="Gympoint" src=".github/logo.png"/>
</h1>

## Instruções - Backend

### Ferramentas

- Sucrase + Nodemon;
- ESLint + Prettier + EditorConfig;
- Sequelize (Utilize PostgreSQL);
- Redis;
- Mailtrap;

#### Instalação
```js
yarn install
```

#### Banco de dados
- Criar banco de dados **gympoint** no PostgreSQL;
- Executar as migrations e as seeds;
```js
yarn sequelize db:migrate
yarn sequelize db:seed:all
```

#### Autenticação

```js
  email: "admin@gympoint.com",
  password: "123456",
```

## Instruções - Frontend
- A versão web do projeto Gympoint representa a visão da academia, ou seja, todas funcionalidades presentes na versão web são para administradores. As funcionalidades para o aluno serão dispostas no aplicativo mobile.

#### Instalação
```js
yarn install
```

#### Execução
```js
yarn start
```
- Abra http://localhost:3000 no browser;

#### Autenticação

```js
  email: "admin@gympoint.com",
  password: "123456",
```

## Instruções - Mobile (Testado somente no IOS)
-App criado com:
```js
react-native init
```

