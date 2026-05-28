/**
 * Representa uma imagem de cachorro retornada pela The Dog API.
 * Estrutura baseada na resposta do endpoint /v1/images/search.
 */
export interface DogImage {
  /** Identificador único da imagem na API */
  id: string;
  /** URL pública da imagem */
  url: string;
  /** Largura da imagem em pixels */
  width: number;
  /** Altura da imagem em pixels */
  height: number;
}

/**
 * Representa o estado atual da galeria, incluindo controle de paginação.
 * Armazenado em memória durante a execução da página.
 */
export interface GalleryState {
  /** Array com todas as imagens carregadas da API */
  images: DogImage[];
  /** Página atualmente visível na galeria (base 0) */
  currentPage: number;
  /** Total de páginas calculado a partir da quantidade de imagens */
  totalPages: number;
  /** Quantidade de imagens exibidas por página (padrão: 10) */
  itemsPerPage: number;
}
