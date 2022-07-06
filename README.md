# Grupo 5 - Projeto e Arquitetura de Software

## Informações sobre o serviço

Esta API tem como objetivo principal atender aos requisitos solicitados por meio da atividade acadêmica do curso de Pós Graduação em Engenharia de Software na Universidade do Vale do Rio dos Sinos. 

**Atividade:** M4 | Tarefa 1 - Consumindo uma API para um Produto


## Integrantes do Grupo

|         | Grupo      | Contact Info                                                                    |
| ------- | --------- | ------------------------------------------------------------------------------  |
| Anderson Rodrigues | Grupo 5 | [Perfil Unisinos](https://unisinos.instructure.com/groups/23953/users/939)    |
| Bruno Adam | Grupo 5 | [Perfil Unisinos](https://unisinos.instructure.com/groups/23953/users/787)   |
| Filipe Franco | Grupo 5 | [Perfil Unisinos](https://unisinos.instructure.com/groups/23953/users/56469)      |
| Pedro Lumertz | Grupo 5 | [Perfil Unisinos](https://unisinos.instructure.com/groups/23953/users/58501)     |
| Rodrigo Freund | Grupo 5 | [Perfil Unisinos](https://unisinos.instructure.com/groups/23953/users/55806)     |

## Desenvolvimento Local

### 1. Installation

Clone the project and create the .env with following commands:

```bash
# Clone the project
git clone git@github.com:andersoonluan/grupo5-arquitetura-software-unisinos.git

# Open folder
cd grupo5-api

# Install dependencies
cp .env.sample .env
```

### 2. Running

Inside the project folder run docker with the following command:

```bash
# Run docker-compose.yml
docker-compose up -d
```

### 3. Docs

Go to the following URL to get swagger docs:
```bash
http://localhost:8011/api/
```

### Tests

#### Unit tests

At the project root folder, run `npm run test` in terminal.