/**
 * Chave de API para a The Dog API.
 * Configure a variável VITE_API_KEY no arquivo .env na raiz do projeto.
 * Obtenha sua chave gratuita em: https://thedogapi.com/
 */
export const API_KEY: string = import.meta.env.VITE_API_KEY || '';

/** URL base da The Dog API (v1) */
export const API_BASE_URL: string = 'https://api.thedogapi.com/v1';

/**
 * Limite máximo de imagens que podem ser solicitadas por requisição.
 * Definido pela documentação da API (parâmetro `limit` no range [1..100]).
 */
export const MAX_IMAGES: number = 100;

/** Quantidade de imagens exibidas por página na galeria */
export const IMAGES_PER_PAGE: number = 10;
