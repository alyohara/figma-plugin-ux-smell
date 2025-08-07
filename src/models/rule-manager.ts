// Gestor de reglas de detección
import { FigmaNode, UsabilityIssue } from '../types';
import {
  BasicRule,
  AdvancedRule,
  RuleContext,
  DetectionResult,
  RuleValidator,
  RuleUtils,
  ValidationResult
} from './rule-structure';
import { basicRules } from './basic-rules';

/**
 * Gestor principal de reglas de detección
 */
export class RuleManager {
  private static instance: RuleManager;
  private rules: Map<string, BasicRule> = new Map();
  private enabledRules: Set<string> = new Set();

  private constructor() {
    this.initializeDefaultRules();
  }

  public static getInstance(): RuleManager {
    if (!RuleManager.instance) {
      RuleManager.instance = new RuleManager();
    }
    return RuleManager.instance;
  }

  /**
   * Inicializa las reglas por defecto
   */
  private initializeDefaultRules(): void {
    basicRules.forEach(rule => {
      this.addRule(rule);
      this.enableRule(rule.id);
    });

    console.log(`Initialized ${this.rules.size} default rules`);
  }

  /**
   * Agrega una nueva regla
   */
  public addRule(rule: BasicRule): ValidationResult {
    const validation = RuleValidator.validateBasicRule(rule);

    if (!validation.valid) {
      console.error(`Failed to add rule ${rule.id}:`, validation.errors);
      return validation;
    }

    this.rules.set(rule.id, rule);

    if (validation.warnings.length > 0) {
      console.warn(`Warnings for rule ${rule.id}:`, validation.warnings);
    }

    return validation;
  }

  /**
   * Remueve una regla
   */
  public removeRule(ruleId: string): boolean {
    const removed = this.rules.delete(ruleId);
    if (removed) {
      this.enabledRules.delete(ruleId);
    }
    return removed;
  }

  /**
   * Obtiene una regla por ID
   */
  public getRule(ruleId: string): BasicRule | undefined {
    return this.rules.get(ruleId);
  }

  /**
   * Obtiene todas las reglas
   */
  public getAllRules(): BasicRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Obtiene las reglas habilitadas
   */
  public getEnabledRules(): BasicRule[] {
    return Array.from(this.rules.values()).filter(rule =>
      this.enabledRules.has(rule.id) && rule.enabled
    );
  }

  /**
   * Habilita una regla
   */
  public enableRule(ruleId: string): boolean {
    if (this.rules.has(ruleId)) {
      this.enabledRules.add(ruleId);
      return true;
    }
    return false;
  }

  /**
   * Deshabilita una regla
   */
  public disableRule(ruleId: string): boolean {
    return this.enabledRules.delete(ruleId);
  }

  /**
   * Verifica si una regla está habilitada
   */
  public isRuleEnabled(ruleId: string): boolean {
    return this.enabledRules.has(ruleId);
  }

  /**
   * Ejecuta todas las reglas habilitadas en un elemento
   */
  public analyzeElement(element: FigmaNode, context: RuleContext): AnalysisResult {
    const issues: UsabilityIssue[] = [];
    const ruleResults: Map<string, DetectionResult> = new Map();
    const enabledRules = this.getEnabledRules();

    enabledRules.forEach(rule => {
      try {
        const result = rule.detectionFunction(element, context);
        ruleResults.set(rule.id, result);

        if (result.detected) {
          const issue = RuleUtils.createUsabilityIssue(rule, element, result);
          issues.push(issue);
        }
      } catch (error) {
        console.error(`Error executing rule ${rule.id} on element ${element.id}:`, error);
      }
    });

    return {
      elementId: element.id,
      issues,
      ruleResults,
      executedRules: enabledRules.length,
      timestamp: new Date()
    };
  }

