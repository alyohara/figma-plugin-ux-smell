// Código principal del plugin de Figma
import { ruleManager } from '../models/rule-manager';
import { FigmaNode, UsabilityIssue } from '../types';

console.log('UX Smells Detector plugin loaded');

// Debug: Verificar que __html__ existe
console.log('__html__ exists:', typeof __html__);
console.log('__html__ length:', __html__ ? __html__.length : 'undefined');

// Mostrar la UI del plugin
try {
  console.log('Attempting to show UI...');
  figma.showUI(__html__, { 
    width: 400, 
    height: 600,
    title: 'UX Smells Detector'
  });
  console.log('✅ figma.showUI() called successfully');
} catch (error) {
  console.error('❌ Error calling figma.showUI():', error);
}

// Manejar mensajes de la UI
figma.ui.onmessage = (msg) => {
  console.log('Message received:', msg);
  
  switch (msg.type) {
    case 'analyze-selection':
      handleAnalyzeSelection(msg.enabledRules);
      break;
    case 'analyze-page':
      handleAnalyzePage(msg.enabledRules);
      break;
    case 'select-element':
      handleSelectElement(msg.elementId);
      break;
    case 'get-available-rules':
      handleGetAvailableRules();
      break;
    case 'close':
      figma.closePlugin();
      break;
    default:
      console.log('Unknown message type:', msg.type);
  }
};

/**
 * Convierte un nodo de Figma a nuestro formato FigmaNode con información detallada
 */
function convertToFigmaNode(node: SceneNode): FigmaNode {
  const baseNode: FigmaNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: 'visible' in node ? node.visible : true
  };

  // Agregar propiedades de posición y tamaño si están disponibles
  if ('x' in node) baseNode.x = node.x;
  if ('y' in node) baseNode.y = node.y;
  if ('width' in node) baseNode.width = node.width;
  if ('height' in node) baseNode.height = node.height;

  // Agregar propiedades específicas de texto
  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    baseNode.characters = textNode.characters;
    baseNode.fontSize = textNode.fontSize as number;
    baseNode.fontName = textNode.fontName !== figma.mixed ? textNode.fontName : undefined;
    baseNode.lineHeight = textNode.lineHeight;
  }

  // Agregar propiedades de relleno
  if ('fills' in node) {
    baseNode.fills = node.fills as Paint[];
  }

  return baseNode;
}

/**
 * Enriquece los issues con información detallada del elemento
 */
function enrichIssuesWithElementInfo(issues: UsabilityIssue[], nodeMap: Map<string, SceneNode>): UsabilityIssue[] {
  return issues.map(issue => {
    const node = nodeMap.get(issue.elementId);
    if (node) {
      // Agregar información detallada del elemento
      const enrichedIssue = {
        ...issue,
        elementName: node.name,
        elementType: node.type
      };

      // Agregar posición y dimensiones
      if ('x' in node) enrichedIssue.elementX = node.x;
      if ('y' in node) enrichedIssue.elementY = node.y;
      if ('width' in node) enrichedIssue.elementWidth = node.width;
      if ('height' in node) enrichedIssue.elementHeight = node.height;

      // Agregar texto si es un nodo de texto
      if (node.type === 'TEXT') {
        const textNode = node as TextNode;
        enrichedIssue.elementText = textNode.characters;
      }

      return enrichedIssue;
    }
    return issue;
  });
}

/**
 * Combina todos los issues de los resultados
 */
function combineIssues(results: any[]): UsabilityIssue[] {
  const allIssues: UsabilityIssue[] = [];
  for (const result of results) {
    for (const issue of result.issues) {
      allIssues.push(issue);
    }
  }
  return allIssues;
}

/**
 * Recorre recursivamente todos los nodos de la página
 */
