import type { DogImage } from './types.js';
import { fetchDogImages } from './api.js';
import { validateCount, type ValidationResult } from './validation.js';
import { renderGallery, clearGallery } from './gallery.js';
import { openErrorModal, closeErrorModal } from './modal.js';

/**
 * Exibe ou oculta o indicador de carregamento (spinner) e desabilita/habilita
 * o botão de busca para evitar múltiplas requisições simultâneas.
 *
 * @param active - Se true, mostra o spinner e desabilita o botão de busca.
 */
function setLoading(active: boolean): void {
  const loadingOverlay: HTMLElement | null = document.getElementById('loadingOverlay');
  const searchBtn: HTMLButtonElement | null = document.getElementById('searchBtn') as HTMLButtonElement | null;
  const countInput: HTMLInputElement | null = document.getElementById('countInput') as HTMLInputElement | null;

  if (loadingOverlay) {
    if (active) {
      loadingOverlay.classList.add('active');
    } else {
      loadingOverlay.classList.remove('active');
    }
  }

  if (searchBtn) {
    searchBtn.disabled = active;
  }

  if (countInput) {
    countInput.disabled = active;
  }
}

/**
 * Manipulador do evento de clique no botão "Buscar".
 *
 * Fluxo:
 *   1. Obtém o valor do campo de input.
 *   2. Valida o valor usando validateCount().
 *   3. Se inválido, abre o modal de erro com a mensagem apropriada.
 *   4. Se válido, ativa o loading, busca as imagens na API,
 *      renderiza a galeria e desativa o loading.
 */
async function handleSearch(): Promise<void> {
  const countInput: HTMLInputElement | null = document.getElementById('countInput') as HTMLInputElement | null;

  if (!countInput) {
    return;
  }

  const rawValue: string = countInput.value;

  // Valida o valor informado pelo usuário
  const validation: ValidationResult = validateCount(rawValue);

  // Se a validação falhar, exibe o modal de erro
  if (!validation.valid) {
    openErrorModal(validation.error!);
    return;
  }

  // Ativa o indicador de carregamento
  setLoading(true);

  try {
    // Busca as imagens na API
    const images: DogImage[] = await fetchDogImages(validation.value);

    // Renderiza a galeria com as imagens obtidas
    renderGallery(images);
  } catch (error: unknown) {
    // Exibe o erro em formato de modal
    const message: string = error instanceof Error ? error.message : 'Erro desconhecido ao buscar imagens.';
    openErrorModal(message);
  } finally {
    // Desativa o indicador de carregamento (sempre executado)
    setLoading(false);
  }
}

/**
 * Manipulador do evento de clique no botão "Limpar".
 * Esvazia a galeria e restaura o estado inicial.
 */
function handleClear(): void {
  // Limpa o campo de input
  const countInput: HTMLInputElement | null = document.getElementById('countInput') as HTMLInputElement | null;
  if (countInput) {
    countInput.value = '';
  }

  // Limpa a galeria (grid + paginação)
  clearGallery();
}

/**
 * Manipulador de tecla pressionada no campo de input.
 * Permite acionar a busca pressionando a tecla Enter.
 *
 * @param event - Evento de teclado disparado pelo navegador.
 */
function handleInputKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    handleSearch();
  }
}

/**
 * Inicializa a aplicação após o carregamento completo do DOM.
 *
 * Vincula os listeners de eventos aos elementos da interface:
 *   - Botão "Buscar" → dispara a busca de imagens.
 *   - Botão "Limpar" → limpa a galeria.
 *   - Campo de input → permite busca ao pressionar Enter.
 *   - Botão de fechar do modal de erro → fecha o modal de erro.
 */
function initializeApp(): void {
  // Referências aos elementos do DOM
  const searchBtn: HTMLButtonElement | null = document.getElementById('searchBtn') as HTMLButtonElement | null;
  const clearBtn: HTMLButtonElement | null = document.getElementById('clearBtn') as HTMLButtonElement | null;
  const countInput: HTMLInputElement | null = document.getElementById('countInput') as HTMLInputElement | null;
  const closeErrorBtn: HTMLButtonElement | null = document.getElementById('closeErrorBtn') as HTMLButtonElement | null;
  const errorOverlay: HTMLElement | null = document.getElementById('errorOverlay');

  // Vincula evento de clique no botão "Buscar"
  if (searchBtn) {
    searchBtn.addEventListener('click', handleSearch);
  }

  // Vincula evento de clique no botão "Limpar"
  if (clearBtn) {
    clearBtn.addEventListener('click', handleClear);
  }

  // Permite busca ao pressionar Enter no campo de input
  if (countInput) {
    countInput.addEventListener('keydown', handleInputKeydown);
  }

  // Botão "Fechar" do modal de erro
  if (closeErrorBtn) {
    closeErrorBtn.addEventListener('click', closeErrorModal);
  }

  // Fecha o modal de erro ao clicar fora da caixa de diálogo
  if (errorOverlay) {
    errorOverlay.addEventListener('click', function (event: MouseEvent): void {
      if (event.target === errorOverlay) {
        closeErrorModal();
      }
    });
  }
}

// Aguarda o carregamento completo do DOM antes de inicializar a aplicação
document.addEventListener('DOMContentLoaded', initializeApp);
