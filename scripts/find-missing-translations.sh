#!/bin/bash

# Script pour trouver les traductions manquantes
# Usage: ./scripts/find-missing-translations.sh

echo "=== Recherche des traductions manquantes ==="
echo ""

# Fichier de traductions serveur
TRANSLATIONS_FILE="server/data/translations.json"

# Extraire toutes les clés utilisées dans le code (pattern: t("key") ou t('key'))
echo "1. Extraction des clés de traduction utilisées dans le code..."
USED_KEYS=$(grep -rhoE 't\(["\x27][a-zA-Z0-9._]+["\x27]\)' client/src --include="*.tsx" --include="*.ts" | \
    sed -E 's/t\(["\x27]([^"\x27]+)["\x27]\)/\1/g' | \
    sort -u)

# Extraire les clés disponibles en français
echo "2. Extraction des clés disponibles en français..."
FR_KEYS=$(grep -oE '"[a-zA-Z0-9._]+":' "$TRANSLATIONS_FILE" | head -1270 | \
    sed 's/"//g' | sed 's/://g' | sort -u)

# Extraire les clés disponibles en anglais
echo "3. Extraction des clés disponibles en anglais..."
EN_KEYS=$(grep -oE '"[a-zA-Z0-9._]+":' "$TRANSLATIONS_FILE" | tail -n +1271 | \
    sed 's/"//g' | sed 's/://g' | sort -u)

echo ""
echo "=== CLÉS MANQUANTES EN FRANÇAIS ==="
echo ""
for key in $USED_KEYS; do
    if ! echo "$FR_KEYS" | grep -q "^${key}$"; then
        # Trouver où la clé est utilisée
        locations=$(grep -rn "t([\"']${key}[\"'])" client/src --include="*.tsx" --include="*.ts" 2>/dev/null | head -3)
        echo "  - $key"
        echo "    Utilisé dans:"
        echo "$locations" | sed 's/^/      /'
        echo ""
    fi
done

echo ""
echo "=== CLÉS MANQUANTES EN ANGLAIS ==="
echo ""
for key in $USED_KEYS; do
    if ! echo "$EN_KEYS" | grep -q "^${key}$"; then
        echo "  - $key"
    fi
done

echo ""
echo "=== RÉSUMÉ ==="
echo "Clés utilisées dans le code: $(echo "$USED_KEYS" | wc -l | tr -d ' ')"
echo "Clés en français: $(echo "$FR_KEYS" | wc -l | tr -d ' ')"
echo "Clés en anglais: $(echo "$EN_KEYS" | wc -l | tr -d ' ')"
