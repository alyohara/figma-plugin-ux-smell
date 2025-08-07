// Estructura base para las reglas de detección de UX
import { FigmaNode, IssueCategory, SeverityLevel, UsabilityIssue } from '../types';

/**
 * Resultado de la detección de una regla
 */
export interface DetectionResult {
  detected: boolean;
  confidence: number; // 0-1
  evidence: Evidence[];
  suggestions: string[];
}

/**
 * Evidencia encontrada por una regla
 */
export interface Evidence {
  type: 'measurement' | 'violation' | 'pattern' | 'comparison';
  description: string;
  value?: any;
  expected?: any;
  severity: SeverityLevel;
}

/**
 * Contexto para la ejecución de reglas
 */
export interface RuleContext {
  parentElement?: FigmaNode | null;
  siblingElements: FigmaNode[];
  allElements: FigmaNode[];
  ruleConfig: RuleConfiguration;
}

/**
 * Configuración de una regla
 */
export interface RuleConfiguration {
  parameters: Record<string, RuleParameter>;
  thresholds: Record<string, number>;
  customizations: Record<string, any>;
}

/**
 * Parámetro configurable de una regla
 */
export interface RuleParameter {
  name: string;
  type: 'number' | 'string' | 'boolean' | 'select';
  defaultValue: any;
  description: string;
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
    options?: string[];
  };
}

/**
 * Función de detección de una regla
 */
export type DetectionFunction = (element: FigmaNode, context: RuleContext) => DetectionResult;

/**
 * Función de corrección automática
 */
export type FixFunction = (element: FigmaNode, context: RuleContext) => Promise<FixResult>;

/**
 * Resultado de una corrección automática
 */
export interface FixResult {
  success: boolean;
  changes: ElementChange[];
  warnings: string[];
}

/**
 * Cambio aplicado a un elemento
 */
export interface ElementChange {
  property: string;
  oldValue: any;
  newValue: any;
  reason: string;
}

/**
 * Regla básica de detección
 */
export interface BasicRule {
  id: string;
  name: string;
  description: string;
  category: IssueCategory;
  severity: SeverityLevel;
  enabled: boolean;
  detectionFunction: DetectionFunction;
  fixFunction?: FixFunction;
  configuration?: RuleConfiguration;
  metadata?: RuleMetadata;
}

/**
 * Regla avanzada con funcionalidades adicionales
 */
export interface AdvancedRule extends BasicRule {
  priority: number; // 1-10
  tags: string[];
  dependencies: string[]; // IDs de otras reglas
  conditions?: RuleCondition[];
  learningData?: LearningData;
}

/**
 * Condición para ejecutar una regla
 */
export interface RuleCondition {
  type: 'element_type' | 'element_count' | 'page_type' | 'custom';
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
  description: string;
}

/**
 * Datos de aprendizaje de una regla
 */
export interface LearningData {
  executionCount: number;
  detectionCount: number;
  falsePositiveCount: number;
  userFeedback: UserFeedback[];
  lastUpdated: Date;
}

/**
 * Feedback del usuario sobre una regla
 */
export interface UserFeedback {
  ruleId: string;
  elementId: string;
  feedback: 'helpful' | 'not_helpful' | 'false_positive';
  comment?: string;
  timestamp: Date;
}

/**
 * Metadatos de una regla
 */
export interface RuleMetadata {
  author: string;
  version: string;
  created: Date;
  lastModified: Date;
  documentation?: string;
  examples?: RuleExample[];
  compatibility: string[];
}

/**
 * Ejemplo de uso de una regla
 */
export interface RuleExample {
  title: string;
  description: string;
  beforeElement: Partial<FigmaNode>;
  afterElement: Partial<FigmaNode>;
  expectedResult: DetectionResult;
}

/**
 * Conjunto de reglas organizadas
 */
export interface RuleSet {
  id: string;
  name: string;
  description: string;
  version: string;
  groups: RuleGroup[];
  globalConfiguration: Record<string, any>;
  metadata: RuleSetMetadata;
}

