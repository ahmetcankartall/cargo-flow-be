-- =========================================================
-- CargoFlow - Initial Database Schema
-- Migration: 001_init.sql
-- =========================================================

-- UUID üretmek için
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- =========================================================
-- CUSTOMERS
-- =========================================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) UNIQUE,

    phone VARCHAR(30),
    email VARCHAR(150),

    tax_number VARCHAR(50),
    address TEXT,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================================
-- VEHICLES
-- =========================================================

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    plate VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type VARCHAR(50) NOT NULL,

    brand VARCHAR(100),
    model VARCHAR(100),
    capacity INTEGER,
    production_year INTEGER,

    status VARCHAR(30) NOT NULL DEFAULT 'active',

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================================
-- DRIVERS
-- =========================================================

CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    phone VARCHAR(30),
    license_number VARCHAR(100),

    status VARCHAR(30) NOT NULL DEFAULT 'active',

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================================
-- SUBCONTRACTORS
-- =========================================================

CREATE TABLE subcontractors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,

    phone VARCHAR(30),
    email VARCHAR(150),

    tax_number VARCHAR(50),
    address TEXT,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================================
-- LOCATIONS
-- =========================================================

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(200) NOT NULL,

    address TEXT,
    city VARCHAR(100),
    district VARCHAR(100),

    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),

    type VARCHAR(50),

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================================
-- SUPPLIERS
-- =========================================================

CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,

    phone VARCHAR(30),
    email VARCHAR(150),

    tax_number VARCHAR(50),
    address TEXT,

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================================
-- SERVICE TYPES
-- =========================================================

CREATE TABLE service_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL UNIQUE,

    default_price NUMERIC(12, 2),
    default_currency VARCHAR(3) NOT NULL DEFAULT 'TRY',

    description TEXT,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT service_types_currency_check
        CHECK (default_currency IN ('TRY', 'USD', 'EUR'))
);


-- =========================================================
-- OPERATIONS
-- =========================================================

CREATE TABLE operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Transfer Bilgileri
    customer_id UUID NOT NULL,

    operation_type VARCHAR(50) NOT NULL,
    operation_name VARCHAR(200) NOT NULL,

    reference VARCHAR(100),
    operation_code VARCHAR(100),
    operation_group VARCHAR(100),

    -- Rota
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,

    start_location_id UUID,

    stop TEXT,

    end_location_id UUID,

    end_date DATE NOT NULL,
    end_time TIME NOT NULL,

    -- Araç / Taşeron
    mode VARCHAR(20) NOT NULL DEFAULT 'vehicle',

    vehicle_id UUID,
    driver_id UUID,

    subcontractor_id UUID,
    subcontractor_price NUMERIC(12, 2),
    subcontractor_currency VARCHAR(3),

    -- Fiyat
    price NUMERIC(12, 2),
    price_currency VARCHAR(3) NOT NULL DEFAULT 'TRY',

    payment_type VARCHAR(20) NOT NULL DEFAULT 'Cari',

    -- Notlar
    description TEXT,
    driver_note TEXT,
    meeting_point TEXT,

    -- Uçuş
    flight_time TIME,
    flight_code VARCHAR(50),
    flight_direction VARCHAR(20),
    flight_terminal VARCHAR(50),

    -- Rehber
    greeting_staff VARCHAR(150),
    guide_name VARCHAR(150),
    guide_phone VARCHAR(30),

    -- Komisyon
    commission_account_name VARCHAR(150),
    commission_price NUMERIC(12, 2),
    commission_currency VARCHAR(3),

    -- Durum
    status VARCHAR(30) NOT NULL DEFAULT 'Planlandı',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- =====================================================
    -- Foreign Keys
    -- =====================================================

    CONSTRAINT operations_customer_fk
        FOREIGN KEY (customer_id)
        REFERENCES customers(id),

    CONSTRAINT operations_start_location_fk
        FOREIGN KEY (start_location_id)
        REFERENCES locations(id)
        ON DELETE SET NULL,

    CONSTRAINT operations_end_location_fk
        FOREIGN KEY (end_location_id)
        REFERENCES locations(id)
        ON DELETE SET NULL,

    CONSTRAINT operations_vehicle_fk
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE SET NULL,

    CONSTRAINT operations_driver_fk
        FOREIGN KEY (driver_id)
        REFERENCES drivers(id)
        ON DELETE SET NULL,

    CONSTRAINT operations_subcontractor_fk
        FOREIGN KEY (subcontractor_id)
        REFERENCES subcontractors(id)
        ON DELETE SET NULL,

    -- =====================================================
    -- Check Constraints
    -- =====================================================

    CONSTRAINT operations_mode_check
        CHECK (mode IN ('vehicle', 'subcontractor')),

    CONSTRAINT operations_payment_type_check
        CHECK (payment_type IN ('Cari', 'Peşin')),

    CONSTRAINT operations_price_currency_check
        CHECK (price_currency IN ('TRY', 'USD', 'EUR')),

    CONSTRAINT operations_subcontractor_currency_check
        CHECK (
            subcontractor_currency IS NULL
            OR subcontractor_currency IN ('TRY', 'USD', 'EUR')
        ),

    CONSTRAINT operations_commission_currency_check
        CHECK (
            commission_currency IS NULL
            OR commission_currency IN ('TRY', 'USD', 'EUR')
        ),

    CONSTRAINT operations_flight_direction_check
        CHECK (
            flight_direction IS NULL
            OR flight_direction IN ('arrival', 'departure')
        ),

    -- Vehicle modunda araç seçilmeli
    CONSTRAINT operations_vehicle_mode_check
        CHECK (
            mode <> 'vehicle'
            OR vehicle_id IS NOT NULL
        ),

    -- Taşeron modunda taşeron seçilmeli
    CONSTRAINT operations_subcontractor_mode_check
        CHECK (
            mode <> 'subcontractor'
            OR subcontractor_id IS NOT NULL
        )
);


