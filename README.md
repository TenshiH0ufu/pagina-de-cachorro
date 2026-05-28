# Galeria de Cachorros

Galeria interativa de fotos de cachorros usando a [The Dog API](https://thedogapi.com/).

## Funcionalidades

- Busca por quantidade de fotos (1 a 100)
- Paginação automática para mais de 10 imagens
- Modal para visualização ampliada
- Validação de entrada
- Loading spinner durante o carregamento

## Tecnologias

- **Vite** — bundler e dev server
- **TypeScript** — tipagem estática
- **The Dog API** — imagens de cachorro

## Como usar

```bash
# Instalar dependências
npm install

# Configurar chave de API
# Crie um arquivo .env na raiz com:
# VITE_API_KEY=sua_chave_aqui
# Obtenha uma chave gratuita em: https://thedogapi.com/

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Pré-visualiza o build |
| `npm run typecheck` | Verifica tipos com TypeScript |