/**
 * Grupo de reglas dentro de un conjunto
 */
export interface RuleGroup {
  id: string;
  name: string;
  description: string;
  category: IssueCategory;
  rules: string[]; // IDs de las reglas
  priority: number;
  enabled: boolean;
}

/**
 * Metadatos de un conjunto de reglas
 */
export interface RuleSetMetadata {
  author: string;
  created: Date;
  lastModified: Date;
  tags: string[];
  compatibility: string[];
}

/**
 * Factory para crear reglas básicas
 */
export class RuleFactory {
  /**
   * Crea una regla básica
   */
  static createBasicRule(
    id: string,
    name: string,
    description: string,
    category: IssueCategory,
    severity: SeverityLevel,
    detectionFunction: DetectionFunction,
    fixFunction?: FixFunction
  ): BasicRule {
    return {
      id,
      name,
      description,
      category,
      severity,
      enabled: true,
      detectionFunction,
      fixFunction,
      configuration: {
        parameters: {},
        thresholds: {},
        customizations: {}
      },
      metadata: {
        author: 'UX Smells Detector',
        version: '1.0.0',
        created: new Date(),
        lastModified: new Date(),
        compatibility: ['1.0.0']
      }
    };
  }

  /**
   * Crea una regla avanzada
   */
  static createAdvancedRule(
    basicRule: BasicRule,
    priority: number,
    tags: string[] = [],
    dependencies: string[] = []
  ): AdvancedRule {
    return {
      ...basicRule,
      priority,
      tags,
      dependencies,
      conditions: [],
      learningData: {
        executionCount: 0,
        detectionCount: 0,
        falsePositiveCount: 0,
        userFeedback: [],
        lastUpdated: new Date()
      }
    };
  }

  /**
   * Crea un conjunto de reglas
   */
  static createRuleSet(
    id: string,
    name: string,
    description: string,
    groups: RuleGroup[]
  ): RuleSet {
    return {
      id,
      name,
      description,
      version: '1.0.0',
      groups,
      globalConfiguration: {},
      metadata: {
        author: 'UX Smells Detector',
        created: new Date(),
        lastModified: new Date(),
        tags: [],
        compatibility: ['1.0.0']
      }
    };
  }
}

/**
 * Validador de reglas
 */
export class RuleValidator {
  /**
   * Valida una regla básica
   */
  static validateBasicRule(rule: BasicRule): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar campos requeridos
    if (!rule.id || rule.id.trim() === '') {
      errors.push('Rule ID is required');
    }

    if (!rule.name || rule.name.trim() === '') {
      errors.push('Rule name is required');
    }

    if (!rule.description || rule.description.trim() === '') {
      errors.push('Rule description is required');
    }

    if (!rule.detectionFunction) {
      errors.push('Detection function is required');
    }

    // Validar ID único
    if (rule.id && !/^[a-z0-9-]+$/.test(rule.id)) {
      errors.push('Rule ID must contain only lowercase letters, numbers, and hyphens');
    }

