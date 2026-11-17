# TagLab — Quiz de HTML (CP3)

## Sobre o projeto

O **TagLab** é um quiz interativo para revisar fundamentos de HTML. O jogador informa o nome, responde às perguntas uma por vez, recebe feedback com explicações e fontes de estudo, acompanha a pontuação e consulta o ranking da sessão.

Esta é a versão preparada para o **CP3**. Ela mantém a estrutura e as funcionalidades desenvolvidas nos checkpoints anteriores e não substitui a pasta da versão CP2.

## Tema

Tecnologia — fundamentos de HTML: estrutura de documentos, títulos, parágrafos, links, imagens, listas, elementos semânticos e formulários.

## Integrantes e papéis

Os integrantes abaixo constam na documentação do repositório. A divisão de papéis é uma **sugestão para organizar a apresentação**; o grupo deve confirmar ou ajustar conforme a participação real de cada pessoa.

| Integrante | Papel sugerido para a apresentação |
|---|---|
| Gustavo Santos de Oliveira | Integração do projeto e explicação do fluxo geral do quiz |
| Bruno Agostinho de Souza | Estrutura HTML e organização das telas |
| João Pedro Ribeiro Otreira | Lógica JavaScript, carregamento das perguntas e controle da partida |
| Isabela de Sena Alves | Banco de perguntas, revisão dos enunciados e fontes |
| Ryan Oliveira Trigo Santos | Estilização CSS e comportamento responsivo |
| Renan Oliveira Trigo Santos | Testes, acessibilidade e documentação |

## Regras do quiz

1. O jogador informa um nome com pelo menos 2 caracteres e no máximo 24.
2. O quiz carrega as perguntas do arquivo `perguntas.json`.
3. Cada partida apresenta pelo menos 10 perguntas, uma por vez, com quatro alternativas.
4. Cada resposta correta vale 1 ponto.
5. Depois de escolher uma alternativa, o jogador não pode alterá-la. O sistema informa se a resposta está correta, mostra a resposta certa quando necessário, apresenta uma explicação e disponibiliza uma fonte para consulta.
6. Ao final, o sistema mostra a pontuação e registra a partida no ranking da sessão.
7. O ranking mantém até 10 partidas, ordenadas pela porcentagem de acertos; em caso de empate, a partida mais recente aparece primeiro.
8. **Jogar novamente** inicia outra partida sem recarregar a página e sem apagar o ranking. **Trocar jogador** retorna à tela inicial.

## Funcionalidades implementadas

- Carregamento assíncrono de `perguntas.json` com `fetch`.
- Validação do formato e da quantidade mínima de 10 perguntas antes de iniciar.
- Uma pergunta por tela, com quatro alternativas geradas a partir do JSON.
- Feedback imediato, explicação e link da fonte após cada resposta.
- Cálculo e exibição da pontuação final.
- Ranking persistido com `sessionStorage`, usando a chave `ranking`.
- Repetição da partida sem recarregar a página e preservando o ranking da aba.
- Tratamento de erro caso o arquivo JSON não possa ser carregado.

## Acessibilidade

Na revisão do código para o CP3, foram conferidos os seguintes pontos:

- **Estrutura semântica:** uso de `header`, `main`, `section`, `nav` quando aplicável, `footer`, títulos e rótulos associados aos campos.
- **Teclado:** campos, botões e links usam elementos HTML nativos. É possível percorrer os controles com `Tab` e `Shift + Tab`, ativar botões com `Enter` ou `Espaço` e enviar o formulário com `Enter`.
- **Foco visível:** botões e links possuem indicação `:focus-visible`; o campo de nome também apresenta destaque de foco.
- **Contraste:** a paleta foi revisada para manter boa leitura entre textos e fundos. O contraste dos números de linha do exemplo de código foi reforçado nesta versão.
- **Textos alternativos:** o projeto não utiliza elementos `<img>`; portanto, não há imagens de conteúdo sem atributo `alt` pendente. A ilustração de código é identificada para leitores de tela, e os símbolos decorativos são ocultados quando apropriado.
- **Mensagens dinâmicas:** feedback e ranking utilizam regiões anunciáveis por tecnologias assistivas (`aria-live`/`role="status"`).
- **Movimento:** há uma regra `prefers-reduced-motion` para reduzir animações quando o sistema do usuário solicita essa preferência.

A conferência final com leitor de tela e ferramentas como Lighthouse ou axe deve ser feita pelo grupo no navegador antes da apresentação.

## Responsividade

O layout possui ajustes para telas menores e maiores, com pontos de quebra em 820 px e 540 px. O exemplo visual de código permite quebra de linha, evitando uma barra de rolagem horizontal interna. A página também não impõe uma largura mínima fixa ao `body`.

Antes da entrega, confirme no navegador que não existe rolagem horizontal na página em larguras de 320 px, 375 px, 768 px e em desktop.

## Como executar localmente

O projeto usa `fetch('./perguntas.json')`. Por isso, não abra `index.html` diretamente com dois cliques (`file://`), pois o navegador pode bloquear a leitura do JSON.

### Opção 1 — VS Code + Live Server

1. Abra a pasta `quiz-html-estudos-cp3` no VS Code.
2. Instale a extensão **Live Server**, caso ainda não esteja instalada.
3. Clique com o botão direito em `index.html`.
4. Selecione **Open with Live Server**.

### Opção 2 — Python

Abra o terminal dentro desta pasta e execute:

```bash
python -m http.server 8000
```

Depois, acesse `http://localhost:8000` no navegador.

## Site publicado

[https://quiz-htmltrabalhofinal.netlify.app/](https://quiz-htmltrabalhofinal.netlify.app/)

O endereço acima é o que já constava na documentação da versão anterior. Antes da entrega, abra o link em uma janela anônima e confirme que o deploy está atualizado com esta pasta CP3.

## Como o ranking funciona

O JavaScript consulta a chave `ranking` no `sessionStorage`, converte o conteúdo JSON em uma lista com `JSON.parse` e grava as partidas com:

```js
sessionStorage.setItem("ranking", JSON.stringify(ranking));
```

Cada registro guarda o nome, a pontuação, o total de perguntas e a data da partida. O ranking é ordenado pela porcentagem de acertos e mantém no máximo 10 resultados. Como o armazenamento é de sessão, ele fica disponível enquanto a aba estiver aberta; fechar a sessão encerra esses dados. O botão **Jogar novamente** não limpa o ranking.


A tag deve ser criada **depois** do último commit e do push da versão final. Se o Netlify estiver conectado à `main`, confirme que a publicação terminou e que o site no ar corresponde ao conteúdo marcado pela tag.

## Plano B para a apresentação

Mantenha esta pasta disponível no computador e abra `index.html` pelo Live Server. Assim, o grupo consegue demonstrar o quiz localmente caso a conexão com a internet falhe.
