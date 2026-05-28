import { MAX_IMAGES } from './config.js';

/**
 * Resultado da validação do campo de quantidade de fotos.
 * `valid` indica se o valor atende a todos os critérios.
 * `value` contém o número convertido (somente se válido).
 * `error` contém a mensagem de erro descritiva (somente se inválido).
 */
export interface ValidationResult {
  valid: boolean;
  value: number;
  error: string | null;
}

/**
 * Valida o valor informado pelo usuário no campo de quantidade de fotos.
 *
 * Regras de validação:
 *   - Não pode ser vazio.
 *   - Deve ser um número inteiro (sem casas decimais).
 *   - Deve ser positivo (maior que zero).
 *   - Não pode exceder o limite máximo da API (MAX_IMAGES = 100).
 *
 * @param rawValue - String bruta obtida do campo de input.
 * @returns Um objeto ValidationResult com status, valor convertido e mensagem de erro.
 */
export function validateCount(rawValue: string): ValidationResult {
  const trimmed: string = rawValue.trim();

  // Verifica se o campo está vazio
  if (trimmed === '') {
    return {
      valid: false,
      value: 0,
      error: 'O campo de quantidade está vazio. Informe um número entre 1 e ' + MAX_IMAGES + '.',
    };
  }

  const parsed: number = Number(trimmed);

  // Verifica se o valor é um NaN (ex.: entrada "abc" produz NaN)
  if (isNaN(parsed)) {
    return {
      valid: false,
      value: 0,
      error: 'O valor informado não é um número válido. Informe um número inteiro entre 1 e ' + MAX_IMAGES + '.',
    };
  }

  // Verifica se o número é inteiro (ex.: 10.5 é rejeitado)
  if (!Number.isInteger(parsed)) {
    return {
      valid: false,
      value: 0,
      error: 'A quantidade deve ser um número inteiro. Informe um valor entre 1 e ' + MAX_IMAGES + '.',
    };
  }

  // Verifica se o número é positivo (maior que zero)
  if (parsed <= 0) {
    return {
      valid: false,
      value: 0,
      error: 'A quantidade deve ser um número positivo. Informe um valor entre 1 e ' + MAX_IMAGES + '.',
    };
  }

  // Verifica se o número excede o limite máximo da API
  if (parsed > MAX_IMAGES) {
    return {
      valid: false,
      value: 0,
      error: 'A quantidade máxima permitida é ' + MAX_IMAGES + '. Informe um valor entre 1 e ' + MAX_IMAGES + '.',
    };
  }

  // Todas as validações passaram — o valor é válido
  return {
    valid: true,
    value: parsed,
    error: null,
  };
}
