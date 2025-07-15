-- Migration: Enrichir les tables orders et order_items pour un système de commande complet
-- Date: 2025-07-15

-- 1. Enrichir la table orders
DO $$ 
BEGIN 
    -- Ajouter order_number
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'order_number'
    ) THEN
        ALTER TABLE orders ADD COLUMN order_number text;
        RAISE NOTICE 'Colonne order_number ajoutée';
    END IF;
    
    -- Ajouter les informations client (snapshot)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'customer_first_name'
    ) THEN
        ALTER TABLE orders ADD COLUMN customer_first_name text;
        ALTER TABLE orders ADD COLUMN customer_last_name text;
        ALTER TABLE orders ADD COLUMN customer_email text;
        ALTER TABLE orders ADD COLUMN customer_phone text;
        RAISE NOTICE 'Colonnes informations client ajoutées';
    END IF;
    
    -- Ajouter point relais
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'relay_point'
    ) THEN
        ALTER TABLE orders ADD COLUMN relay_point text; -- JSON stringifié
        RAISE NOTICE 'Colonne relay_point ajoutée';
    END IF;
    
    -- Ajouter timestamps de suivi
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'shipped_at'
    ) THEN
        ALTER TABLE orders ADD COLUMN shipped_at timestamp;
        ALTER TABLE orders ADD COLUMN delivered_at timestamp;
        RAISE NOTICE 'Colonnes de suivi ajoutées';
    END IF;
END $$;

-- 2. Enrichir la table order_items
DO $$ 
BEGIN 
    -- Ajouter les détails produit (snapshot)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' AND column_name = 'product_name'
    ) THEN
        ALTER TABLE order_items ADD COLUMN product_name text;
        ALTER TABLE order_items ADD COLUMN variation_type text;
        ALTER TABLE order_items ADD COLUMN variation_value text;
        RAISE NOTICE 'Colonnes détails produit ajoutées';
    END IF;
    
    -- Renommer et ajouter colonnes de prix
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' AND column_name = 'unit_price'
    ) THEN
        -- Renommer price en unit_price
        ALTER TABLE order_items RENAME COLUMN price TO unit_price;
        -- Ajouter total_price
        ALTER TABLE order_items ADD COLUMN total_price real;
        RAISE NOTICE 'Colonnes de prix restructurées';
    END IF;
END $$;

-- 3. Migrer les données existantes si nécessaire
DO $$ 
BEGIN 
    -- Générer des numéros de commande pour les commandes existantes
    UPDATE orders 
    SET order_number = 'ALTO-' || id || '-' || EXTRACT(EPOCH FROM COALESCE(created_at, NOW()))::bigint
    WHERE order_number IS NULL;
    
    -- Récupérer les infos client pour les commandes existantes
    UPDATE orders 
    SET 
        customer_first_name = COALESCE(customers.first_name, 'N/A'),
        customer_last_name = COALESCE(customers.last_name, 'N/A'),
        customer_email = COALESCE(customers.email, 'unknown@example.com'),
        customer_phone = COALESCE(customers.phone, 'N/A')
    FROM customers 
    WHERE orders.customer_id = customers.id 
    AND orders.customer_first_name IS NULL;
    
    -- Calculer total_price pour les order_items existants
    UPDATE order_items 
    SET total_price = unit_price * quantity 
    WHERE total_price IS NULL;
    
    RAISE NOTICE 'Migration des données existantes terminée';
END $$;
