import type { DogImage } from './types.js';
import { API_KEY, API_BASE_URL } from './config.js';

/**
 * Busca imagens de cachorro na The Dog API.
 *
 * Realiza uma chamada HTTP GET para o endpoint `/v1/images/search`,
 * especificando a quantidade desejada de imagens via parâmetro `limit`.
 * A API retorna imagens aleatórias a cada chamada.
 *
 * @param count - Quantidade de imagens a serem buscadas (1 a 100).
 * @returns Promise contendo um array de objetos DogImage.
 * @throws Error se a chave de API estiver ausente, se a resposta não for ok
 *         ou se ocorrer um erro de rede/API.
 */
export async function fetchDogImages(count: number): Promise<DogImage[]> {
  // Verifica se a API key foi configurada
  if (!API_KEY) {
    throw new Error(
      'API Key não configurada. Crie um arquivo .env na raiz do projeto com VITE_API_KEY=sua_chave obtida em https://thedogapi.com/.'
    );
  }

  const url: string = API_BASE_URL + '/images/search?limit=' + count + '&size=med';

  try {
    const response: Response = await fetch(url, {
      headers: {
        'x-api-key': API_KEY,
      },
    });

    // Se a resposta não for OK, lança erro com a mensagem da API
    if (!response.ok) {
      const errorText: string = await response.text();
      let message: string;

      if (response.status === 401) {
        message = 'API Key inválida. Verifique a variável VITE_API_KEY no seu arquivo .env.';
      } else if (response.status === 429) {
        message = 'Limite de requisições excedido. Tente novamente mais tarde.';
      } else {
        message = 'Erro na API (HTTP ' + response.status + '): ' + errorText;
      }

      throw new Error(message);
    }

    // Converte a resposta JSON para o tipo DogImage[]
    const images: DogImage[] = await response.json() as DogImage[];
    return images;
  } catch (error: unknown) {
    // Se o erro já foi lançado por nós (erro de API), reencaminha
    if (error instanceof Error) {
      throw error;
    }
    // Erro de rede ou outro erro inesperado
    throw new Error('Falha de conexão. Verifique sua rede e tente novamente.');
  }
}
