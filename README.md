# UX Smells Detector - Plugin de Figma

Un plugin avanzado para Figma que detecta automáticamente problemas de usabilidad y malos olores de UX en tus diseños, proporcionando recomendaciones inteligentes y correcciones automáticas.

## 🚀 Características Principales

### 🔍 Análisis Inteligente
- **Detección automática** de problemas de usabilidad
- **Análisis contextual** basado en mejores prácticas de UX
- **Categorización** por tipo: Accesibilidad, Legibilidad, Layout, Consistencia, Navegación
- **Niveles de severidad**: Alto, Medio, Bajo

### 🔧 Correcciones Automáticas
- **Auto-Fix inteligente** para problemas comunes
- **Correcciones por lotes** para múltiples elementos
- **Sistema de respaldo** para revertir cambios
- **Vista previa** de correcciones antes de aplicar

### 💡 Recomendaciones Contextuales
- **Sugerencias personalizadas** basadas en el contexto del diseño
- **Ejemplos visuales** de mejores prácticas
- **Priorización inteligente** de recomendaciones
- **Patrones de diseño** reconocidos automáticamente

### 📊 Métricas y Análisis
- **Puntuación de calidad** del diseño
- **Métricas detalladas** por categoría
- **Análisis comparativo** entre versiones
- **Tendencias de mejora** a lo largo del tiempo

### 🎛️ Configuración Avanzada
- **Reglas personalizables** para diferentes proyectos
- **Configuración de severidad** por categoría
- **Filtros avanzados** para análisis específicos
- **Exportación** en múltiples formatos (JSON, HTML, CSV, PDF)

## 📦 Instalación

### Desde Figma Community
1. Abre Figma
2. Ve a **Plugins** → **Browse all plugins**
3. Busca "UX Smells Detector"
4. Haz clic en **Install**

### Instalación Manual (Desarrollo)
1. Clona este repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Construye el plugin:
   ```bash
   npm run build
   ```
4. En Figma, ve a **Plugins** → **Development** → **Import plugin from manifest**
5. Selecciona el archivo `manifest.json` del directorio del proyecto

## 🛠️ Desarrollo

### Requisitos Previos
- Node.js 16+
- npm o yarn
- Figma Desktop App

### Configuración del Entorno
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/figma-usability-smells-detector.git
cd figma-usability-smells-detector

# Instalar dependencias
npm install

# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Ejecutar tests
npm test

