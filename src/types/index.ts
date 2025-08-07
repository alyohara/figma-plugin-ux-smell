// Tipos principales para el plugin de detección de UX
export type IssueCategory = 
  | 'accessibility'
  | 'readability'
  | 'layout'
  | 'consistency'
  | 'navigation'
  | 'feedback'
  | 'efficiency';

export type SeverityLevel = 'low' | 'medium' | 'high';

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  characters?: string;
  fontSize?: number;
  fontName?: FontName;
  textAlignHorizontal?: string;
  textAlignVertical?: string;
  lineHeight?: any;
  letterSpacing?: any;
  fills?: Paint[];
  strokes?: Paint[];
  strokeWeight?: number;
  effects?: Effect[];
  cornerRadius?: number;
  opacity?: number;
}

export interface UsabilityIssue {
  id: string;
  elementId: string;
  category: IssueCategory;
  severity: SeverityLevel;
  description: string;
  ruleId: string;
  // Información detallada del elemento para la UI
  elementName?: string;
  elementType?: string;
  elementText?: string;
  elementX?: number;
  elementY?: number;
  elementWidth?: number;
  elementHeight?: number;
  elementInfo?: {
    name: string;
    type: string;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    textContent?: string;
    hierarchy?: string[];
  };
  details?: {
    expectedValue?: any;
    actualValue?: any;
    autoFixable?: boolean;
  };
}

export interface Recommendation {
  id: string;
  issueId: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: number;
  impact: number;
  effort: number;
  actions: string[];
  resources: string[];
  examples: string[];
  tags: string[];
  estimatedTime: string;
  dependencies: string[];
}

export interface AnalysisResult {
  id: string;
  timestamp: Date;
  issues: UsabilityIssue[];
  recommendations: Recommendation[];
  metrics: AnalysisMetrics;
  context: AnalysisContext;
}

export interface AnalysisMetrics {
  totalIssues: number;
  issuesByCategory: Record<IssueCategory, number>;
  issuesBySeverity: Record<SeverityLevel, number>;
  averageSeverity: number;
  elementsAnalyzed: number;
  analysisTime: number;
}

export interface AnalysisContext {
  selectedElements: FigmaNode[];
  allElements: FigmaNode[];
  siblingElements: FigmaNode[];
  currentPage: {
    id: string;
    name: string;
  };
  viewport: ViewportInfo;
  timestamp: Date;
  totalElementCount: number;
  selectedElementCount: number;
  visibleElementCount: number;
  elementTypes: Record<string, number>;
  pageStructure: {
    depth: number;
    hasAutoLayout: boolean;
    hasComponents: boolean;
  };
}

export interface ViewportInfo {
  x: number;
  y: number;
  zoom: number;
  width: number;
  height: number;
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  category: IssueCategory;
  severity: SeverityLevel;
  enabled: boolean;
  detectionFunction: (element: FigmaNode, context: AnalysisContext) => boolean;
  fixFunction?: (element: FigmaNode) => void;
  configuration?: RuleConfiguration;
}

export interface RuleConfiguration {
  parameters: Record<string, any>;
  thresholds: Record<string, number>;
  customizations: Record<string, any>;
}

export default {
  // Export types for external use
};