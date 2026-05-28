/**
 * Referência ao handler de clique ativo no overlay do modal de imagem.
 * Armazenada para permitir remoção correta ao fechar/reabrir o modal.
 */
let modalClickHandler: ((event: MouseEvent) => void) | null = null;

/**
 * Abre o modal de imagem ampliada, exibindo a URL fornecida.
 *
 * O modal é exibido como um overlay sobre a página. Um listener de
 * clique no próprio overlay (fora da imagem) fecha o modal.
 * O listener é limpo ao fechar e antes de recriar, evitando acúmulo
 * e garantindo que o clique fora sempre funcione.
 *
 * @param imageUrl - URL da imagem a ser exibida em tamanho maior.
 */
export function openImageModal(imageUrl: string): void {
  const overlay: HTMLElement | null = document.getElementById('modalOverlay');
  const modalImage: HTMLImageElement | null = document.getElementById('modalImage') as HTMLImageElement | null;

  if (!overlay || !modalImage) {
    return;
  }

  // Define a URL da imagem no elemento <img> do modal
  modalImage.src = imageUrl;
  modalImage.alt = 'Foto de cachorro ampliada';

  // Remove o handler anterior (evita acúmulo de listeners)
  if (modalClickHandler) {
    overlay.removeEventListener('click', modalClickHandler);
  }

  // Cria um novo handler que fecha o modal ao clicar fora da imagem
  modalClickHandler = function (event: MouseEvent): void {
    if (event.target === overlay) {
      closeModal();
    }
  };

  overlay.addEventListener('click', modalClickHandler);

  // Torna o modal visível
  overlay.classList.add('active');
}

/**
 * Abre o modal de erro, exibindo uma mensagem de validação ou erro da API.
 *
 * Diferente do modal de imagem, este modal contém texto descritivo e um
 * botão "Fechar" para dispensá-lo.
 *
 * @param message - Texto descritivo do erro a ser exibido.
 */
export function openErrorModal(message: string): void {
  const errorOverlay: HTMLElement | null = document.getElementById('errorOverlay');
  const errorText: HTMLElement | null = document.getElementById('errorText');

  if (!errorOverlay || !errorText) {
    return;
  }

  // Define o texto de erro no parágrafo do modal
  errorText.textContent = message;

  // Torna o modal visível
  errorOverlay.classList.add('active');
}

/**
 * Fecha o modal de imagem ampliada e remove o listener de clique.
 */
export function closeModal(): void {
  const overlay: HTMLElement | null = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.classList.remove('active');

    // Remove o listener de clique no overlay
    if (modalClickHandler) {
      overlay.removeEventListener('click', modalClickHandler);
      modalClickHandler = null;
    }
  }
}

/**
 * Fecha o modal de erro.
 */
export function closeErrorModal(): void {
  const errorOverlay: HTMLElement | null = document.getElementById('errorOverlay');
  if (errorOverlay) {
    errorOverlay.classList.remove('active');
  }
}