# Linting
npm run lint
npm run lint:fix
```

### Estructura del Proyecto
```
src/
├── code/           # Código principal del plugin (backend)
│   └── index.ts    # Punto de entrada principal
├── ui/             # Interfaz de usuario
│   ├── index.ts    # Lógica de la UI
│   ├── ui.html     # Estructura HTML
│   └── styles.css  # Estilos CSS
├── services/       # Servicios del plugin
│   ├── analysis-engine.ts
│   ├── auto-fix-service.ts
│   ├── recommendation-generator.ts
│   └── ...
├── models/         # Modelos de datos
├── utils/          # Utilidades
└── types/          # Definiciones de tipos TypeScript
```

## 📖 Uso

### Análisis Básico
1. **Selecciona elementos** en tu diseño de Figma
2. **Abre el plugin**: Plugins → UX Smells Detector
3. **Haz clic en "Analizar Selección"** o "Analizar Página"
4. **Revisa los resultados** en el panel del plugin

### Correcciones Automáticas
1. Después del análisis, revisa los problemas detectados
2. Los problemas con **etiqueta "Auto-Fix"** pueden ser corregidos automáticamente
3. Haz clic en **"Corregir"** para problemas individuales
4. O usa **"Auto Fix"** → **"Aplicar Todas"** para correcciones masivas

### Configuración Avanzada
1. Ve a la pestaña **"Config"** en el plugin
2. Personaliza las **reglas de detección**
3. Ajusta los **niveles de severidad**
4. Configura las **opciones de exportación**

## 🎯 Tipos de Problemas Detectados

### 🔍 Accesibilidad
- **Contraste insuficiente**: Detecta texto con contraste menor a 4.5:1 (WCAG 2.1 AA)
- **Tamaños de fuente pequeños**: Identifica texto menor a 16px para mejor legibilidad
- **Objetivos táctiles pequeños**: Detecta elementos interactivos menores a 44x44px

### 📖 Legibilidad
- **Espaciado de línea inadecuado**: Detecta line-height menor a 1.2 o mayor a 2.0
- **Longitud de línea excesiva**: Identifica líneas de texto con más de 75 caracteres
- **Jerarquía tipográfica**: Analiza consistencia en escalas de texto

### 📐 Layout
- **Elementos superpuestos**: Detecta solapamiento no intencional entre elementos
- **Alineación inconsistente**: Identifica elementos mal alineados en grillas
- **Espaciado irregular**: Detecta patrones de espaciado no estándar

### 🔄 Consistencia
- **Estilos de botones inconsistentes**: Detecta variaciones no justificadas en botones
- **Colores no estandarizados**: Identifica uso excesivo de colores (>12 únicos)
- **Patrones de diseño mixtos**: Analiza consistencia en componentes similares

### 🧭 Navegación
- **Jerarquía visual confusa**: Detecta problemas en escalas tipográficas y organización
- **Etiquetas poco descriptivas**: Identifica textos genéricos o poco claros
- **Flujos de navegación interrumpidos**: Analiza continuidad en la experiencia

### 💬 Retroalimentación
- **Estados de interacción faltantes**: Detecta elementos sin estados hover/active/disabled
- **Indicadores de carga ausentes**: Identifica botones de envío sin feedback de progreso
- **Mensajes de error poco claros**: Analiza claridad en comunicación de errores

### ⚡ Eficiencia
- **Elementos redundantes**: Detecta duplicación innecesaria de componentes
- **Información repetitiva**: Identifica contenido que se puede consolidar
- **Pasos innecesarios**: Analiza complejidad en flujos de usuario

## 🔧 Correcciones Automáticas Disponibles

| Problema | Corrección Automática | Reversible |
|----------|----------------------|------------|
| Contraste bajo | Ajustar colores para cumplir WCAG 2.1 AA | ✅ |
| Objetivo táctil pequeño | Redimensionar a mínimo 44x44px | ✅ |
| Fuente pequeña | Aumentar a mínimo 16px | ✅ |
| Espaciado de línea | Ajustar a 1.5 para mejor legibilidad | ✅ |
| Elementos superpuestos | Reposicionar para evitar solapamiento | ✅ |
| Alineación | Alinear a grilla de 8px | ✅ |
| Estilos inconsistentes | Aplicar estilos estandarizados | ✅ |

## 📊 Métricas y Puntuación

### Puntuación de Calidad
- **90-100**: Excelente - Cumple con las mejores prácticas
- **70-89**: Bueno - Algunos problemas menores
- **50-69**: Regular - Necesita mejoras
- **0-49**: Deficiente - Requiere atención inmediata

### Métricas Detalladas
- **Puntuación de Accesibilidad**: Cumplimiento WCAG
- **Puntuación de Consistencia**: Uniformidad del diseño
- **Puntuación de Layout**: Calidad de la disposición
- **Tendencias**: Evolución a lo largo del tiempo

## 🔄 Análisis Comparativo

Compara diferentes versiones de tu diseño para:
- **Identificar mejoras** implementadas
- **Detectar regresiones** en la calidad
- **Medir el progreso** del proyecto
- **Generar reportes** de evolución

## 📤 Exportación de Resultados

### Formatos Disponibles
- **JSON**: Para integración con otras herramientas
- **HTML**: Reporte visual completo
- **CSV**: Para análisis en hojas de cálculo
- **PDF**: Reporte profesional para presentaciones

### Contenido del Reporte
- Resumen ejecutivo de problemas
- Lista detallada de issues
- Recomendaciones priorizadas
- Métricas y puntuaciones
- Capturas de pantalla (opcional)

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor:

1. **Fork** el repositorio
2. **Crea una rama** para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abre un Pull Request**

### Guías de Contribución
- Sigue las convenciones de código existentes
- Agrega tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Asegúrate de que todos los tests pasen

## 🐛 Reporte de Bugs

Si encuentras un bug, por favor:
1. **Verifica** que no esté ya reportado en Issues
2. **Crea un nuevo Issue** con:
   - Descripción detallada del problema
   - Pasos para reproducir
   - Capturas de pantalla si es relevante
   - Información del entorno (versión de Figma, OS, etc.)

## 📝 Changelog

### v1.0.0 (2024-01-XX)
- 🎉 Lanzamiento inicial
- ✨ Análisis automático de problemas de UX
- 🔧 Sistema de correcciones automáticas
- 💡 Recomendaciones contextuales
- 📊 Métricas y puntuación de calidad
- 🎛️ Configuración avanzada de reglas
- 📤 Exportación en múltiples formatos

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Angel Leonardo Bianco** - Desarrollo Principal - [@angelbianco](https://github.com/angelbianco)

## 🙏 Agradecimientos

- Comunidad de Figma por el feedback y sugerencias
- Contribuidores del proyecto
- Recursos de accesibilidad web (WCAG, a11y)
- Mejores prácticas de UX/UI de la industria

## 📞 Soporte

- **Documentación**: [Wiki del proyecto](https://github.com/tu-usuario/figma-usability-smells-detector/wiki)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/figma-usability-smells-detector/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/figma-usability-smells-detector/discussions)
- **Email**: soporte@uxsmellsdetector.com

---

**¿Te gusta el plugin?** ⭐ ¡Dale una estrella al repositorio y compártelo con otros diseñadores!