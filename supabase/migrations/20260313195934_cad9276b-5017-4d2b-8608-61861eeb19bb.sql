
SELECT cron.schedule(
  'auto-generate-portfolio-weekly',
  '0 10 * * 1',
  $$SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL') || '/functions/v1/auto-generate-portfolio',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'SUPABASE_ANON_KEY')
    ),
    body := '{}'::jsonb
  );$$
);
