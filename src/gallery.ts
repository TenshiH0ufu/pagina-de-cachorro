import type { DogImage, GalleryState } from './types.js';
import { IMAGES_PER_PAGE } from './config.js';
import { openImageModal } from './modal.js';

/**
 * Estado global da galeria, mantido em memória durante a execução.
 * Inicializado com valores padrão (galeria vazia).
 */
export const galleryState: GalleryState = {
  images: [],
  currentPage: 0,
  totalPages: 0,
  itemsPerPage: IMAGES_PER_PAGE,
};

/**
 * Obtém as imagens da página atual com base no estado da galeria.
 *
 * @returns Array de DogImage correspondente à página atual.
 */
function getCurrentPageImages(): DogImage[] {
  const start: number = galleryState.currentPage * galleryState.itemsPerPage;
  const end: number = start + galleryState.itemsPerPage;
  return galleryState.images.slice(start, end);
}

/**
 * Renderiza o grid de imagens da página atual no container da galeria.
 *
 * Cria elementos HTML (`<img>`) para cada imagem da página corrente.
 * Cada imagem recebe um listener de clique que abre o modal ampliado.
 */
function renderImageGrid(): void {
  const gridContainer: HTMLElement | null = document.getElementById('galleryGrid');
  if (!gridContainer) {
    return;
  }

  // Limpa o conteúdo anterior do grid
  gridContainer.innerHTML = '';

  const pageImages: DogImage[] = getCurrentPageImages();

  // Cria e insere cada imagem da página atual
  for (let i: number = 0; i < pageImages.length; i++) {
    const image: DogImage = pageImages[i];

    // Elemento container do card
    const card: HTMLDivElement = document.createElement('div');
    card.className = 'gallery-card';

    // Elemento <img> com a foto do cachorro
    const imgElement: HTMLImageElement = document.createElement('img');
    imgElement.src = image.url;
    imgElement.alt = 'Foto de cachorro';
    imgElement.loading = 'lazy'; // Lazy loading para performance

    // Ao clicar na imagem, abre o modal ampliado
    imgElement.addEventListener('click', function (): void {
      openImageModal(image.url);
    });

    card.appendChild(imgElement);
    gridContainer.appendChild(card);
  }
}

/**
 * Renderiza os controles de paginação abaixo do grid.
 *
 * Exibe um indicador textual "Página X de Y" e botões Anterior/Próximo.
 * Os botões são desabilitados quando não há página anterior/próxima.
 */
function renderPagination(): void {
  const paginationContainer: HTMLElement | null = document.getElementById('pagination');
  if (!paginationContainer) {
    return;
  }

  // Se há no máximo uma página, oculta a paginação completamente
  if (galleryState.totalPages <= 1) {
    paginationContainer.innerHTML = '';
    paginationContainer.classList.remove('active');
    return;
  }

  paginationContainer.classList.add('active');

  // Página exibida como base 1 (primeira página = 1, não 0)
  const pageDisplay: number = galleryState.currentPage + 1;

  // Limpa o conteúdo anterior do container
  paginationContainer.innerHTML = '';

  // Botão Anterior
  const prevBtn: HTMLButtonElement = document.createElement('button');
  prevBtn.id = 'prevPageBtn';
  prevBtn.className = 'pagination-btn';
  prevBtn.innerHTML = '&larr; Anterior';
  if (galleryState.currentPage === 0) prevBtn.disabled = true;
  prevBtn.addEventListener('click', function (): void {
    goToPage(galleryState.currentPage - 1);
  });

  // Indicador de página
  const pageInfo: HTMLSpanElement = document.createElement('span');
  pageInfo.className = 'page-info';
  pageInfo.textContent = 'Página ' + pageDisplay + ' de ' + galleryState.totalPages;

  // Botão Próximo
  const nextBtn: HTMLButtonElement = document.createElement('button');
  nextBtn.id = 'nextPageBtn';
  nextBtn.className = 'pagination-btn';
  nextBtn.innerHTML = 'Próximo &rarr;';
  if (galleryState.currentPage === galleryState.totalPages - 1) nextBtn.disabled = true;
  nextBtn.addEventListener('click', function (): void {
    goToPage(galleryState.currentPage + 1);
  });

  // Monta os elementos no container
  paginationContainer.appendChild(prevBtn);
  paginationContainer.appendChild(pageInfo);
  paginationContainer.appendChild(nextBtn);
}

/**
 * Navega para a página especificada e re-renderiza grid + paginação.
 *
 * @param pageIndex - Índice da página desejada (base 0).
 */
function goToPage(pageIndex: number): void {
  // Verificação de limites de página
  if (pageIndex < 0 || pageIndex >= galleryState.totalPages) {
    return;
  }

  galleryState.currentPage = pageIndex;
  renderImageGrid();
  renderPagination();
}

/**
 * Renderiza a galeria completa — grid de imagens + controles de paginação.
 *
 * Atualiza o estado da galeria com as novas imagens e reseta para a
 * primeira página. Chamado após uma busca bem-sucedida na API.
 *
 * @param images - Array de imagens obtidas da API.
 */
export function renderGallery(images: DogImage[]): void {
  // Atualiza o estado global da galeria
  galleryState.images = images;
  galleryState.currentPage = 0;
  galleryState.totalPages = Math.ceil(images.length / galleryState.itemsPerPage);
  galleryState.itemsPerPage = IMAGES_PER_PAGE;

  // Renderiza o grid e a paginação
  renderImageGrid();
  renderPagination();
}

/**
 * Limpa a galeria, removendo todas as imagens e controles de paginação.
 *
 * Reseta o estado global para os valores iniciais (galeria vazia).
 */
export function clearGallery(): void {
  // Reseta o estado
  galleryState.images = [];
  galleryState.currentPage = 0;
  galleryState.totalPages = 0;

  // Limpa o grid de imagens
  const gridContainer: HTMLElement | null = document.getElementById('galleryGrid');
  if (gridContainer) {
    gridContainer.innerHTML = '';
  }

  // Limpa a paginação
  const paginationContainer: HTMLElement | null = document.getElementById('pagination');
  if (paginationContainer) {
    paginationContainer.innerHTML = '';
    paginationContainer.classList.remove('active');
  }
}
