// Reglas básicas de detección de problemas de UX
import { FigmaNode } from '../types';
import { 
  BasicRule, 
  RuleFactory, 
  DetectionResult, 
  RuleContext,
  Evidence 
} from './rule-structure';

/**
 * Regla: Contraste de color insuficiente
 */
export const contrastRule: BasicRule = RuleFactory.createBasicRule(
  'accessibility-contrast-insufficient',
  'Contraste de color insuficiente',
  'El contraste entre el texto y el fondo no cumple con los estándares WCAG 2.1 AA',
  'accessibility',
  'high',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    // Solo aplicar a elementos de texto
    if (element.type !== 'TEXT' || !element.fills || element.fills.length === 0) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    // Simular cálculo de contraste (en implementación real, calcular contraste real)
    const textFill = element.fills[0] as any;
    if (textFill.type === 'SOLID') {
      const { r, g, b } = textFill.color;
      
      // Detectar texto gris claro (simulación)
      const isLightGray = r > 0.6 && g > 0.6 && b > 0.6;
      
      if (isLightGray) {
        const evidence: Evidence[] = [{
          type: 'measurement',
          description: 'Texto con color gris claro detectado',
          value: { r, g, b },
          expected: 'Color con mayor contraste',
          severity: 'high'
        }];

        return {
          detected: true,
          confidence: 0.8,
          evidence,
          suggestions: [
            'Usar un color más oscuro para el texto',
            'Verificar el contraste con herramientas como WebAIM',
            'Asegurar un ratio mínimo de 4.5:1 para texto normal'
          ]
        };
      }
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Tamaño de fuente muy pequeño
 */
export const fontSizeRule: BasicRule = RuleFactory.createBasicRule(
  'accessibility-font-size-small',
  'Tamaño de fuente muy pequeño',
  'El texto es demasiado pequeño para ser legible cómodamente',
  'accessibility',
  'medium',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (element.type !== 'TEXT' || !element.fontSize) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    const minFontSize = 16; // Tamaño mínimo recomendado
    const fontSize = element.fontSize;

    if (fontSize < minFontSize) {
      const evidence: Evidence[] = [{
        type: 'measurement',
        description: `Tamaño de fuente: ${fontSize}px`,
        value: fontSize,
        expected: minFontSize,
        severity: fontSize < 12 ? 'high' : 'medium'
      }];

      return {
        detected: true,
        confidence: (minFontSize - fontSize) / minFontSize,
        evidence,
        suggestions: [
          `Aumentar el tamaño de fuente a al menos ${minFontSize}px`,
          'Considerar la legibilidad en dispositivos móviles',
          'Verificar que el texto sea accesible para usuarios con problemas de visión'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Objetivo táctil muy pequeño
 */
export const touchTargetRule: BasicRule = RuleFactory.createBasicRule(
  'accessibility-touch-target-small',
  'Objetivo táctil muy pequeño',
  'Los elementos interactivos deben tener al menos 44x44px para ser accesibles',
  'accessibility',
  'high',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    // Detectar si es un elemento interactivo
    const isInteractive = isInteractiveElement(element);
    
    if (!isInteractive || !element.width || !element.height) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    const minSize = 44; // Tamaño mínimo recomendado
    const width = element.width;
    const height = element.height;
    const minDimension = Math.min(width, height);

    if (width < minSize || height < minSize) {
      const evidence: Evidence[] = [{
        type: 'measurement',
        description: `Tamaño actual: ${width}x${height}px`,
        value: { width, height },
        expected: { width: minSize, height: minSize },
        severity: minDimension < 32 ? 'high' : 'medium'
      }];

      return {
        detected: true,
        confidence: (minSize - minDimension) / minSize,
        evidence,
        suggestions: [
          `Aumentar el tamaño a al menos ${minSize}x${minSize}px`,
          'Agregar padding para aumentar el área táctil',
          'Verificar usabilidad en dispositivos móviles'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Elementos superpuestos
 */
export const overlappingRule: BasicRule = RuleFactory.createBasicRule(
  'layout-elements-overlapping',
  'Elementos superpuestos',
  'Los elementos se superponen de manera no intencional, causando confusión',
  'layout',
  'medium',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (!element.x || !element.y || !element.width || !element.height) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    // Buscar elementos superpuestos
    const overlappingElements = context.siblingElements.filter(sibling => {
      if (!sibling.x || !sibling.y || !sibling.width || !sibling.height) return false;
      
      // Verificar superposición usando algoritmo de intersección de rectángulos
      return !(element.x! + element.width! <= sibling.x ||
               sibling.x + sibling.width <= element.x! ||
               element.y! + element.height! <= sibling.y ||
               sibling.y + sibling.height <= element.y!);
    });

    if (overlappingElements.length > 0) {
      const evidence: Evidence[] = [{
        type: 'violation',
        description: `Se superpone con ${overlappingElements.length} elemento(s)`,
        value: overlappingElements.map(el => ({ id: el.id, name: el.name })),
        severity: overlappingElements.length > 2 ? 'high' : 'medium'
      }];

      return {
        detected: true,
        confidence: Math.min(1, overlappingElements.length / 2),
        evidence,
        suggestions: [
          'Reposicionar elementos para evitar superposición',
          'Usar Auto Layout si está disponible',
          'Verificar si la superposición es intencional'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Espaciado de línea inadecuado
 */
export const lineHeightRule: BasicRule = RuleFactory.createBasicRule(
  'readability-line-height-poor',
  'Espaciado de línea inadecuado',
  'El espaciado entre líneas es muy pequeño o muy grande, afectando la legibilidad',
  'readability',
  'medium',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (element.type !== 'TEXT' || !element.lineHeight || !element.fontSize) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    const lineHeight = typeof element.lineHeight === 'object' ? element.lineHeight.value : element.lineHeight;
    const fontSize = element.fontSize;
    
    // Calcular ratio de line-height
    const ratio = lineHeight / fontSize;
    const minRatio = 1.2;
    const maxRatio = 2.0;
    const idealRatio = 1.5;

    if (ratio < minRatio || ratio > maxRatio) {
      const evidence: Evidence[] = [{
        type: 'measurement',
        description: `Ratio de line-height: ${ratio.toFixed(2)}`,
        value: ratio,
        expected: idealRatio,
        severity: ratio < 1.1 || ratio > 2.5 ? 'high' : 'medium'
      }];

      return {
        detected: true,
        confidence: Math.abs(ratio - idealRatio) / idealRatio,
        evidence,
        suggestions: [
          ratio < minRatio ? 'Aumentar espaciado de línea para mejorar legibilidad' : 'Reducir espaciado de línea excesivo',
          `Usar un ratio de ${idealRatio} como punto de partida`,
          'Considerar la longitud de línea al ajustar el espaciado'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Función auxiliar para detectar elementos interactivos
 */
function isInteractiveElement(element: FigmaNode): boolean {
  const interactiveNames = ['button', 'btn', 'link', 'clickable', 'tab', 'menu'];
  const interactiveTypes = ['INSTANCE', 'COMPONENT'];
  
  return interactiveTypes.includes(element.type) ||
         interactiveNames.some(name => element.name.toLowerCase().includes(name));
}

/**
 * Regla: Inconsistencia en estilos de botones
 */
export const buttonConsistencyRule: BasicRule = RuleFactory.createBasicRule(
  'consistency-button-styles-mixed',
  'Estilos de botones inconsistentes',
  'Los botones tienen estilos diferentes sin una jerarquía clara',
  'consistency',
  'medium',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (!isButtonElement(element)) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    // Buscar otros botones en el contexto
    const otherButtons = context.allElements.filter(el => 
      el.id !== element.id && isButtonElement(el)
    );

    if (otherButtons.length === 0) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    // Analizar inconsistencias en propiedades
    const inconsistencies = analyzeButtonInconsistencies(element, otherButtons);

    if (inconsistencies.length > 0) {
      const evidence: Evidence[] = [{
        type: 'pattern',
        description: `Inconsistencias detectadas: ${inconsistencies.join(', ')}`,
        value: inconsistencies,
        severity: inconsistencies.length > 2 ? 'high' : 'medium'
      }];

      return {
        detected: true,
        confidence: Math.min(1, inconsistencies.length / 3),
        evidence,
        suggestions: [
          'Crear un sistema de botones consistente',
          'Definir jerarquía clara (primario, secundario, terciario)',
          'Usar componentes reutilizables para mantener consistencia'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Jerarquía visual confusa
 */
export const visualHierarchyRule: BasicRule = RuleFactory.createBasicRule(
  'navigation-hierarchy-unclear',
  'Jerarquía visual confusa',
  'Los elementos no siguen una jerarquía visual clara, dificultando la navegación',
  'navigation',
  'high',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (element.type !== 'TEXT') {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    // Analizar jerarquía de textos
    const textElements = context.allElements.filter(el => el.type === 'TEXT');
    const hierarchyIssues = analyzeTextHierarchy(element, textElements);

    if (hierarchyIssues.length > 0) {
      const evidence: Evidence[] = [{
        type: 'pattern',
        description: `Problemas de jerarquía: ${hierarchyIssues.join(', ')}`,
        value: hierarchyIssues,
        severity: hierarchyIssues.length > 1 ? 'high' : 'medium'
      }];

      return {
        detected: true,
        confidence: Math.min(1, hierarchyIssues.length / 2),
        evidence,
        suggestions: [
          'Establecer una escala tipográfica clara',
          'Usar tamaños de fuente progresivos (ej: 32px, 24px, 18px, 16px)',
          'Aplicar pesos de fuente consistentes para cada nivel'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Falta de estados de interacción
 */
export const interactionStatesRule: BasicRule = RuleFactory.createBasicRule(
  'feedback-interaction-states-missing',
  'Estados de interacción faltantes',
  'Los elementos interactivos no muestran estados claros (hover, active, disabled)',
  'feedback',
  'medium',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (!isInteractiveElement(element)) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    // Buscar variantes o estados del elemento
    const hasStates = hasInteractionStates(element, context);

    if (!hasStates) {
      const evidence: Evidence[] = [{
        type: 'violation',
        description: 'No se encontraron estados de interacción',
        value: 'missing_states',
        severity: 'medium'
      }];

      return {
        detected: true,
        confidence: 0.7,
        evidence,
        suggestions: [
          'Crear estados hover, active y disabled',
          'Usar variantes de componentes para diferentes estados',
          'Proporcionar feedback visual claro para interacciones'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Elementos redundantes
 */
export const redundantElementsRule: BasicRule = RuleFactory.createBasicRule(
  'efficiency-redundant-elements',
  'Elementos redundantes',
  'Hay elementos duplicados o redundantes que complican la interfaz',
  'efficiency',
  'low',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    // Buscar elementos similares o duplicados
    const similarElements = findSimilarElements(element, context.allElements);

    if (similarElements.length > 2) { // Más de 2 elementos similares
      const evidence: Evidence[] = [{
        type: 'pattern',
        description: `${similarElements.length} elementos similares encontrados`,
        value: similarElements.map(el => ({ id: el.id, name: el.name })),
        severity: similarElements.length > 4 ? 'medium' : 'low'
      }];

      return {
        detected: true,
        confidence: Math.min(1, (similarElements.length - 2) / 3),
        evidence,
        suggestions: [
          'Considerar consolidar elementos similares',
          'Crear componentes reutilizables',
          'Simplificar la interfaz eliminando redundancias'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Colores no estandarizados
 */
export const colorConsistencyRule: BasicRule = RuleFactory.createBasicRule(
  'consistency-colors-non-standard',
  'Colores no estandarizados',
  'Se usan demasiados colores diferentes sin un sistema de color definido',
  'consistency',
  'medium',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (!element.fills || element.fills.length === 0) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    // Analizar paleta de colores en el contexto
    const colorAnalysis = analyzeColorPalette(element, context.allElements);

    if (colorAnalysis.tooManyColors) {
      const evidence: Evidence[] = [{
        type: 'pattern',
        description: `${colorAnalysis.uniqueColors} colores únicos detectados`,
        value: colorAnalysis.uniqueColors,
        expected: 'Máximo 8-12 colores en la paleta',
        severity: colorAnalysis.uniqueColors > 20 ? 'high' : 'medium'
      }];

      return {
        detected: true,
        confidence: Math.min(1, (colorAnalysis.uniqueColors - 12) / 12),
        evidence,
        suggestions: [
          'Definir una paleta de colores limitada',
          'Usar variables de color o design tokens',
          'Consolidar colores similares'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Etiquetas poco descriptivas
 */
export const descriptiveLabelsRule: BasicRule = RuleFactory.createBasicRule(
  'navigation-labels-unclear',
  'Etiquetas poco descriptivas',
  'Los elementos tienen nombres o etiquetas que no describen claramente su función',
  'navigation',
  'medium',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (!isInteractiveElement(element) && element.type !== 'TEXT') {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    const isUnclear = hasUnclearLabel(element);

    if (isUnclear) {
      const evidence: Evidence[] = [{
        type: 'violation',
        description: 'Etiqueta poco descriptiva detectada',
        value: element.name || element.characters || 'Sin texto',
        severity: 'medium'
      }];

      return {
        detected: true,
        confidence: 0.6,
        evidence,
        suggestions: [
          'Usar etiquetas descriptivas y específicas',
          'Evitar términos genéricos como "Botón" o "Texto"',
          'Describir la acción que realizará el usuario'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Falta de feedback de carga
 */
export const loadingFeedbackRule: BasicRule = RuleFactory.createBasicRule(
  'feedback-loading-missing',
  'Falta de indicadores de carga',
  'No hay indicadores visuales para procesos que requieren tiempo de espera',
  'feedback',
  'low',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    // Buscar formularios o botones de envío sin indicadores de carga
    if (isSubmitButton(element)) {
      const hasLoadingIndicator = hasLoadingState(element, context);

      if (!hasLoadingIndicator) {
        const evidence: Evidence[] = [{
          type: 'violation',
          description: 'Botón de envío sin indicador de carga',
          value: 'missing_loading_state',
          severity: 'low'
        }];

        return {
          detected: true,
          confidence: 0.5,
          evidence,
          suggestions: [
            'Agregar spinner o indicador de carga',
            'Deshabilitar botón durante el proceso',
            'Mostrar progreso cuando sea posible'
          ]
        };
      }
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Longitud de línea excesiva
 */
export const lineLengthRule: BasicRule = RuleFactory.createBasicRule(
  'readability-line-length-excessive',
  'Longitud de línea excesiva',
  'Las líneas de texto son demasiado largas, dificultando la lectura',
  'readability',
  'medium',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (element.type !== 'TEXT' || !element.width || !element.fontSize) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    // Calcular caracteres aproximados por línea
    const avgCharWidth = element.fontSize * 0.6; // Aproximación
    const charsPerLine = element.width / avgCharWidth;
    const maxCharsPerLine = 75; // Máximo recomendado

    if (charsPerLine > maxCharsPerLine) {
      const evidence: Evidence[] = [{
        type: 'measurement',
        description: `Aproximadamente ${Math.round(charsPerLine)} caracteres por línea`,
        value: charsPerLine,
        expected: maxCharsPerLine,
        severity: charsPerLine > 100 ? 'high' : 'medium'
      }];

      return {
        detected: true,
        confidence: (charsPerLine - maxCharsPerLine) / maxCharsPerLine,
        evidence,
        suggestions: [
          'Reducir el ancho del contenedor de texto',
          'Usar columnas múltiples para textos largos',
          'Mantener entre 45-75 caracteres por línea'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

// Funciones auxiliares

function isButtonElement(element: FigmaNode): boolean {
  const buttonKeywords = ['button', 'btn', 'cta', 'submit', 'action'];
  return buttonKeywords.some(keyword => 
    element.name.toLowerCase().includes(keyword)
  ) || element.type === 'COMPONENT' || element.type === 'INSTANCE';
}

function analyzeButtonInconsistencies(element: FigmaNode, otherButtons: FigmaNode[]): string[] {
  const inconsistencies: string[] = [];
  
  // Analizar tamaños
  const sizes = otherButtons.map(btn => ({ width: btn.width, height: btn.height }));
  const uniqueSizes = new Set(sizes.map(s => `${s.width}x${s.height}`));
  if (uniqueSizes.size > 3) {
    inconsistencies.push('tamaños variados');
  }

  // Analizar colores (simplificado)
  const colors = otherButtons.filter(btn => btn.fills && btn.fills.length > 0);
  if (colors.length > 0 && colors.length !== otherButtons.length) {
    inconsistencies.push('colores inconsistentes');
  }

  return inconsistencies;
}

function analyzeTextHierarchy(element: FigmaNode, textElements: FigmaNode[]): string[] {
  const issues: string[] = [];
  
  if (!element.fontSize) return issues;

  const fontSizes = textElements
    .filter(el => el.fontSize)
    .map(el => el.fontSize!)
    .sort((a, b) => b - a);

  const uniqueSizes = [...new Set(fontSizes)];
  
  // Demasiados tamaños diferentes
  if (uniqueSizes.length > 6) {
    issues.push('demasiados tamaños de fuente');
  }

  // Saltos muy pequeños entre tamaños
  for (let i = 0; i < uniqueSizes.length - 1; i++) {
    if (uniqueSizes[i] - uniqueSizes[i + 1] < 2) {
      issues.push('diferencias mínimas entre tamaños');
      break;
    }
  }

  return issues;
}

function hasInteractionStates(element: FigmaNode, context: RuleContext): boolean {
  // Buscar elementos con nombres que sugieran estados
  const stateKeywords = ['hover', 'active', 'disabled', 'pressed', 'focus'];
  return context.allElements.some(el => 
    stateKeywords.some(keyword => el.name.toLowerCase().includes(keyword))
  );
}

function findSimilarElements(element: FigmaNode, allElements: FigmaNode[]): FigmaNode[] {
  return allElements.filter(el => {
    if (el.id === element.id) return false;
    
    // Comparar por tipo y tamaño similar
    const sameType = el.type === element.type;
    const similarSize = element.width && element.height && el.width && el.height &&
      Math.abs(el.width - element.width) < 10 &&
      Math.abs(el.height - element.height) < 10;
    
    return sameType && similarSize;
  });
}

function analyzeColorPalette(element: FigmaNode, allElements: FigmaNode[]): { tooManyColors: boolean; uniqueColors: number } {
  const colors = new Set<string>();
  
  allElements.forEach(el => {
    if (el.fills && el.fills.length > 0) {
      el.fills.forEach((fill: any) => {
        if (fill.type === 'SOLID' && fill.color) {
          const { r, g, b } = fill.color;
          colors.add(`${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)}`);
        }
      });
    }
  });

  return {
    tooManyColors: colors.size > 12,
    uniqueColors: colors.size
  };
}

function hasUnclearLabel(element: FigmaNode): boolean {
  const unclearTerms = ['button', 'text', 'element', 'item', 'thing', 'click here', 'read more'];
  const label = (element.name || element.characters || '').toLowerCase();
  
  return unclearTerms.some(term => label.includes(term)) || 
         label.length < 3 || 
         /^(btn|txt|el)\d*$/.test(label);
}

function isSubmitButton(element: FigmaNode): boolean {
  const submitKeywords = ['submit', 'send', 'save', 'create', 'update', 'delete', 'confirm'];
  const label = (element.name || element.characters || '').toLowerCase();
  
  return submitKeywords.some(keyword => label.includes(keyword));
}

function hasLoadingState(element: FigmaNode, context: RuleContext): boolean {
  const loadingKeywords = ['loading', 'spinner', 'progress', 'wait'];
  return context.allElements.some(el => 
    loadingKeywords.some(keyword => el.name.toLowerCase().includes(keyword))
  );
}

/**
 * Regla: Inputs sin labels claros
 */
export const inputLabelRule: BasicRule = RuleFactory.createBasicRule(
  'forms-input-label-missing',
  'Campos de entrada sin etiquetas claras',
  'Los campos de entrada no tienen etiquetas descriptivas o están mal posicionadas',
  'accessibility',
  'high',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (!isInputElement(element)) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    const labelAnalysis = analyzeInputLabel(element, context);

    if (!labelAnalysis.hasLabel || !labelAnalysis.isAppropriate) {
      const evidence: Evidence[] = [{
        type: 'violation',
        description: labelAnalysis.hasLabel ? 'Etiqueta inadecuada' : 'Etiqueta faltante',
        value: labelAnalysis.labelText || 'Sin etiqueta',
        expected: 'Etiqueta descriptiva y bien posicionada',
        severity: 'high'
      }];

      return {
        detected: true,
        confidence: labelAnalysis.hasLabel ? 0.6 : 0.9,
        evidence,
        suggestions: [
          'Agregar etiqueta descriptiva arriba o a la izquierda del campo',
          'Usar placeholder text como complemento, no reemplazo de label',
          'Asegurar asociación semántica entre label e input',
          'Evitar etiquetas genéricas como "Campo" o "Entrada"'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Campos de entrada muy pequeños
 */
export const inputSizeRule: BasicRule = RuleFactory.createBasicRule(
  'forms-input-size-inadequate',
  'Campos de entrada con tamaño inadecuado',
  'Los campos de entrada son muy pequeños o no apropiados para su contenido esperado',
  'accessibility',
  'medium',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (!isInputElement(element)) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    const sizeAnalysis = analyzeInputSize(element);

    if (sizeAnalysis.isTooSmall || sizeAnalysis.isInappropriate) {
      const evidence: Evidence[] = [{
        type: 'measurement',
        description: `Tamaño actual: ${sizeAnalysis.width}x${sizeAnalysis.height}px`,
        value: { width: sizeAnalysis.width, height: sizeAnalysis.height },
        expected: { width: sizeAnalysis.recommendedWidth, height: sizeAnalysis.recommendedHeight },
        severity: sizeAnalysis.isTooSmall ? 'medium' : 'low'
      }];

      return {
        detected: true,
        confidence: sizeAnalysis.confidence,
        evidence,
        suggestions: [
          `Ajustar tamaño mínimo a ${sizeAnalysis.recommendedWidth}x${sizeAnalysis.recommendedHeight}px`,
          'Considerar el contenido esperado (email, teléfono, etc.)',
          'Asegurar área táctil suficiente para dispositivos móviles',
          'Mantener proporción consistente con otros campos del formulario'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Estados de error en formularios
 */
export const formErrorStatesRule: BasicRule = RuleFactory.createBasicRule(
  'forms-error-states-missing',
  'Estados de error faltantes en formularios',
  'Los campos de formulario no tienen estados de error claramente definidos',
  'feedback',
  'high',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (!isFormElement(element)) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    const errorStatesAnalysis = analyzeErrorStates(element, context);

    if (!errorStatesAnalysis.hasErrorState) {
      const evidence: Evidence[] = [{
        type: 'violation',
        description: 'No se encontraron estados de error para el formulario',
        value: 'missing_error_states',
        severity: 'high'
      }];

      return {
        detected: true,
        confidence: 0.8,
        evidence,
        suggestions: [
          'Crear estados visuales para errores de validación',
          'Usar colores, iconos y mensajes claros para errores',
          'Posicionar mensajes de error cerca del campo problemático',
          'Proporcionar indicadores en tiempo real de validación'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Datepickers inaccesibles
 */
export const datepickerAccessibilityRule: BasicRule = RuleFactory.createBasicRule(
  'forms-datepicker-accessibility',
  'Datepickers con problemas de accesibilidad',
  'Los selectores de fecha no siguen mejores prácticas de accesibilidad',
  'accessibility',
  'high',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (!isDatepickerElement(element)) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    const accessibilityIssues = analyzeDatepickerAccessibility(element, context);

    if (accessibilityIssues.length > 0) {
      const evidence: Evidence[] = [{
        type: 'pattern',
        description: `Problemas de accesibilidad: ${accessibilityIssues.join(', ')}`,
        value: accessibilityIssues,
        severity: accessibilityIssues.length > 2 ? 'high' : 'medium'
      }];

      return {
        detected: true,
        confidence: Math.min(1.0, accessibilityIssues.length / 3),
        evidence,
        suggestions: [
          'Proporcionar input de texto alternativo para fechas',
          'Usar formato de fecha claro y consistente (DD/MM/YYYY)',
          'Incluir navegación por teclado en el calendario',
          'Agregar labels y descriptions apropiadas',
          'Considerar formatos locales de fecha'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Dropdowns sin indicadores visuales
 */
export const dropdownIndicatorsRule: BasicRule = RuleFactory.createBasicRule(
  'forms-dropdown-indicators-missing',
  'Dropdowns sin indicadores visuales apropiados',
  'Los menús desplegables no tienen indicadores claros de su funcionalidad',
  'navigation',
  'medium',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (!isDropdownElement(element)) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    const indicatorAnalysis = analyzeDropdownIndicators(element);

    if (!indicatorAnalysis.hasIndicator || !indicatorAnalysis.isAppropriate) {
      const evidence: Evidence[] = [{
        type: 'violation',
        description: indicatorAnalysis.hasIndicator ? 'Indicador inadecuado' : 'Indicador faltante',
        value: indicatorAnalysis.indicatorType || 'Sin indicador',
        expected: 'Icono de flecha descendente claramente visible',
        severity: 'medium'
      }];

      return {
        detected: true,
        confidence: indicatorAnalysis.hasIndicator ? 0.6 : 0.8,
        evidence,
        suggestions: [
          'Agregar icono de flecha descendente (▼) en el lado derecho',
          'Usar indicadores consistentes en todos los dropdowns',
          'Asegurar suficiente contraste del indicador',
          'Considerar estados hover y focus para el indicador'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Campos requeridos sin indicación
 */
export const requiredFieldsRule: BasicRule = RuleFactory.createBasicRule(
  'forms-required-fields-unclear',
  'Campos requeridos sin indicación clara',
  'Los campos obligatorios no están claramente marcados',
  'navigation',
  'medium',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (!isFormFieldElement(element)) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    const requiredAnalysis = analyzeRequiredFieldIndication(element, context);

    if (requiredAnalysis.isRequired && !requiredAnalysis.hasIndication) {
      const evidence: Evidence[] = [{
        type: 'violation',
        description: 'Campo requerido sin indicación visual',
        value: 'missing_required_indicator',
        expected: 'Asterisco (*) o texto "Requerido"',
        severity: 'medium'
      }];

      return {
        detected: true,
        confidence: 0.7,
        evidence,
        suggestions: [
          'Agregar asterisco (*) junto al label del campo',
          'Usar color consistente para campos requeridos',
          'Incluir leyenda explicativa al inicio del formulario',
          'Considerar indicar campos opcionales en lugar de requeridos si son mayoría'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Checkboxes y radio buttons muy pequeños
 */
export const checkboxRadioSizeRule: BasicRule = RuleFactory.createBasicRule(
  'forms-checkbox-radio-size-small',
  'Checkboxes y radio buttons muy pequeños',
  'Los elementos de selección son demasiado pequeños para interacción táctil',
  'accessibility',
  'medium',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (!isCheckboxOrRadioElement(element)) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    const minSize = 20; // Tamaño mínimo recomendado para checkbox/radio
    const minTouchTarget = 44; // Área táctil mínima incluyendo padding

    if (!element.width || !element.height) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    const size = Math.min(element.width, element.height);
    const touchTargetAnalysis = analyzeTouchTargetWithPadding(element, context);

    if (size < minSize || touchTargetAnalysis.effectiveSize < minTouchTarget) {
      const evidence: Evidence[] = [{
        type: 'measurement',
        description: `Tamaño del elemento: ${size}px, Área táctil: ${touchTargetAnalysis.effectiveSize}px`,
        value: { elementSize: size, touchArea: touchTargetAnalysis.effectiveSize },
        expected: { elementSize: minSize, touchArea: minTouchTarget },
        severity: size < 16 ? 'high' : 'medium'
      }];

      return {
        detected: true,
        confidence: (minTouchTarget - touchTargetAnalysis.effectiveSize) / minTouchTarget,
        evidence,
        suggestions: [
          `Aumentar tamaño del elemento a al menos ${minSize}px`,
          `Asegurar área táctil de ${minTouchTarget}px incluyendo padding`,
          'Usar espaciado adecuado entre elementos de selección múltiple',
          'Considerar hacer clickeable toda la fila del checkbox/radio'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

/**
 * Regla: Formularios sin agrupación lógica
 */
export const formGroupingRule: BasicRule = RuleFactory.createBasicRule(
  'forms-logical-grouping-missing',
  'Formularios sin agrupación lógica',
  'Los campos del formulario no están agrupados de manera lógica',
  'navigation',
  'low',
  (element: FigmaNode, context: RuleContext): DetectionResult => {
    if (!isComplexFormElement(element, context)) {
      return { detected: false, confidence: 0, evidence: [], suggestions: [] };
    }

    const groupingAnalysis = analyzeFormGrouping(element, context);

    if (groupingAnalysis.needsGrouping && !groupingAnalysis.hasGrouping) {
      const evidence: Evidence[] = [{
        type: 'pattern',
        description: `${groupingAnalysis.fieldCount} campos sin agrupación clara`,
        value: groupingAnalysis.fieldCount,
        expected: 'Agrupación visual por secciones',
        severity: 'low'
      }];

      return {
        detected: true,
        confidence: 0.5,
        evidence,
        suggestions: [
          'Agrupar campos relacionados visualmente',
          'Usar títulos de sección para grupos de campos',
          'Aplicar espaciado consistente entre grupos',
          'Considerar usar fieldsets o containers visuales'
        ]
      };
    }

    return { detected: false, confidence: 0, evidence: [], suggestions: [] };
  }
);

// Funciones auxiliares para elementos de formulario

function isInputElement(element: FigmaNode): boolean {
  const inputKeywords = ['input', 'field', 'textfield', 'text-field', 'entrada', 'campo'];
  const inputTypes = ['COMPONENT', 'INSTANCE', 'RECTANGLE', 'FRAME'];
  
  const nameMatch = inputKeywords.some(keyword => 
    element.name.toLowerCase().includes(keyword)
  );
  
  // También verificar por características visuales típicas de inputs
  const looksLikeInput = Boolean(element.width && element.height && 
    element.width > element.height * 2 && // Aspecto rectangular horizontal
    element.height >= 32 && element.height <= 60); // Altura típica de input
  
  return nameMatch || (inputTypes.includes(element.type) && looksLikeInput);
}

function isFormElement(element: FigmaNode): boolean {
  const formKeywords = ['form', 'formulario', 'login', 'register', 'signup', 'contact'];
  return formKeywords.some(keyword => 
    element.name.toLowerCase().includes(keyword)
  ) || isInputElement(element);
}

function isDatepickerElement(element: FigmaNode): boolean {
  const datepickerKeywords = ['date', 'calendar', 'datepicker', 'fecha', 'calendario'];
  return datepickerKeywords.some(keyword => 
    element.name.toLowerCase().includes(keyword)
  );
}

function isDropdownElement(element: FigmaNode): boolean {
  const dropdownKeywords = ['dropdown', 'select', 'picker', 'desplegable', 'combo'];
  return dropdownKeywords.some(keyword => 
    element.name.toLowerCase().includes(keyword)
  );
}

function isFormFieldElement(element: FigmaNode): boolean {
  return isInputElement(element) || isDropdownElement(element) || isDatepickerElement(element);
}

function isCheckboxOrRadioElement(element: FigmaNode): boolean {
  const keywords = ['checkbox', 'radio', 'check', 'option', 'selection'];
  const nameMatch = keywords.some(keyword => 
    element.name.toLowerCase().includes(keyword)
  );
  
  // Verificar por características visuales (elementos pequeños y cuadrados/circulares)
  const looksLikeCheckboxRadio = Boolean(element.width && element.height &&
    Math.abs(element.width - element.height) < 5 && // Aproximadamente cuadrado
    element.width >= 12 && element.width <= 32); // Tamaño típico
  
  return nameMatch || looksLikeCheckboxRadio;
}

function isComplexFormElement(element: FigmaNode, context: RuleContext): boolean {
  const formFields = context.allElements.filter(isFormFieldElement);
  return formFields.length >= 5; // Considera complejo si tiene 5+ campos
}

function analyzeInputLabel(element: FigmaNode, context: RuleContext): any {
  // Buscar textos cerca del input que podrían ser labels
  const nearbyTexts = context.siblingElements.filter(el => 
    el.type === 'TEXT' && isNearElement(element, el)
  );
  
  const hasLabel = nearbyTexts.length > 0;
  let labelText = '';
  let isAppropriate = false;
  
  if (hasLabel) {
    const closestLabel = nearbyTexts[0];
    labelText = closestLabel.characters || closestLabel.name;
    
    // Verificar si la etiqueta es apropiada
    const isDescriptive = labelText.length > 2 && 
      !['text', 'label', 'campo'].includes(labelText.toLowerCase());
    const isWellPositioned = isLabelWellPositioned(element, closestLabel);
    
    isAppropriate = isDescriptive && isWellPositioned;
  }
  
  return { hasLabel, labelText, isAppropriate };
}

function analyzeInputSize(element: FigmaNode): any {
  const width = element.width || 0;
  const height = element.height || 0;
  
  const minWidth = 120; // Ancho mínimo para inputs
  const minHeight = 32; // Altura mínima
  const maxHeight = 60; // Altura máxima recomendada
  
  const isTooSmall = width < minWidth || height < minHeight;
  const isInappropriate = height > maxHeight;
  
  let confidence = 0;
  if (isTooSmall) {
    confidence = Math.max((minWidth - width) / minWidth, (minHeight - height) / minHeight);
  } else if (isInappropriate) {
    confidence = (height - maxHeight) / height;
  }
  
  return {
    width,
    height,
    isTooSmall,
    isInappropriate,
    confidence: Math.min(1, confidence),
    recommendedWidth: Math.max(minWidth, width),
    recommendedHeight: Math.max(minHeight, Math.min(maxHeight, height))
  };
}

function analyzeErrorStates(element: FigmaNode, context: RuleContext): any {
  // Buscar elementos que sugieran estados de error
  const errorKeywords = ['error', 'invalid', 'required', 'warning', 'alert'];
  const hasErrorState = context.allElements.some(el => 
    errorKeywords.some(keyword => el.name.toLowerCase().includes(keyword))
  );
  
  return { hasErrorState };
}

function analyzeDatepickerAccessibility(element: FigmaNode, context: RuleContext): string[] {
  const issues: string[] = [];
  
  // Verificar si tiene input de texto alternativo
  const hasTextInput = context.siblingElements.some(el => 
    isInputElement(el) && isNearElement(element, el)
  );
  
  if (!hasTextInput) {
    issues.push('falta_input_texto');
  }
  
  // Verificar navegación por teclado (buscar indicadores)
  const hasKeyboardNav = element.name.toLowerCase().includes('keyboard') ||
    context.allElements.some(el => el.name.toLowerCase().includes('keyboard'));
  
  if (!hasKeyboardNav) {
    issues.push('navegacion_teclado');
  }
  
  // Verificar formato de fecha claro
  const hasDateFormat = context.allElements.some(el => 
    el.type === 'TEXT' && el.characters && 
    /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(el.characters)
  );
  
  if (!hasDateFormat) {
    issues.push('formato_fecha_unclear');
  }
  
  return issues;
}

function analyzeDropdownIndicators(element: FigmaNode): any {
  const name = element.name.toLowerCase();
  
  // Buscar indicadores en el nombre
  const indicatorKeywords = ['arrow', 'chevron', 'down', 'dropdown', 'flecha'];
  const hasIndicator = indicatorKeywords.some(keyword => name.includes(keyword));
  
  // Verificar si es apropiado (por ahora simplificado)
  const isAppropriate = hasIndicator;
  
  let indicatorType = '';
  if (name.includes('arrow')) indicatorType = 'arrow';
  else if (name.includes('chevron')) indicatorType = 'chevron';
  
  return { hasIndicator, isAppropriate, indicatorType };
}

function analyzeRequiredFieldIndication(element: FigmaNode, context: RuleContext): any {
  // Simplificado: asumir que campos con "required" en el nombre son requeridos
  const isRequired = element.name.toLowerCase().includes('required') ||
    element.name.toLowerCase().includes('obligatorio');
  
  // Buscar indicadores de campo requerido cerca del elemento
  const hasIndication = context.siblingElements.some(el => 
    el.type === 'TEXT' && isNearElement(element, el) &&
    (el.characters?.includes('*') || 
     el.name.toLowerCase().includes('required') ||
     el.name.toLowerCase().includes('asterisk'))
  );
  
  return { isRequired, hasIndication };
}

function analyzeTouchTargetWithPadding(element: FigmaNode, context: RuleContext): any {
  const elementSize = Math.min(element.width || 0, element.height || 0);
  
  // Buscar padding del contenedor padre
  let effectiveSize = elementSize;
  
  // Simplificado: asumir padding mínimo si el elemento está en un container
  const hasContainer = context.siblingElements.some(el => 
    el.type === 'FRAME' && isElementInside(element, el)
  );
  
  if (hasContainer) {
    effectiveSize += 16; // Asumir 8px de padding por lado
  }
  
  return { effectiveSize };
}

function analyzeFormGrouping(element: FigmaNode, context: RuleContext): any {
  const formFields = context.allElements.filter(isFormFieldElement);
  const fieldCount = formFields.length;
  
  const needsGrouping = fieldCount >= 5;
  
  // Buscar indicadores de agrupación
  const groupingKeywords = ['group', 'section', 'fieldset', 'grupo', 'seccion'];
  const hasGrouping = context.allElements.some(el => 
    groupingKeywords.some(keyword => el.name.toLowerCase().includes(keyword))
  );
  
  return { needsGrouping, hasGrouping, fieldCount };
}

// Funciones auxiliares para posicionamiento

function isNearElement(element1: FigmaNode, element2: FigmaNode): boolean {
  if (!element1.x || !element1.y || !element2.x || !element2.y) return false;
  
  const distance = Math.sqrt(
    Math.pow(element1.x - element2.x, 2) + 
    Math.pow(element1.y - element2.y, 2)
  );
  
  return distance < 100; // Considerar "cerca" si están a menos de 100px
}

function isLabelWellPositioned(input: FigmaNode, label: FigmaNode): boolean {
  if (!input.x || !input.y || !label.x || !label.y) return false;
  
  // Label arriba del input
  const isAbove = label.y < input.y && Math.abs(label.x - input.x) < 50;
  
  // Label a la izquierda del input
  const isLeft = label.x < input.x && Math.abs(label.y - input.y) < 20;
  
  return isAbove || isLeft;
}

function isElementInside(child: FigmaNode, parent: FigmaNode): boolean {
  if (!child.x || !child.y || !parent.x || !parent.y || 
      !child.width || !child.height || !parent.width || !parent.height) {
    return false;
  }
  
  return child.x >= parent.x && 
         child.y >= parent.y &&
         child.x + child.width <= parent.x + parent.width &&
         child.y + child.height <= parent.y + parent.height;
}

/**
 * Exportar todas las reglas básicas
 */
export const basicRules: BasicRule[] = [
  // Accesibilidad
  contrastRule,
  fontSizeRule,
  touchTargetRule,
  inputLabelRule,
  inputSizeRule,
  datepickerAccessibilityRule,
  checkboxRadioSizeRule,
  
  // Layout
  overlappingRule,
  
  // Legibilidad
  lineHeightRule,
  lineLengthRule,
  
  // Consistencia
  buttonConsistencyRule,
  colorConsistencyRule,
  
  // Navegación
  visualHierarchyRule,
  descriptiveLabelsRule,
  dropdownIndicatorsRule,
  requiredFieldsRule,
  formGroupingRule,
  
  // Retroalimentación
  interactionStatesRule,
  loadingFeedbackRule,
  formErrorStatesRule,
  
  // Eficiencia
  redundantElementsRule
];

export default {
  contrastRule,
  fontSizeRule,
  touchTargetRule,
  overlappingRule,
  lineHeightRule,
  basicRules
};