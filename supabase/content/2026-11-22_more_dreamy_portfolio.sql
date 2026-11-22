-- More "Dreamy" portfolio projects (from the YouTube channel and Gumroad), plus two video links.
-- Run in Supabase -> SQL Editor. Safe to run twice (upserts on slug).

insert into public.portfolio_projects
  (slug, title, category, description, long_description, tools, software, image, gallery_images, workflow_steps, video_url, featured, status, created_at)
values
  ('dreamy-village', 'Dreamy Village', 'Dreamy',
   'A dreamy village on a green hill under a bright blue sky, made in Blender 5.0.',
   'A dreamy village environment made in Blender 5.0. Watch the video on YouTube.',
   array['Blender'], array['Blender 5.0'], '/images/dreamy/dreamy-village.webp', '{}', '[]'::jsonb,
   'https://www.youtube.com/watch?v=F8nKavhiNAU', false, 'published', '2026-11-10 10:00:00+00'),

  ('dreamy-forest', 'Dreamy Forest', 'Dreamy',
   'A dreamy forest environment made in Blender 5.0, with a full beginner tutorial.',
   'A dreamy forest environment made in Blender 5.0. The full beginner tutorial is on YouTube.',
   array['Blender'], array['Blender 5.0'], '/images/yt/MIvJzdDKjcs.webp', '{}', '[]'::jsonb,
   'https://www.youtube.com/watch?v=MIvJzdDKjcs', false, 'published', '2026-11-09 10:00:00+00'),

  ('dreamy-stylized-environment', 'Dreamy Stylized Environment', 'Dreamy',
   'A grassy hillside with flowers and a blossom tree, shown from blockout to final render.',
   'A dreamy stylized environment made in Blender 5.0. The beginner tutorial is on YouTube.',
   array['Blender'], array['Blender 5.0'], '/images/yt/i97TFnrcidU.webp', '{}', '[]'::jsonb,
   'https://www.youtube.com/watch?v=i97TFnrcidU', false, 'published', '2026-11-08 10:00:00+00'),

  ('dreamy-landscape', 'Dreamy Landscape', 'Dreamy',
   'A dreamy landscape built from scratch in Blender, as a full timelapse.',
   'A dreamy landscape environment made in Blender. The full timelapse is on YouTube.',
   array['Blender'], array['Blender'], '/images/yt/Gm2nVyzFXy8.webp', '{}', '[]'::jsonb,
   'https://www.youtube.com/watch?v=Gm2nVyzFXy8', false, 'published', '2026-11-07 10:00:00+00'),

  ('dreamy-environment-compilation', 'Dreamy Environments', 'Dreamy',
   'Four dreamy Blender environments in one compilation: a flower hill, a farm path, a village house and a country road.',
   'A compilation of dreamy 3D environments made in Blender 5.0. Watch it on YouTube.',
   array['Blender'], array['Blender 5.0'], '/images/yt/OHX0SpGTU4E.webp', '{}', '[]'::jsonb,
   'https://www.youtube.com/watch?v=OHX0SpGTU4E', false, 'published', '2026-11-06 10:00:00+00'),

  ('sunflower-field-animation', 'Sunflower Field', 'Dreamy',
   'A sunflower field environment as a 3D animation made in Blender.',
   'A sunflower field environment animation made in Blender. Watch it on YouTube.',
   array['Blender'], array['Blender'], '/images/yt/yOG6QBmdZbM.webp', '{}', '[]'::jsonb,
   'https://www.youtube.com/watch?v=yOG6QBmdZbM', false, 'published', '2026-11-05 10:00:00+00'),

  ('dreamy-village-house', 'Dreamy Village House', 'Dreamy',
   'Dreamy Village House, a realistic Blender environment. The scene file is available on Gumroad.',
   'Dreamy Village House. A Blender environment by Beginner CG Artist. The project file is available on Gumroad.',
   array['Blender'], array['Blender'], '/images/gumroad/ikbqgc.webp', '{}', '[]'::jsonb,
   null, false, 'published', '2026-11-04 10:00:00+00'),

  ('dreamy-hillside-path', 'Dreamy Hillside Path', 'Dreamy',
   'Dreamy Hillside Path, a Blender environment. The scene file is available on Gumroad.',
   'Dreamy Hillside Path. A Blender environment by Beginner CG Artist. The project file is available on Gumroad.',
   array['Blender'], array['Blender'], '/images/dreamy/dreamy-hillside-path.webp', '{}', '[]'::jsonb,
   null, false, 'published', '2026-11-03 10:00:00+00'),

  ('whispering-meadows', 'Whispering Meadows', 'Dreamy',
   'Whispering Meadows, a Blender environment. The scene file is available on Gumroad.',
   'Whispering Meadows. A Blender environment by Beginner CG Artist. The project file is available on Gumroad.',
   array['Blender'], array['Blender'], '/images/gumroad/hluev.webp', '{}', '[]'::jsonb,
   null, false, 'published', '2026-11-02 10:00:00+00'),

  ('dreamy-flower-meadow', 'Dreamy Flower Meadow', 'Dreamy',
   'Dreamy Flower Meadow, a Blender environment. The scene file is available on Gumroad.',
   'Dreamy Flower Meadow. A Blender environment by Beginner CG Artist. The project file is available on Gumroad.',
   array['Blender'], array['Blender'], '/images/dreamy/dreamy-flower-meadow.webp', '{}', '[]'::jsonb,
   null, false, 'published', '2026-11-01 10:00:00+00')
on conflict (slug) do update set
  title = excluded.title, category = excluded.category, description = excluded.description,
  long_description = excluded.long_description, tools = excluded.tools, software = excluded.software,
  image = excluded.image, video_url = excluded.video_url, status = excluded.status;

-- Link two existing projects to their own YouTube videos.
update public.portfolio_projects set video_url = 'https://www.youtube.com/watch?v=b7v5WKsKaGY' where slug = 'frog-island';
update public.portfolio_projects set video_url = 'https://www.youtube.com/watch?v=3hIEKMI0Jfo' where slug = 'lakeside-mountain-monastery';
