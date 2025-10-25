# SmokeLog - Guia de Compilacion Android

Esta guia te ayudara a compilar, ejecutar y distribuir la aplicacion SmokeLog en Android.

## Requisitos Previos

### Software Necesario

1. **Node.js** (v18 o superior)
   - Descargar desde: https://nodejs.org/

2. **Java Development Kit (JDK) 17**
   - Descargar desde: https://adoptium.net/
   - Configurar JAVA_HOME en las variables de entorno

3. **Android Studio**
   - Descargar desde: https://developer.android.com/studio
   - Durante la instalacion, asegurate de instalar:
     - Android SDK
     - Android SDK Platform (API 34)
     - Android Virtual Device (AVD)

4. **Android SDK Tools**
   - Abrir Android Studio > Settings > Android SDK
   - Instalar:
     - Android SDK Platform 34
     - Android SDK Build-Tools 34.0.0
     - Android SDK Command-line Tools

### Configurar Variables de Entorno

En Windows, agregar estas rutas al PATH:
```
C:\Users\TuUsuario\AppData\Local\Android\Sdk\platform-tools
C:\Users\TuUsuario\AppData\Local\Android\Sdk\tools
```

Crear variable ANDROID_HOME:
```
ANDROID_HOME=C:\Users\TuUsuario\AppData\Local\Android\Sdk
```

## Configuracion del Proyecto

### Informacion de la App

- **App ID**: com.smokelog.app
- **Nombre de App**: SmokeLog
- **Version**: 1.0.0 (versionCode: 1)
- **minSdkVersion**: 24 (Android 7.0+)
- **targetSdkVersion**: 34 (Android 14)
- **Orientacion**: Portrait (vertical)

## Comandos Disponibles

### Desarrollo

```bash
# Compilar la app web
npm run build

# Sincronizar cambios con Android
npm run cap:sync

# Abrir en Android Studio
npm run cap:open:android

# Todo en uno: Build + Sync + Open
npm run android:dev
```

### Compilar APK de Debug

Opcion 1 - Desde Android Studio:
1. Abrir proyecto en Android Studio: `npm run cap:open:android`
2. Menu > Build > Build Bundle(s) / APK(s) > Build APK(s)
3. APK generado en: `android/app/build/outputs/apk/debug/app-debug.apk`

Opcion 2 - Desde linea de comandos:
```bash
cd android
./gradlew assembleDebug
```

### Compilar APK de Release (Produccion)

1. **Generar Keystore** (solo primera vez):
```bash
keytool -genkey -v -keystore smokelog-release.keystore -alias smokelog -keyalg RSA -keysize 2048 -validity 10000
```
Guardar el archivo .keystore en lugar seguro y NUNCA subirlo a Git.

2. **Crear archivo de configuracion** `android/key.properties`:
```properties
storeFile=C:/ruta/a/smokelog-release.keystore
storePassword=tu_password_keystore
keyAlias=smokelog
keyPassword=tu_password_key
```

3. **Actualizar** `android/app/build.gradle`:

Agregar antes del bloque `android`:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Dentro de `android` > `buildTypes`, modificar `release`:
```gradle
release {
    minifyEnabled true
    shrinkResources true
    proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'

    if (keystorePropertiesFile.exists()) {
        signingConfig signingConfigs.release
    }
}
```

Agregar despues de `buildTypes`:
```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}
```

4. **Compilar APK Release**:
```bash
cd android
./gradlew assembleRelease
```

APK generado en: `android/app/build/outputs/apk/release/app-release.apk`

## Instalar APK en Dispositivo

### Via USB (Debug)

1. Habilitar "Opciones de desarrollador" en tu dispositivo Android:
   - Ajustes > Acerca del telefono
   - Tocar 7 veces en "Numero de compilacion"

2. Habilitar "Depuracion por USB":
   - Ajustes > Opciones de desarrollador > Depuracion por USB

3. Conectar dispositivo via USB

4. Instalar APK:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Via Archivo APK

1. Copiar el archivo APK al dispositivo
2. Abrir el archivo desde el explorador de archivos
3. Permitir instalacion desde fuentes desconocidas si se solicita

## Ejecutar en Emulador

1. Abrir Android Studio
2. AVD Manager (icono de telefono)
3. Create Virtual Device
4. Seleccionar un dispositivo (ej: Pixel 5)
5. Descargar e instalar imagen del sistema (API 34)
6. Crear y ejecutar el emulador

Luego:
```bash
npm run android:dev
```

## Ejecutar en Dispositivo Real

```bash
# Verificar que el dispositivo este conectado
adb devices

# Compilar y ejecutar
npm run build
npm run cap:sync
npx cap run android --target=<device-id>
```

## Solucionar Problemas Comunes

### Error: "SDK location not found"

Crear archivo `android/local.properties`:
```
sdk.dir=C:/Users/TuUsuario/AppData/Local/Android/Sdk
```

### Error: "Gradle build failed"

Limpiar cache de Gradle:
```bash
cd android
./gradlew clean
./gradlew build
```

### Error: "No connected devices"

Verificar conexion USB:
```bash
adb devices
```

Si no aparece el dispositivo:
```bash
adb kill-server
adb start-server
adb devices
```

### APK no instala en dispositivo

Desinstalar version anterior primero:
```bash
adb uninstall com.smokelog.app
```

## Estructura de Archivos Android

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── AndroidManifest.xml         # Configuracion de la app
│   │       ├── assets/                     # Assets web (generado automaticamente)
│   │       ├── java/                       # Codigo Java/Kotlin
│   │       └── res/                        # Recursos (iconos, strings, etc.)
│   │           ├── mipmap-*/               # Iconos de la app
│   │           └── values/
│   │               └── strings.xml         # Nombres de la app
│   └── build.gradle                        # Configuracion de compilacion
├── build.gradle                            # Gradle raiz
├── variables.gradle                        # Versiones SDK y dependencias
└── gradle.properties                       # Propiedades globales
```

## Publicar en Google Play Store

1. Crear cuenta de desarrollador en Google Play Console
2. Compilar APK o AAB release firmado:
```bash
cd android
./gradlew bundleRelease
```

3. AAB generado en: `android/app/build/outputs/bundle/release/app-release.aab`
4. Subir el AAB a Google Play Console
5. Completar informacion de la app (descripcion, capturas, etc.)
6. Enviar para revision

## Recursos Adicionales

- Documentacion de Capacitor: https://capacitorjs.com/docs/android
- Guia de Android Studio: https://developer.android.com/studio/intro
- Publicar en Google Play: https://support.google.com/googleplay/android-developer/answer/9859152

## Notas Importantes

- La app es 100% offline-first (funciona sin conexion a internet)
- Los datos se almacenan localmente usando IndexedDB
- Permiso INTERNET solo para debugging, no es requerido en produccion
- La orientacion esta bloqueada en modo portrait

## Soporte

Si encuentras problemas:
1. Verificar que todas las dependencias esten instaladas
2. Limpiar cache de Gradle: `cd android && ./gradlew clean`
3. Limpiar cache de npm: `npm run build`
4. Sincronizar nuevamente: `npm run cap:sync`