    // Validar función de detección
    if (rule.detectionFunction) {
      try {
        // Crear un contexto de prueba
        const testElement: FigmaNode = {
          id: 'test',
          name: 'Test Element',
          type: 'RECTANGLE'
        };
        const testContext: RuleContext = {
          siblingElements: [],
          allElements: [testElement],
          ruleConfig: {
            parameters: {},
            thresholds: {},
            customizations: {}
          }
        };

        const result = rule.detectionFunction(testElement, testContext);
        
        if (typeof result.detected !== 'boolean') {
          errors.push('Detection function must return a boolean "detected" property');
        }
        
        if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
          errors.push('Detection function must return a confidence value between 0 and 1');
        }
      } catch (error) {
        errors.push(`Detection function throws error: ${(error as Error).message}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Valida un conjunto de reglas
   */
  static validateRuleSet(ruleSet: RuleSet): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar campos requeridos
    if (!ruleSet.id || ruleSet.id.trim() === '') {
      errors.push('RuleSet ID is required');
    }

    if (!ruleSet.name || ruleSet.name.trim() === '') {
      errors.push('RuleSet name is required');
    }

    if (!ruleSet.groups || ruleSet.groups.length === 0) {
      errors.push('RuleSet must contain at least one group');
    }

    // Validar grupos
    ruleSet.groups.forEach((group, index) => {
      if (!group.id || group.id.trim() === '') {
        errors.push(`Group ${index} is missing ID`);
      }

      if (!group.rules || group.rules.length === 0) {
        warnings.push(`Group ${group.id} contains no rules`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

/**
 * Resultado de validación
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Utilidades para trabajar con reglas
 */
export class RuleUtils {
  /**
   * Convierte un problema detectado en un UsabilityIssue
   */
  static createUsabilityIssue(
    rule: BasicRule,
    element: FigmaNode,
    result: DetectionResult
  ): UsabilityIssue {
    return {
      id: `issue_${rule.id}_${element.id}_${Date.now()}`,
      elementId: element.id,
      category: rule.category,
      severity: rule.severity,
      description: rule.description,
      ruleId: rule.id,
      elementInfo: {
        name: element.name || 'Sin nombre',
        type: element.type,
        position: element.x !== undefined && element.y !== undefined 
          ? { x: Math.round(element.x), y: Math.round(element.y) } 
          : undefined,
        size: element.width !== undefined && element.height !== undefined 
          ? { width: Math.round(element.width), height: Math.round(element.height) } 
          : undefined,
        textContent: element.characters ? 
          (element.characters.length > 50 ? element.characters.substring(0, 50) + '...' : element.characters) 
          : undefined,
        hierarchy: [] // Se puede implementar más tarde si se necesita
      },
      details: {
        expectedValue: result.evidence.find(e => e.expected)?.expected,
        actualValue: result.evidence.find(e => e.value)?.value,
        autoFixable: rule.fixFunction !== undefined
      }
    };
  }

  /**
   * Calcula la prioridad efectiva de una regla
   */
  static calculateEffectivePriority(rule: AdvancedRule, context: RuleContext): number {
    let priority = rule.priority;

    // Ajustar por datos de aprendizaje
    if (rule.learningData) {
      const accuracy = rule.learningData.executionCount > 0 
        ? (rule.learningData.detectionCount - rule.learningData.falsePositiveCount) / rule.learningData.executionCount
        : 1;
      
      priority *= accuracy;
    }

    // Ajustar por contexto
    if (context.allElements.length > 100) {
      // Reducir prioridad en documentos muy grandes
      priority *= 0.9;
    }

    return Math.max(1, Math.min(10, priority));
  }

  /**
   * Verifica si se cumplen las condiciones de una regla
   */
  static checkRuleConditions(rule: AdvancedRule, element: FigmaNode, context: RuleContext): boolean {
    if (!rule.conditions || rule.conditions.length === 0) {
      return true;
    }

    return rule.conditions.every(condition => {
      switch (condition.type) {
        case 'element_type':
          return this.evaluateCondition(element.type, condition.operator, condition.value);
        
        case 'element_count':
          return this.evaluateCondition(context.allElements.length, condition.operator, condition.value);
        
        case 'page_type':
          // Implementar lógica para detectar tipo de página
          return true;
        
        default:
          return true;
      }
    });
  }

  /**
   * Evalúa una condición específica
   */
  private static evaluateCondition(actual: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'equals':
        return actual === expected;
      case 'not_equals':
        return actual !== expected;
      case 'greater_than':
        return actual > expected;
      case 'less_than':
        return actual < expected;
      case 'contains':
        return String(actual).toLowerCase().includes(String(expected).toLowerCase());
      default:
        return true;
    }
  }
}

export default {
  RuleFactory,
  RuleValidator,
  RuleUtils
};