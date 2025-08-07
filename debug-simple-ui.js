// Debug simple UI - versión mínima para diagnosticar problemas
console.log('🚀 DEBUG: Simple UI script loaded');

// Variables globales simples
let selectedRules = new Set(['rule1', 'rule2']);
let availableRules = [
  { id: 'rule1', name: 'Rule 1' },
  { id: 'rule2', name: 'Rule 2' }
];

// Función de logging simple
function debugLog(message) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${message}`);
}

// Función para verificar elementos
function checkElements() {
  debugLog('🔍 Checking elements...');
  
  const elements = [
    'analyze-selection',
    'analyze-page', 
    'toggle-rules'
  ];
  
  elements.forEach(id => {
    const element = document.getElementById(id);
    debugLog(`Element ${id}: ${element ? 'FOUND' : 'NOT FOUND'}`);
  });
}

// Función simple para agregar listeners
function addSimpleListeners() {
  debugLog('🔗 Adding simple listeners...');
  
  // Analyze selection button
  const analyzeBtn = document.getElementById('analyze-selection');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', function() {
      debugLog('🔍 ANALYZE SELECTION CLICKED!');
      alert('Analyze Selection clicked!');
      
      // Enviar mensaje al plugin
      try {
        parent.postMessage({ 
          pluginMessage: { 
            type: 'analyze-selection',
            enabledRules: Array.from(selectedRules)
          } 
        }, '*');
        debugLog('✅ Message sent to plugin');
      } catch (error) {
        debugLog('❌ Error sending message: ' + error.message);
      }
    });
    debugLog('✅ Analyze selection listener added');
  } else {
    debugLog('❌ Analyze selection button not found');
  }
  
  // Analyze page button
  const pageBtn = document.getElementById('analyze-page');
  if (pageBtn) {
    pageBtn.addEventListener('click', function() {
      debugLog('📄 ANALYZE PAGE CLICKED!');
      alert('Analyze Page clicked!');
      
      try {
        parent.postMessage({ 
          pluginMessage: { 
            type: 'analyze-page',
            enabledRules: Array.from(selectedRules)
          } 
        }, '*');
        debugLog('✅ Message sent to plugin');
      } catch (error) {
        debugLog('❌ Error sending message: ' + error.message);
      }
    });
    debugLog('✅ Analyze page listener added');
  } else {
    debugLog('❌ Analyze page button not found');
  }
  
  // Toggle rules button
  const toggleBtn = document.getElementById('toggle-rules');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      debugLog('⚙️ TOGGLE RULES CLICKED!');
      alert('Toggle Rules clicked!');
      
      const rulesSection = document.getElementById('rules-config');
      if (rulesSection) {
        const isVisible = rulesSection.style.display !== 'none';
        rulesSection.style.display = isVisible ? 'none' : 'block';
        toggleBtn.textContent = isVisible ? '⚙️ Configurar Reglas' : '❌ Cerrar Configuración';
        debugLog(`📋 Rules section ${isVisible ? 'hidden' : 'shown'}`);
      }
    });
    debugLog('✅ Toggle rules listener added');
  } else {
    debugLog('❌ Toggle rules button not found');
  }
}

// Función de inicialización simple
function initSimple() {
  debugLog('🚀 Starting simple initialization...');
  debugLog('DOM ready state: ' + document.readyState);
  
  checkElements();
  addSimpleListeners();
  
  debugLog('✅ Simple initialization completed');
}

// Múltiples estrategias de inicialización
debugLog('📊 Document ready state: ' + document.readyState);

if (document.readyState === 'loading') {
  debugLog('📄 DOM is loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', initSimple);
} else {
  debugLog('🎯 DOM is ready, initializing immediately...');
  initSimple();
}

// Fallback después de 1 segundo
setTimeout(function() {
  debugLog('🔄 Fallback initialization after 1 second...');
  initSimple();
}, 1000);

// Listener para mensajes del plugin
window.onmessage = function(event) {
  debugLog('📨 Message received from plugin: ' + JSON.stringify(event.data));
};

debugLog('🎉 Debug script setup completed');