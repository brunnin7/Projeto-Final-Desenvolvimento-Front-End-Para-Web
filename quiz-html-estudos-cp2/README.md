# TagLab — Quiz de HTML (CP2)

Versão independente do projeto CP1, preparada para atender ao checkpoint CP2. Esta pasta não substitui nem altera os arquivos da versão original.

## Tema

Tecnologia — fundamentos de HTML: estrutura de páginas, elementos, atributos, links, imagens, listas e formulários.

## Integrantes

- [Preencher nome do integrante 1]
- [Preencher nome do integrante 2, se houver]

## Funcionalidades do CP2

- O jogador informa o nome antes de iniciar.
- As perguntas são carregadas de `perguntas.json` usando `fetch`; elas não ficam escritas no JavaScript.
- Uma pergunta aparece por vez, com quatro alternativas.
- Cada alternativa é um botão acessível por teclado (Tab, Enter e Espaço).
- Depois da resposta, o quiz informa textualmente se acertou ou errou, mostra a alternativa correta quando necessário, exibe uma explicação e disponibiliza o link da fonte.
- A pontuação é calculada durante a partida e exibida no resultado.
- O ranking registra as partidas em `sessionStorage`, ordena as melhores pontuações e mantém até 10 resultados na sessão da aba.
- O botão **Jogar novamente** inicia uma nova partida sem recarregar a página e sem apagar o ranking.
- O botão **Trocar jogador** retorna à tela inicial.
- Há foco visível, mensagens acessíveis e layout responsivo para celular.

## Estrutura

```text
quiz-html-estudos-cp2/
├── index.html
├── styles.css
├── app.js
├── perguntas.json
├── README.md
└── .gitignore
```

## Como executar

O projeto usa `fetch('./perguntas.json')`. Por isso, não abra o `index.html` com dois cliques (`file://`), pois o navegador pode bloquear a leitura do JSON.

### Opção 1 — VS Code + Live Server

1. Abra esta pasta no VS Code.
2. Instale a extensão **Live Server**.
3. Clique com o botão direito em `index.html`.
4. Selecione **Open with Live Server**.

### Opção 2 — Python

Abra o terminal nesta pasta e execute:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

### Opção 3 — Publicação HTTPS

Publique todos os arquivos da pasta em um serviço de hospedagem estática, como Netlify ou GitHub Pages.

## Formato de `perguntas.json`

Cada pergunta precisa conter:

- `pergunta`: enunciado.
- `alternativas`: exatamente quatro opções.
- `resposta`: índice da opção correta, começando em zero.
- `explicacao`: explicação apresentada depois da resposta.
- `fonte`: endereço HTTPS para consulta.

Exemplo:

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

## Como o ranking funciona

O código lê o valor `ranking` do `sessionStorage` usando `JSON.parse` e grava as partidas com:

```js
sessionStorage.setItem("ranking", JSON.stringify(ranking));
```

O armazenamento é específico da aba/sessão do navegador. Fechar a aba encerra essa sessão. O ranking é mantido quando o jogador escolhe **Jogar novamente**.

## Roteiro de testes exigido

1. Abra o site pelo Live Server ou pelo endereço HTTPS publicado.
2. Digite um nome e inicie o quiz.
3. Responda a todas as perguntas.
4. Confira o feedback, a explicação e o link da fonte após cada resposta.
5. Confira a pontuação e o ranking na tela final.
6. Clique em **Jogar novamente** e confirme que o ranking anterior continua aparecendo ao terminar a nova partida.
7. Abra DevTools → Application → Session Storage e confira a chave `ranking`.
8. Faça uma partida inteira usando apenas `Tab` e `Enter` (os botões de alternativa também aceitam Espaço).
9. Teste em uma largura de celular e confirme que não há rolagem horizontal.

## Entrega CP2

- Faça commits descritivos com a participação de todos os integrantes.
- Publique o site com HTTPS.
- Crie e envie a tag `cp2-entrega` no repositório:

```bash
git tag cp2-entrega
git push origin cp2-entrega
```

Antes da entrega, preencha os nomes dos integrantes e confirme que a versão publicada corresponde à versão marcada pela tag.
