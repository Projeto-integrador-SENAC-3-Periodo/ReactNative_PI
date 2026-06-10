# Sistema de Gestão de Atividades Complementares - PortalAC

## Sobre o Projeto

O PortalAC Mobile é a versão móvel do Sistema de Gestão de Atividades Complementares desenvolvido para a Faculdade SENAC.

O aplicativo permite que os estudantes acompanhem e gerenciem suas atividades complementares diretamente pelo celular, tornando o processo mais simples, rápido e acessível.

Por meio do aplicativo, os alunos podem enviar atividades, anexar comprovantes, acompanhar o status das solicitações e visualizar suas horas complementares aprovadas.

O aplicativo se comunica com a API do sistema SPRIG para realizar autenticação, armazenamento e consulta dos dados.


# Principais Funcionalidades

## Aluno

* Realizar login no sistema
* Visualizar informações pessoais
* Enviar atividades complementares
* Anexar comprovantes (PDF ou imagem)
* Acompanhar o status das atividades
* Consultar horas aprovadas
* Receber notificações
* Alterar senha

# Arquitetura do Sistema

O aplicativo móvel se comunica com a API do sistema, responsável pelas regras de negócio, autenticação e persistência dos dados.

```plaintext
Aplicativo Mobile
        │
        ▼
 Spring Boot REST API
        │
        ▼
      MySQL
```


# Tecnologias Utilizadas

## Desenvolvimento Mobile

* React Native
* Expo
* JavaScript

## Integração com API

* Axios
* JWT Authentication

## Comunicação

* API REST
* JSON

## Ferramentas

* Git
* GitHub
* Postman
* Visual Studio Code

# Estrutura do Projeto

```plaintext
src
├── screens
├── components
├── navigation
├── services
├── contexts
├── hooks
├── assets
└── styles
```

# Principais Telas

## Tela de Login

Permite que o usuário acesse o sistema utilizando suas credenciais.

### Funcionalidades

* Login com e-mail
* Validação de credenciais
* Armazenamento do token JWT
* Tratamento de erros

## Tela Inicial

Exibe informações gerais do aluno.

### Funcionalidades

* Resumo das horas complementares
* Acesso rápido às funcionalidades
* Notificações

## Tela de Atividades

Permite visualizar todas as atividades enviadas.

### Funcionalidades

* Listagem das atividades
* Status de cada atividade
* Visualização de detalhes
* Consulta de horas aprovadas

## Tela de Nova Atividade

Permite cadastrar uma nova atividade complementar.

### Campos

* Nome da atividade
* Descrição da atividade
* Categoria
* Quantidade de horas
* Comprovante

## Tela de Perfil

Permite gerenciar os dados do usuário.

### Funcionalidades

* Visualizar informações pessoais
* Alterar senha
* Encerrar sessão (logout)

# Autenticação

O aplicativo utiliza autenticação baseada em JWT (JSON Web Token).

## Processo de Login

1. O usuário informa e-mail e senha.
2. O aplicativo envia os dados para a API.
3. A API valida as credenciais.
4. Um token JWT é gerado.
5. O token é armazenado no dispositivo.
6. O usuário recebe acesso às funcionalidades do sistema.

# Comunicação com o Backend

Toda comunicação entre o aplicativo e o backend é realizada por meio de APIs REST utilizando JSON.

# Instalação

## Pré-requisitos

* Node.js
* Expo CLI
* Android Studio (opcional)
* Aplicativo Expo Go


## Instalar Dependências

```bash
npm install
```

---

## Executar o Projeto

```bash
npx expo start
```

Após a execução, basta escanear o QR Code utilizando o aplicativo Expo Go.

# Testes

O aplicativo foi testado nos seguintes cenários:

* Login de usuários
* Comunicação com a API
* Navegação entre telas
* Envio de atividades
* Validação de token
* Tratamento de erros

# Melhorias Futuras

* Notificações push
* Tema escuro
* Lembretes de atividades
* Funcionamento offline
* Dashboard avançado
* Autenticação biométrica


# Equipe

**Projeto Integrador – Faculdade SENAC Pernambuco**

### Integrantes

* Abigail Nazário
* Carolline Barbosa
* Sofia Leitão
* Tamirys Maria

# Licença

Este projeto foi desenvolvido exclusivamente para fins acadêmicos como parte das atividades do Projeto Integrador do curso de Análise e Desenvolvimento de Sistemas da Faculdade SENAC Pernambuco.
