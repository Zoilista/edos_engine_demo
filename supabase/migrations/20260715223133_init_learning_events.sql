-- Create user_sessions table for anonymous users
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create learning_events table (Append-only / Event Sourcing)
CREATE TABLE public.learning_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_sessions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    payload JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX idx_learning_events_user_id ON public.learning_events(user_id);
CREATE INDEX idx_learning_events_timestamp ON public.learning_events(timestamp);

-- Enable Row Level Security
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_sessions
CREATE POLICY "Enable insert for anonymous users" 
    ON public.user_sessions 
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Enable read for admins only" 
    ON public.user_sessions 
    FOR SELECT 
    USING (auth.role() = 'service_role');

-- RLS Policies for learning_events
CREATE POLICY "Enable insert for anonymous users" 
    ON public.learning_events 
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Enable read for admins only" 
    ON public.learning_events 
    FOR SELECT 
    USING (auth.role() = 'service_role');