-- =========================================================
-- PASSENGERS
-- =========================================================

CREATE TABLE passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    operation_id UUID NOT NULL,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    phone VARCHAR(30),

    gender VARCHAR(20),
    nationality VARCHAR(100),

    identity_number VARCHAR(100),

    voucher_type VARCHAR(50),

    passenger_type VARCHAR(20) NOT NULL DEFAULT 'Yetişkin',

    description TEXT,

    station_no VARCHAR(50),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT passengers_operation_fk
        FOREIGN KEY (operation_id)
        REFERENCES operations(id)
        ON DELETE CASCADE,

    CONSTRAINT passengers_type_check
        CHECK (
            passenger_type IN ('Yetişkin', 'Çocuk', 'Ücretsiz')
        )
);


-- =========================================================
-- OPERATION EXTRA SERVICES
-- =========================================================

CREATE TABLE operation_extra_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    operation_id UUID NOT NULL,

    service_type_id UUID,

    service_name VARCHAR(150) NOT NULL,

    price NUMERIC(12, 2),
    currency VARCHAR(3) NOT NULL DEFAULT 'TRY',

    supplier_id UUID,

    cost_price NUMERIC(12, 2),
    cost_currency VARCHAR(3) NOT NULL DEFAULT 'TRY',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT operation_extra_services_operation_fk
        FOREIGN KEY (operation_id)
        REFERENCES operations(id)
        ON DELETE CASCADE,

    CONSTRAINT operation_extra_services_service_type_fk
        FOREIGN KEY (service_type_id)
        REFERENCES service_types(id)
        ON DELETE SET NULL,

    CONSTRAINT operation_extra_services_supplier_fk
        FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE SET NULL,

    CONSTRAINT operation_extra_services_currency_check
        CHECK (currency IN ('TRY', 'USD', 'EUR')),

    CONSTRAINT operation_extra_services_cost_currency_check
        CHECK (cost_currency IN ('TRY', 'USD', 'EUR'))
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_operations_customer_id
    ON operations(customer_id);

CREATE INDEX idx_operations_start_date
    ON operations(start_date);

CREATE INDEX idx_operations_status
    ON operations(status);

CREATE INDEX idx_operations_vehicle_id
    ON operations(vehicle_id);

CREATE INDEX idx_operations_driver_id
    ON operations(driver_id);

CREATE INDEX idx_operations_subcontractor_id
    ON operations(subcontractor_id);

CREATE INDEX idx_passengers_operation_id
    ON passengers(operation_id);

CREATE INDEX idx_operation_extra_services_operation_id
    ON operation_extra_services(operation_id);


-- =========================================================
-- DONE
-- =========================================================