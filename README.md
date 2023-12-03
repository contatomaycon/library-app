# Library APP

Front-end da API do sistema de Library

## Informações da Aplicação

Para logar basta digitar ou clicar em entrar (Os dados já estão aplicados no formulário):

```
Usuário: admin
Senha: admin
```

A página inicial da aplicação exibe uma listagem de todos os livros. Cada livro inclui as seguintes informações:

```
Título
Autor
Gênero
Editora
Data de Cadastro
```

- Para visualizar os detalhes de um livro, clique no título do livro.
- Para editar um livro, clique no botão "Editar".
- Para excluir um livro, clique no botão "Excluir".
- Para criar um novo livro, clique no botão "Adicionar".

- Exibição do clima atual
A aplicação também exibe o clima selecionada. Para isso, é utilizado o serviço da API HG Brasil.
Basta clicar no menu clima, escolher o estado e a cidade.

```
Temperatura
Descrição
```

## Siga os passos:

- Necessária a versão 18.16.0 no NodeJS
- Necessário o gerenciador de pacote YARN

### .env
Na raiz do projeto, altere o arquivo .env.example para .env

### Instale os pacotes
```
yarn install
```

### Rode a aplicação
```
yarn dev
```
