# 🌳 EcoMapBrasil

> Plataforma web interativa de conscientização sobre o desmatamento e a fauna ameaçada nos biomas brasileiros.

**🔗 Acesse o projeto:** [ecomapbrasil-17756.web.app](https://ecomapbrasil-17756.web.app/)

---

## 📖 Sobre o projeto

O **EcoMapBrasil** nasceu como Projeto Interdisciplinar do curso e reúne, em um único lugar, dados
ambientais sobre os seis biomas brasileiros: onde o desmatamento acontece, quais espécies estão
ameaçadas e o que cada pessoa pode fazer a respeito.

A proposta é transformar dado bruto em algo que o visitante entenda em poucos segundos — mapa,
gráfico e ficha de espécie no lugar de tabelas.

---

## ✨ Funcionalidades

| Página | O que faz |
|---|---|
| **Home** | Landing page com estatísticas animadas, gráficos (barras, donut, linha e radar) construídos em SVG puro, linha do tempo do desmatamento, seção de soluções práticas e área de avaliações dos usuários |
| **Mapa** | Mapa interativo em Leaflet sobre imagens de satélite, com os 6 biomas destacados e a camada de alertas de desmatamento (GeoJSON). Clique no bioma para ver área, percentual desmatado e descrição |
| **Animais** | Catálogo de espécies ameaçadas com busca por nome, filtros por bioma e por status de conservação, gráfico de tendência populacional por espécie e ficha detalhada com as principais ameaças |
| **Autenticação** | Cadastro e login por e-mail/senha (Firebase Auth); usuários logados podem publicar avaliações com nota em estrelas, salvas em tempo real no Firestore |

Todas as telas são **responsivas**, com layouts próprios para mobile, tablet e desktop
(bottom sheet e menu overlay no mobile, sidebar no desktop).

---

## 🛠️ Tecnologias

**Front-end**
- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [React Router 7](https://reactrouter.com/) — navegação SPA com transição de fade entre rotas
- [Tailwind CSS](https://tailwindcss.com/) (via CDN) + CSS-in-JS
- [Font Awesome](https://fontawesome.com/) — ícones

**Mapas e dados**
- [Leaflet](https://leafletjs.com/) — carregado sob demanda
- Tiles de satélite: ArcGIS World Imagery
- Alertas de desmatamento em GeoJSON (fonte DETER-B / INPE)

**Back-end e infraestrutura**
- [Firebase](https://firebase.google.com/) — Authentication, Firestore, Storage e Hosting
- [Supabase](https://supabase.com/) — Storage das imagens das espécies

**Qualidade**
- ESLint 9 com regras de React Hooks e React Refresh

---

## 📁 Estrutura do projeto

```
EcoMapBrasil/
├── public/
│   ├── logo2.png
│   └── meuarquivo4.json        # GeoJSON com os alertas de desmatamento
├── src/
│   ├── assets/                 # Logo e imagens estáticas
│   ├── components/
│   │   ├── AuthModal.jsx       # Modal de login e cadastro
│   │   └── Reviews.jsx         # Avaliações com Firestore em tempo real
│   ├── pages/
│   │   ├── Home.jsx            # Landing page e visualizações
│   │   ├── Mapa.jsx            # Mapa interativo dos biomas
│   │   └── Animais.jsx         # Catálogo de espécies ameaçadas
│   ├── firebase.js             # Inicialização do Firebase
│   ├── supabase.js             # Cliente Supabase
│   ├── App.jsx                 # Rotas e estado de autenticação
│   └── main.jsx                # Entrada da aplicação
├── firebase.json               # Configuração do Hosting
└── vite.config.js
```

---

## 🚀 Como rodar localmente

**Pré-requisitos:** Node.js 18 ou superior e npm.

```bash
# 1. Clone o repositório
git clone https://github.com/SEU-USUARIO/EcoMapBrasil.git
cd EcoMapBrasil

# 2. Instale as dependências
npm install

# 3. Rode o servidor de desenvolvimento
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Pré-visualiza localmente o build de produção |
| `npm run lint` | Roda o ESLint no projeto |

---

## 🌐 Deploy

O projeto está hospedado no **Firebase Hosting**:

```bash
npm run build
firebase deploy
```

---

## 📊 Sobre os dados

A camada de alertas de desmatamento do mapa usa dados públicos de detecção do **DETER-B (INPE)**,
com bioma, estado, município, área em hectares e ano de detecção por polígono.

Os demais números da interface (percentuais por bioma, séries populacionais das espécies e a linha
do tempo) são hoje valores de referência embutidos no código, usados para validar a experiência
visual. A próxima etapa do projeto é substituí-los por uma camada analítica alimentada com dados
oficiais — PRODES/INPE, ICMBio, IBGE e MapBiomas — processada em Python e servida por API.

---

## 👥 Equipe

Projeto Integrador desenvolvido por **Vinicius**, **Bruno**, **Cesar**, **João Flávio** e **João Gabriel**.

---

## 📄 Licença

Distribuído sob a licença MIT. Projeto acadêmico, sem fins lucrativos.
