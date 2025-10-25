# Quick Start - Android Development

## Guia Rapida para Comenzar

### Paso 1: Verificar Requisitos

Asegurate de tener instalado:

- [x] Node.js v18+
- [x] Java JDK 17
- [x] Android Studio
- [x] Android SDK API 34

### Paso 2: Verificar Instalacion

```bash
# Verificar Node.js
node --version

# Verificar Java
java --version

# Verificar variable JAVA_HOME (Windows)
echo %JAVA_HOME%

# Verificar Android SDK (Windows)
echo %ANDROID_HOME%
```

### Paso 3: Abrir Proyecto en Android Studio

Opcion 1 - Usando NPM (Recomendado):
```bash
cd C:\Proyectos\smokelog
npm run android:dev
```

Opcion 2 - Manual:
```bash
cd C:\Proyectos\smokelog
npm run build
npx cap sync
npx cap open android
```

### Paso 4: Compilar y Ejecutar

Una vez en Android Studio:

1. Esperar a que Gradle termine de sincronizar
2. Conectar un dispositivo Android via USB O iniciar un emulador
3. Click en el boton "Run" (icono de play verde)
4. Seleccionar dispositivo/emulador
5. La app se instalara y ejecutara automaticamente

### Comandos Utiles

```bash
# Compilar proyecto web y sincronizar con Android
npm run android:sync

# Ejecutar directamente en dispositivo
npm run android:run

# Solo abrir Android Studio
npm run cap:open:android

# Sincronizar sin compilar (si ya compilaste con 'npm run build')
npx cap sync
```

### Workflow de Desarrollo

1. **Hacer cambios en el codigo web** (src/*, public/*, etc.)
2. **Compilar**: `npm run build`
3. **Sincronizar**: `npx cap sync`
4. **Refrescar en Android Studio** o ejecutar nuevamente

### Atajos de Teclado en Android Studio

- **Run**: `Shift + F10`
- **Debug**: `Shift + F9`
- **Build**: `Ctrl + F9`
- **Clean Project**: Menu > Build > Clean Project
- **Rebuild**: Menu > Build > Rebuild Project

### Compilar APK de Debug (Sin Android Studio)

```bash
cd C:\Proyectos\smokelog\android
gradlew.bat assembleDebug
```

APK generado en:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

### Instalar APK en Dispositivo

Con dispositivo conectado via USB:

```bash
cd C:\Proyectos\smokelog\android\app\build\outputs\apk\debug
adb install app-debug.apk
```

### Solucionar Problemas Rapidos

#### Problema: "SDK location not found"

**Solucion**: Crear archivo `android\local.properties`:
```properties
sdk.dir=C:\\Users\\TuUsuario\\AppData\\Local\\Android\\Sdk
```

#### Problema: Gradle build failed

**Solucion**:
```bash
cd android
gradlew.bat clean
gradlew.bat build
```

#### Problema: No se detecta el dispositivo

**Solucion**:
```bash
# Reiniciar ADB
adb kill-server
adb start-server
adb devices
```

#### Problema: La app no refleja cambios

**Solucion**:
```bash
# Limpiar todo y recompilar
npm run build
npx cap sync
# Luego en Android Studio: Build > Clean Project > Rebuild Project
```

### Ver Logs en Tiempo Real

```bash
# Ver todos los logs
adb logcat

# Ver solo logs de la app
adb logcat | findstr "SmokeLog"

# Limpiar logs
adb logcat -c
```

### Configuracion del Emulador

1. Android Studio > Tools > Device Manager
2. Create Device
3. Seleccionar: Pixel 5 (recomendado)
4. Descargar System Image: Android 14 (API 34)
5. Finish > Start Emulator

### Depuracion Web (Chrome DevTools)

1. Abrir Chrome en tu PC
2. Ir a: `chrome://inspect/#devices`
3. Tu dispositivo Android deberia aparecer
4. Click en "Inspect" bajo SmokeLog
5. Se abre Chrome DevTools con acceso al webview

### Estructura de Comandos

```
npm run android:dev     -> build + sync + open Android Studio
npm run android:sync    -> build + sync (rapido)
npm run android:run     -> build + sync + run en dispositivo
npm run build           -> solo compilar web
npx cap sync            -> solo sincronizar
npx cap open android    -> solo abrir Android Studio
```

### Checklist Pre-Compilacion

Antes de compilar APK de produccion:

- [ ] Probar en multiples dispositivos/emuladores
- [ ] Probar todas las funcionalidades (agregar cigarrillo, estadisticas, graficos)
- [ ] Verificar que funciona offline
- [ ] Verificar rotacion de pantalla (debe quedar en portrait)
- [ ] Verificar splash screen
- [ ] Verificar icono de la app
- [ ] Verificar retroalimentacion haptica (vibracion)
- [ ] Probar en diferentes versiones de Android (min API 24)

### Recursos Adicionales

- **Documentacion completa**: Ver `README-ANDROID.md`
- **Resumen tecnico**: Ver `ANDROID-INTEGRATION-SUMMARY.md`
- **Capacitor Docs**: https://capacitorjs.com/docs/android
- **Android Developer**: https://developer.android.com

### Contacto y Soporte

Si encuentras problemas no cubiertos aqui:

1. Revisar `README-ANDROID.md` (guia detallada)
2. Revisar logs de Gradle en Android Studio
3. Consultar documentacion de Capacitor
4. Verificar versiones de dependencias

---

**Tip**: Mantén Android Studio abierto durante el desarrollo para compilaciones mas rapidas. Solo necesitas hacer "Sync" despues de cambios en el codigo web.
