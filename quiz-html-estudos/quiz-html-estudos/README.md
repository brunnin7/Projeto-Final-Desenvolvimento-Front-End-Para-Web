# TagLab — Quiz de HTML

Um quiz educativo de HTML para quem está começando no desenvolvimento web. Projeto do CP1, preparado para evoluir no CP2.

## Tema

Tecnologia — fundamentos de HTML: estrutura das páginas, elementos semânticos, links, imagens, listas e formulários.

## Integrantes

- **[Gustavo Santos de Oliveira]**
- **[João Pedro Ribeiro Otreira]**
- **[Bruno Agostinho da Souza]**
- **[Isabala de Sena Alves]**
- **[Ryan Oliveira Trigo Santos]**
- **[Renan Oliveira Trigo Santos]**
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

## Opção 2 :

Acesse o link: https://quiz-htmltrabalhofinal.netlify.app
