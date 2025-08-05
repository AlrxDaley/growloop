-- Clear all existing data from all tables
-- Delete in order to respect foreign key constraints

DELETE FROM public.photos;
DELETE FROM public.plants;
DELETE FROM public.tasks;
DELETE FROM public.visits;
DELETE FROM public.zones;
DELETE FROM public.clients;