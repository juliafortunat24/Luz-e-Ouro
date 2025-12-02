# Luz e Ouro — Aplicativo de Joias e Acessórios

Aplicativo mobile desenvolvido com **React Native (Expo)** e **Supabase**, oferecendo uma experiência completa para navegação, vitrine, filtros, favoritos, carrinho, cálculo de frete e pagamento.

---

## Tecnologias Utilizadas

* **React Native (Expo)**
* **Supabase (Auth, Database e Storage)**
* **React Navigation**
* **Context API** (Tema claro/escuro)
* **API ViaCEP** para consulta automática de endereço

---

##  Funcionalidades do Aplicativo

###  Carrinho de Compras

* Adicionar e remover produtos
* Atualizar quantidade em tempo real
* Subtotal e total calculados automaticamente
* Itens armazenados no Supabase por usuário

###  Cálculo de Frete

* Busca automática de endereço pelo CEP (ViaCEP)
* Frete grátis a partir de **R$ 399,90**
* Campo adicional para **número da residência**

###  Métodos de Pagamento

* Seleção entre:

  * **Cartão de Crédito** → exibe campos do cartão
  * **PIX** → exibe QR Code na hora
  * **Boleto**

###  Favoritos

* Adicionar e remover favoritos
* Sincronização automática via Supabase

###  Sistema de Filtros

* Filtro por categoria
* Filtro por material
* Filtro por faixa de preço

###  Tema Claro e Escuro

* Interface totalmente adaptada ao tema escolhido

###  Perfil do Usuário

* Exibição de dados
* Logout e gerenciamento da conta

---

##  Estrutura do Projeto

```
src/
 ├── screens/        # Telas principais
 ├── components/     # Componentes reutilizáveis
 ├── context/        # ThemeContext e funcionalidades globais
 ├── supabaseClient.js
 └── App.js
```

---

##  Como Rodar o Projeto

###  Clonar o repositório

```sh
git clone https://github.com/seu-repo/luz-e-ouro.git
cd luz-e-ouro
```

###  Instalar dependências

```sh
npm install
```

###  Configurar o Supabase

Edite o arquivo:

```
src/supabaseClient.js
```

E insira suas chaves:

```js
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

###  Iniciar o projeto

```sh
npx expo start
```

---

##  Estrutura do Banco de Dados (Supabase)

### **Tabela: produtos**

| Campo     | Tipo    |
| --------- | ------- |
| id        | int     |
| nome      | text    |
| preco     | decimal |
| material  | text    |
| categoria | text    |
| foto_url  | text    |

### **Tabela: carrinho**

| Campo      | Tipo |
| ---------- | ---- |
| id         | int  |
| user_id    | uuid |
| produto_id | int  |
| quantidade | int  |

### **Tabela: favoritos**

| Campo      | Tipo |
| ---------- | ---- |
| id         | int  |
| user_id    | uuid |
| produto_id | int  |

---

##  Melhorias Recentes

* Campo para **número da residência** adicionado
* Formulário de **Cartão de Crédito** dinâmico
* Exibição automática de **QR Code PIX**
* Melhorias no layout do Carrinho
* Ajustes no tema e responsividade

---

##  Screenshots (adicione suas imagens)

```
screenshots/
 ├── home.png
 ├── carrinho.png
 ├── pagamento.png
```

Este projeto é distribuído sob a licença **MIT**.