  /**
   * Ejecuta todas las reglas en múltiples elementos
   */
  public analyzeElements(elements: FigmaNode[]): BatchAnalysisResult {
    const results: AnalysisResult[] = [];
    const allIssues: UsabilityIssue[] = [];
    const startTime = Date.now();

    elements.forEach(element => {
      // Crear contexto para el elemento
      const context: RuleContext = {
        parentElement: null, // Se podría implementar la lógica para obtener el padre
        siblingElements: elements.filter(el => el.id !== element.id),
        allElements: elements,
        ruleConfig: {
          parameters: {},
          thresholds: {},
          customizations: {}
        }
      };

      const result = this.analyzeElement(element, context);
      results.push(result);
      allIssues.push(...result.issues);
    });

    const endTime = Date.now();

    return {
      results,
      totalIssues: allIssues.length,
      totalElements: elements.length,
      executionTime: endTime - startTime,
      issuesByCategory: this.groupIssuesByCategory(allIssues),
      issuesBySeverity: this.groupIssuesBySeverity(allIssues),
      timestamp: new Date()
    };
  }

  /**
   * Agrupa problemas por categoría
   */
  private groupIssuesByCategory(issues: UsabilityIssue[]): Record<string, number> {
    const groups: Record<string, number> = {};

    issues.forEach(issue => {
      groups[issue.category] = (groups[issue.category] || 0) + 1;
    });

    return groups;
  }

  /**
   * Agrupa problemas por severidad
   */
  private groupIssuesBySeverity(issues: UsabilityIssue[]): Record<string, number> {
    const groups: Record<string, number> = {};

    issues.forEach(issue => {
      groups[issue.severity] = (groups[issue.severity] || 0) + 1;
    });

    return groups;
  }

  /**
   * Obtiene estadísticas del gestor
   */
  public getStatistics(): RuleManagerStatistics {
    const allRules = this.getAllRules();
    const enabledRules = this.getEnabledRules();

    const rulesByCategory: Record<string, number> = {};
    const rulesBySeverity: Record<string, number> = {};

    allRules.forEach(rule => {
      rulesByCategory[rule.category] = (rulesByCategory[rule.category] || 0) + 1;
      rulesBySeverity[rule.severity] = (rulesBySeverity[rule.severity] || 0) + 1;
    });

    return {
      totalRules: allRules.length,
      enabledRules: enabledRules.length,
      disabledRules: allRules.length - enabledRules.length,
      rulesByCategory,
      rulesBySeverity
    };
  }

  /**
   * Exporta la configuración actual
   */
  public exportConfiguration(): RuleManagerConfiguration {
    const rules = Array.from(this.rules.entries()).map(([id, rule]) => ({
      id,
      enabled: this.enabledRules.has(id),
      configuration: rule.configuration
    }));

    return {
      version: '1.0.0',
      timestamp: new Date(),
      rules
    };
  }

  /**
   * Importa una configuración
   */
  public importConfiguration(config: RuleManagerConfiguration): boolean {
    try {
      config.rules.forEach(ruleConfig => {
        if (this.rules.has(ruleConfig.id)) {
          if (ruleConfig.enabled) {
            this.enableRule(ruleConfig.id);
          } else {
            this.disableRule(ruleConfig.id);
          }

          // Actualizar configuración si está presente
          if (ruleConfig.configuration) {
            const rule = this.rules.get(ruleConfig.id)!;
            rule.configuration = { ...rule.configuration, ...ruleConfig.configuration };
          }
        }
      });

      return true;
    } catch (error) {
      console.error('Error importing configuration:', error);
      return false;
    }
  }
}

/**
 * Interfaces para resultados y configuración
 */
export interface AnalysisResult {
  elementId: string;
  issues: UsabilityIssue[];
  ruleResults: Map<string, DetectionResult>;
  executedRules: number;
  timestamp: Date;
}

export interface BatchAnalysisResult {
  results: AnalysisResult[];
  totalIssues: number;
  totalElements: number;
  executionTime: number;
  issuesByCategory: Record<string, number>;
  issuesBySeverity: Record<string, number>;
  timestamp: Date;
}

export interface RuleManagerStatistics {
  totalRules: number;
  enabledRules: number;
  disabledRules: number;
  rulesByCategory: Record<string, number>;
  rulesBySeverity: Record<string, number>;
}

export interface RuleManagerConfiguration {
  version: string;
  timestamp: Date;
  rules: Array<{
    id: string;
    enabled: boolean;
    configuration?: any;
  }>;
}

/**
 * Instancia singleton del gestor
 */
export const ruleManager = RuleManager.getInstance();

export default {
  RuleManager,
  ruleManager
};