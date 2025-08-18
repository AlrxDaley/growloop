-- Grant admin role to the existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('1ebb6c58-233a-46c0-af57-03a752fd325b', 'admin')
ON CONFLICT DO NOTHING;