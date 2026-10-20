# TagLab — Quiz de HTML

Um quiz educativo de HTML para quem está começando no desenvolvimento web. Projeto do CP1, preparado para evoluir no CP2.

## Tema

Tecnologia — fundamentos de HTML: estrutura das páginas, elementos semânticos, links, imagens, listas e formulários.

## Integrantes

- **[Preencher nome do integrante 1]**
- **[Preencher nome do integrante 2, se houver]**

## Funcionalidades

- Página inicial com identidade visual, descrição e botão para começar.
- Quiz interativo com 10 perguntas de quatro alternativas.
- Correção imediata com destaque visual, explicação e link para a fonte.
- Barra de progresso e resultado final com opção de reiniciar.
- Layout responsivo e sem rolagem horizontal em telas pequenas; foco visível para navegação por teclado.

## Estrutura

```text
quiz-html-estudos/
├── index.html       # Página inicial e estrutura das telas
├── styles.css       # Identidade visual e responsividade
├── app.js           # Lógica do quiz (pronta para CP2)
├── perguntas.json   # Dados das perguntas
├── .gitignore       # Arquivos não versionados
└── README.md        # Documentação
```

## Como executar

O site carrega `perguntas.json` usando `fetch`. Por segurança, alguns navegadores bloqueiam essa leitura quando `index.html` é aberto com `file://`.

**Opção 1 — VS Code:** abra a pasta no VS Code e utilize a extensão *Live Server*. Clique com o botão direito em `index.html` e selecione **Open with Live Server**.

**Opção 2 — Python:** na pasta do projeto, execute:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000` no navegador.

**Opção 3 — Publicação:** publique os arquivos no **GitHub Pages**, que já serve o site por HTTPS.

## Estrutura de uma pergunta

Cada objeto em `perguntas.json` tem: `pergunta` (texto), `alternativas` (quatro opções), `resposta` (índice correto de 0 a 3), `explicacao` e `fonte` (link HTTPS).

```json
{
  "pergunta": "O que significa a sigla HTML?",
  "alternativas": [
    "HyperText Markup Language",
    "HighText Machine Language",
    "Hyperlink and Text Markup Language",
    "Home Tool Markup Language"
  ],
  "resposta": 0,
  "explicacao": "HTML significa HyperText Markup Language.",
  "fonte": "https://developer.mozilla.org/pt-BR/docs/Web/HTML"
}
```

> O índice `0` representa a primeira alternativa, `1` a segunda, e assim por diante.

## Git e publicação — requisitos do CP1

1. Crie um repositório GitHub e adicione todos os integrantes como colaboradores em **Settings → Collaborators**.
2. Dentro da pasta, execute:

```bash
git init
git add .
git commit -m "feat: criar estrutura do quiz de HTML"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPO.git
git push -u origin main
```

3. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, diretório `/(root)` e salve. Aguarde o link HTTPS aparecer.
4. Marque a entrega com uma tag e envie ao repositório:

```bash
git tag cp1-entrega
git push origin cp1-entrega
```

**Antes de entregar:** substitua os nomes dos integrantes neste arquivo e confirme que a URL HTTPS está acessível. A criação do repositório, a inclusão dos colaboradores, a publicação e a tag são ações manuais: os arquivos entregues não realizam esses passos automaticamente.

## CP2

A lógica atual já lê as perguntas do JSON e implementa o fluxo interativo. No CP2, o grupo pode expandir com níveis de dificuldade, categorias e histórico de respostas sem alterar o contrato básico dos dados.
