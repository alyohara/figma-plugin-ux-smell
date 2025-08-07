# Guía de Instalación

Esta guía te ayudará a instalar y configurar el UX Smells Detector en Figma.

## 📦 Métodos de Instalación

### Opción 1: Figma Community (Recomendada)

Esta es la forma más fácil de instalar el plugin:

1. **Abre Figma** (Desktop App o Web)
2. **Ve al menú Plugins**:
   - Desktop: `Plugins` → `Browse all plugins`
   - Web: Haz clic en el ícono de plugins en la barra lateral
3. **Busca "UX Smells Detector"** en la barra de búsqueda
4. **Haz clic en "Install"** en la página del plugin
5. **¡Listo!** El plugin aparecerá en tu lista de plugins instalados

### Opción 2: Instalación Manual (Desarrollo)

Para desarrolladores o usuarios que quieren la versión más reciente:

#### Prerrequisitos
- Node.js 16 o superior
- npm o yarn
- Figma Desktop App (recomendado para desarrollo)

#### Pasos

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/figma-usability-smells-detector.git
   cd figma-usability-smells-detector
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Compila el proyecto**:
   ```bash
   npm run build
   ```

4. **Importa en Figma**:
   - Abre Figma Desktop App
   - Ve a `Plugins` → `Development` → `Import plugin from manifest...`
   - Selecciona el archivo `manifest.json` del directorio del proyecto
   - Haz clic en "Open"

5. **Verifica la instalación**:
   - El plugin debería aparecer en `Plugins` → `Development` → `UX Smells Detector`

## 🔧 Configuración Inicial

### Primera Ejecución

1. **Abre un archivo de Figma** con algunos elementos de diseño
2. **Ejecuta el plugin**:
   - Ve a `Plugins` → `UX Smells Detector`
   - O usa el atajo de teclado (si está configurado)
3. **Realiza tu primer análisis**:
   - Selecciona algunos elementos
   - Haz clic en "Analizar Selección"
   - Revisa los resultados

### Configuración de Permisos

El plugin requiere los siguientes permisos de Figma:

- **Lectura de elementos**: Para analizar propiedades de diseño
- **Selección de elementos**: Para navegar a elementos problemáticos
- **Acceso a colores y tipografía**: Para análisis de consistencia

Estos permisos se otorgan automáticamente al instalar el plugin.

## 🚀 Verificación de la Instalación

### Test Básico

1. **Crea un elemento de prueba**:
   - Crea un rectángulo pequeño (ej. 20x20px)
   - Agrega texto muy pequeño (ej. 8px)
   - Usa colores con poco contraste

2. **Ejecuta el análisis**:
   - Selecciona los elementos creados
   - Ejecuta "Analizar Selección"
   - Deberías ver problemas detectados

3. **Prueba la navegación**:
   - Haz clic en "📍 Ir al elemento" en algún problema
   - El elemento debería seleccionarse automáticamente

### Solución de Problemas Comunes

#### El plugin no aparece en el menú
- **Causa**: Instalación incompleta
- **Solución**: Reinstala el plugin siguiendo los pasos anteriores

#### Error "Plugin failed to load"
- **Causa**: Archivos corruptos o dependencias faltantes
- **Solución**: 
  ```bash
  npm run clean
  npm install
  npm run build
  ```

#### El análisis no funciona
- **Causa**: Elementos no seleccionados o archivo vacío
- **Solución**: Asegúrate de tener elementos en tu diseño y selecciónalos antes del análisis

#### Botones no responden
- **Causa**: JavaScript deshabilitado o conflictos
- **Solución**: Recarga Figma y vuelve a intentar

## 🔄 Actualización

### Desde Figma Community
Las actualizaciones se instalan automáticamente. Recibirás una notificación cuando haya una nueva versión disponible.

### Instalación Manual
1. **Haz pull de los últimos cambios**:
   ```bash
   git pull origin main
   ```

2. **Actualiza dependencias**:
   ```bash
   npm install
   ```

3. **Recompila**:
   ```bash
   npm run build
   ```

4. **Recarga en Figma**:
   - Ve a `Plugins` → `Development` → `UX Smells Detector`
   - Haz clic en el ícono de recarga

## 🗑️ Desinstalación

### Desde Figma Community
1. Ve a `Plugins` → `Manage plugins`
2. Encuentra "UX Smells Detector"
3. Haz clic en "Remove"

### Instalación Manual
1. Ve a `Plugins` → `Development`
2. Encuentra "UX Smells Detector"
3. Haz clic en "Remove"
4. Opcionalmente, elimina el directorio del proyecto

## 🌐 Compatibilidad

### Versiones de Figma Soportadas
- **Figma Desktop**: Versión 116.0 o superior
- **Figma Web**: Navegadores modernos (Chrome, Firefox, Safari, Edge)

### Sistemas Operativos
- **macOS**: 10.15 (Catalina) o superior
- **Windows**: Windows 10 o superior
- **Linux**: Distribuciones modernas con soporte para Figma Web

### Navegadores (para Figma Web)
- **Chrome**: Versión 90 o superior
- **Firefox**: Versión 88 o superior
- **Safari**: Versión 14 o superior
- **Edge**: Versión 90 o superior

## 📞 Soporte de Instalación

Si tienes problemas con la instalación:

1. **Revisa la documentación**: [Wiki del proyecto](https://github.com/tu-usuario/figma-usability-smells-detector/wiki)
2. **Busca en Issues**: [GitHub Issues](https://github.com/tu-usuario/figma-usability-smells-detector/issues)
3. **Crea un nuevo Issue**: Si no encuentras solución, reporta tu problema
4. **Contacta soporte**: soporte@uxsmellsdetector.com

## 🔐 Consideraciones de Seguridad

- El plugin procesa datos localmente, no envía información a servidores externos
- Todos los análisis se realizan en tu navegador/aplicación
- No se almacena información sensible de tus diseños
- Las configuraciones se guardan localmente en tu dispositivo

## 📊 Telemetría (Opcional)

El plugin puede recopilar datos anónimos de uso para mejorar la experiencia:

- Número de análisis realizados
- Tipos de problemas más comunes
- Rendimiento del plugin

**Esta telemetría es completamente opcional y puede deshabilitarse en la configuración del plugin.**

---

¿Necesitas ayuda adicional? Consulta nuestra [documentación completa](../README.md) o contacta nuestro [soporte](mailto:soporte@uxsmellsdetector.com).