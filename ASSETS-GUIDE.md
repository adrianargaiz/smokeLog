# Guia de Assets Graficos para Android

## Iconos y Recursos Visuales - SmokeLog

### Iconos Actuales

#### 1. Icon.svg (C:\Proyectos\smokelog\public\icon.svg)

**Especificaciones**:
- Tamano: 512x512 px
- Formato: SVG (vectorial)
- Diseno: Fondo azul (#3b82f6) con cigarro tachado
- Uso: Icono principal de la aplicacion

**Elementos del Diseno**:
- Circulo azul de fondo (256px de radio)
- Cigarro blanco (192x32 px)
- Punta naranja del cigarro (#f97316)
- X roja sobre el cigarro (#ef4444, grosor 20px)

#### 2. Splash.svg (C:\Proyectos\smokelog\public\splash.svg)

**Especificaciones**:
- Tamano: 2732x2732 px
- Formato: SVG (vectorial)
- Diseno: Fondo blanco con icono centrado y texto "SmokeLog"
- Uso: Pantalla de inicio de la aplicacion

**Elementos del Diseno**:
- Fondo blanco (#ffffff)
- Icono circular centrado (radio 300px)
- Texto "SmokeLog" debajo del icono (fuente Arial, 80px, bold)

### Como Actualizar los Iconos

#### Opcion 1: Editar SVG Existente

1. Abrir `public/icon.svg` en un editor SVG (Inkscape, Adobe Illustrator, Figma)
2. Hacer modificaciones al diseno
3. Guardar como SVG
4. Ejecutar sincronizacion:
```bash
npm run build
npx cap sync
```

#### Opcion 2: Generar PNG desde SVG

Puedes convertir los SVG a PNG usando herramientas online o comandos:

**Usando ImageMagick** (si esta instalado):
```bash
# Convertir icon.svg a PNG de 512x512
magick convert public/icon.svg -resize 512x512 public/icon.png

# Convertir splash.svg a PNG de 2732x2732
magick convert public/splash.svg -resize 2732x2732 public/splash.png
```

**Usando herramientas online**:
- https://svgtopng.com/
- https://cloudconvert.com/svg-to-png
- https://www.adobe.com/express/feature/image/convert/svg-to-png

#### Opcion 3: Crear PNG desde Cero

Si prefieres trabajar directamente con PNG:

1. Crear imagen PNG de 512x512 px para icono
2. Guardar como `public/icon.png`
3. Crear imagen PNG de 2732x2732 px para splash
4. Guardar como `public/splash.png`
5. Sincronizar:
```bash
npm run build
npx cap sync
```

### Generacion Automatica de Iconos Android

Android Studio puede generar automaticamente iconos adaptivos en todas las densidades necesarias.

#### Usando Android Studio Image Asset Studio:

1. Abrir proyecto en Android Studio
2. Click derecho en `app` > New > Image Asset
3. Seleccionar "Launcher Icons (Adaptive and Legacy)"
4. En "Foreground Layer":
   - Path: Seleccionar tu icon.png o icon.svg
   - Ajustar scaling y padding
5. En "Background Layer":
   - Color: #3b82f6 (azul de SmokeLog)
6. Click "Next" > "Finish"

Esto generara automaticamente:
- mipmap-mdpi (48x48)
- mipmap-hdpi (72x72)
- mipmap-xhdpi (96x96)
- mipmap-xxhdpi (144x144)
- mipmap-xxxhdpi (192x192)

### Iconos Adaptivos (Android 8.0+)

Android 8.0 y superior usa "Adaptive Icons" que se adaptan a diferentes formas segun el launcher del dispositivo.

**Estructura**:
```
android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-hdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xxhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
├── mipmap-xxxhdpi/
│   ├── ic_launcher.png
│   └── ic_launcher_round.png
└── mipmap-anydpi-v26/
    ├── ic_launcher.xml
    └── ic_launcher_round.xml
```

### Tamanos Requeridos por Densidad

| Densidad | Tamano | Resolucion Tipica |
|----------|--------|-------------------|
| mdpi     | 48x48  | ~160 dpi          |
| hdpi     | 72x72  | ~240 dpi          |
| xhdpi    | 96x96  | ~320 dpi          |
| xxhdpi   | 144x144| ~480 dpi          |
| xxxhdpi  | 192x192| ~640 dpi          |

### Splash Screen (Pantalla de Inicio)

La configuracion actual del splash screen:

```typescript
SplashScreen: {
  launchShowDuration: 1500,        // 1.5 segundos
  backgroundColor: '#ffffff',       // Fondo blanco
  showSpinner: false,              // Sin spinner de carga
  androidSpinnerStyle: 'small',
  splashFullScreen: true,          // Pantalla completa
  splashImmersive: true            // Sin barras del sistema
}
```

**Personalizacion**:

Para cambiar la imagen del splash screen:

1. Crear imagen PNG:
   - Tamano recomendado: 2732x2732 px (cubrira todos los dispositivos)
   - Formato: PNG con transparencia
   - Diseno: Centrado, con margenes seguros

2. Guardar en: `android/app/src/main/res/drawable/splash.png`

3. Actualizar `android/app/src/main/res/values/styles.xml`:
```xml
<style name="AppTheme.NoActionBarLaunch" parent="AppTheme.NoActionBar">
    <item name="android:background">@drawable/splash</item>
</style>
```

### Colores de la App

Los colores principales usados en SmokeLog:

```css
Azul Principal:    #3b82f6  (StatusBar, iconos)
Rojo Alerta:       #ef4444  (X sobre cigarro)
Naranja:           #f97316  (Punta del cigarro)
Blanco:            #ffffff  (Fondo, splash)
Gris Oscuro:       #1f2937  (Texto)
```

### Recursos Online para Crear Iconos

#### Generadores de Iconos Android:

1. **Android Asset Studio** (Oficial)
   - https://romannurik.github.io/AndroidAssetStudio/
   - Genera iconos en todas las densidades

2. **Figma to Android**
   - https://www.figma.com/community/plugin/735098390272716381/Android-Asset-Export
   - Plugin de Figma para exportar assets Android

3. **Capacitor Assets**
   - https://github.com/ionic-team/capacitor-assets
   - CLI para generar iconos desde un solo archivo fuente

#### Instalacion de Capacitor Assets (Recomendado):

```bash
npm install -g @capacitor/assets
```

Uso:
```bash
# Generar iconos y splash screens automaticamente
npx capacitor-assets generate --android
```

Requiere:
- `resources/icon.png` (1024x1024 px minimo)
- `resources/splash.png` (2732x2732 px minimo)

### Mejores Practicas

1. **Iconos**:
   - Usar diseno simple y reconocible
   - Evitar texto pequeno (ilegible en tamanos pequenos)
   - Probar en diferentes fondos (claro/oscuro)
   - Mantener consistencia con marca de la app

2. **Splash Screen**:
   - Duracion corta (1-2 segundos maximo)
   - Diseno simple, sin animaciones complejas
   - Usar colores de marca de la app
   - Probar en diferentes tamanos de pantalla

3. **Colores**:
   - Usar paleta consistente
   - Verificar contraste para accesibilidad
   - Considerar modo oscuro (future feature)

4. **Formatos**:
   - PNG con transparencia para iconos
   - SVG para escalabilidad (mantener como fuente)
   - WebP para assets grandes (menor tamano)

### Checklist de Assets

Antes de publicar:

- [ ] Icono de app se ve bien en todos los tamanos
- [ ] Icono adaptivo funciona en diferentes launchers
- [ ] Splash screen se muestra correctamente
- [ ] Colores son consistentes con la marca
- [ ] Probar en dispositivos con diferentes densidades
- [ ] Verificar iconos en Play Store (512x512 feature graphic)

### Assets para Google Play Store

Al publicar en Play Store, necesitaras:

1. **Icono de alta resolucion**: 512x512 px PNG
2. **Feature Graphic**: 1024x500 px JPG o PNG
3. **Capturas de pantalla**:
   - Telefono: Minimo 2, recomendado 8 (1080x1920 px o similar)
   - Tablet: Opcional pero recomendado
4. **Video promocional**: Opcional (URL de YouTube)

### Herramientas Recomendadas

- **Edicion SVG**: Figma (web), Inkscape (gratis), Adobe Illustrator
- **Edicion PNG**: Photoshop, GIMP (gratis), Photopea (web gratis)
- **Conversion**: ImageMagick, CloudConvert, Squoosh (web)
- **Optimizacion**: TinyPNG, ImageOptim, Squoosh

### Comandos Rapidos

```bash
# Sincronizar assets despues de cambios
npm run build && npx cap sync

# Solo sincronizar Android
npx cap sync android

# Copiar assets manualmente
npx cap copy android
```

---

**Tip**: Mantén los archivos SVG originales en el proyecto. Son mas faciles de editar y escalar que PNG.
