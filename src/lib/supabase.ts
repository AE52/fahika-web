import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zeoxbqyhoyoynummkqvz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inplb3hicXlob3lveW51bW1rcXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxMjI2NDEsImV4cCI6MjA0MzY5ODY0MX0.Vw_JM6KVKQ0pxYSUv-KU6ceVUzcWjMBfmgLD0bCBBW8';

export const supabase = createClient(supabaseUrl, supabaseKey); 