function getAllNodesRecursively(nodes: readonly SceneNode[]): SceneNode[] {
  const allNodes: SceneNode[] = [];
  
  function traverse(node: SceneNode) {
    allNodes.push(node);
    
    // Si el nodo tiene hijos, recorrerlos recursivamente
    if ('children' in node && node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
  
  for (const node of nodes) {
    traverse(node);
  }
  
  return allNodes;
}

/**
 * Analiza los elementos seleccionados
 */
function handleAnalyzeSelection(enabledRules?: string[]) {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.ui.postMessage({
      type: 'analysis-result',
      data: {
        error: 'No hay elementos seleccionados'
      }
    });
    return;
  }

  // Configurar reglas habilitadas si se proporcionan
  if (enabledRules) {
    configureEnabledRules(enabledRules);
  }

  // Obtener todos los nodos seleccionados recursivamente (incluyendo hijos)
  const allSelectedNodes = getAllNodesRecursively(selection);
  
  console.log(`Found ${allSelectedNodes.length} total nodes in selection (including nested)`);

  // Crear mapa de nodos para enriquecimiento posterior
  const nodeMap = new Map<string, SceneNode>();
  allSelectedNodes.forEach(node => {
    nodeMap.set(node.id, node);
  });

  // Convertir elementos de Figma a nuestro formato
  const elements = allSelectedNodes.map(convertToFigmaNode);
  
  // Ejecutar análisis con el gestor de reglas
  const analysisResult = ruleManager.analyzeElements(elements);
  
  // Enriquecer issues con información detallada
  const enrichedIssues = enrichIssuesWithElementInfo(combineIssues(analysisResult.results), nodeMap);
  
  // Preparar resultados para la UI
  const results = {
    totalElements: analysisResult.totalElements,
    issues: enrichedIssues,
    recommendations: [], // Se implementará en futuras tareas
    executionTime: analysisResult.executionTime,
    issuesByCategory: analysisResult.issuesByCategory,
    issuesBySeverity: analysisResult.issuesBySeverity
  };

  console.log('Analysis completed:', results);

  // Enviar resultados a la UI
  figma.ui.postMessage({
    type: 'analysis-result',
    data: results
  });
}

/**
 * Analiza toda la página
 */
function handleAnalyzePage(enabledRules?: string[]) {
  // Configurar reglas habilitadas si se proporcionan
  if (enabledRules) {
    configureEnabledRules(enabledRules);
  }

  // Obtener TODOS los nodos de la página recursivamente
  const allNodes = getAllNodesRecursively(figma.currentPage.children);
  
  console.log(`Found ${allNodes.length} total nodes in page (including nested)`);
  
  // Crear mapa de nodos para enriquecimiento posterior
  const nodeMap = new Map<string, SceneNode>();
  allNodes.forEach(node => {
    nodeMap.set(node.id, node);
  });
  
  // Convertir elementos de Figma a nuestro formato
  const elements = allNodes.map(convertToFigmaNode);
  
  // Ejecutar análisis con el gestor de reglas
  const analysisResult = ruleManager.analyzeElements(elements);
  
  // Enriquecer issues con información detallada
  const enrichedIssues = enrichIssuesWithElementInfo(combineIssues(analysisResult.results), nodeMap);
  
  // Preparar resultados para la UI
  const results = {
    totalElements: analysisResult.totalElements,
    issues: enrichedIssues,
    recommendations: [], // Se implementará en futuras tareas
    executionTime: analysisResult.executionTime,
    issuesByCategory: analysisResult.issuesByCategory,
    issuesBySeverity: analysisResult.issuesBySeverity
  };

  console.log('Page analysis completed:', results);

  // Enviar resultados a la UI
  figma.ui.postMessage({
    type: 'analysis-result',
    data: results
  });
}

/**
 * Selecciona un elemento específico en Figma
 */
function handleSelectElement(elementId: string) {
  try {
    // Buscar el nodo por ID
    const node = figma.getNodeById(elementId);
    
    if (!node) {
      console.error(`Element with ID ${elementId} not found`);
      figma.notify('❌ Elemento no encontrado');
      return;
    }

    // Verificar que el nodo sea seleccionable
    if ('id' in node && 'parent' in node) {
      // Limpiar selección actual
      figma.currentPage.selection = [];
      
      // Seleccionar el elemento
      figma.currentPage.selection = [node as SceneNode];
      
      // Hacer zoom al elemento si es posible
      if ('x' in node && 'y' in node && 'width' in node && 'height' in node) {
        figma.viewport.scrollAndZoomIntoView([node as SceneNode]);
      }
      
      console.log(`Selected element: ${node.name} (${elementId})`);
      figma.notify(`✅ Elemento seleccionado: ${node.name}`);
    } else {
      console.error(`Element ${elementId} is not selectable`);
      figma.notify('❌ El elemento no se puede seleccionar');
    }
  } catch (error) {
    console.error('Error selecting element:', error);
    figma.notify('❌ Error al seleccionar el elemento');
  }
}

/**
 * Envía las reglas disponibles a la UI
 */
function handleGetAvailableRules() {
  const allRules = ruleManager.getAllRules();
  const rulesData = allRules.map(rule => ({
    id: rule.id,
    name: rule.name,
    description: rule.description,
    category: rule.category,
    severity: rule.severity,
    enabled: rule.enabled
  }));

  figma.ui.postMessage({
    type: 'available-rules',
    data: rulesData
  });
}

/**
 * Configura las reglas habilitadas
 */
function configureEnabledRules(enabledRuleIds: string[]) {
  const allRules = ruleManager.getAllRules();
  
  // Deshabilitar todas las reglas primero
  allRules.forEach(rule => {
    ruleManager.disableRule(rule.id);
  });
  
  // Habilitar solo las reglas seleccionadas
  enabledRuleIds.forEach(ruleId => {
    ruleManager.enableRule(ruleId);
  });
  
  console.log(`Configured ${enabledRuleIds.length} enabled rules:`, enabledRuleIds);
}