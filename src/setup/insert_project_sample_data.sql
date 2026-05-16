--Mass insert into projects
INSERT INTO projects (
  organization_id,
  title,
  description,
  event_location,
  project_datetime
)
SELECT
  org.organization_id,
  proj.title,
  proj.description,
  proj.event_location,
  proj.project_datetime
FROM organization org
JOIN (
  VALUES
  -- BrightFuture Builders
  ('BrightFuture Builders', 'Neighborhood Park Pavilion Build', 'Constructing a shaded pavilion and seating area for a community park.', 'Boise, Idaho', '2026-06-10 09:00:00-06'::timestamptz),
  ('BrightFuture Builders', 'Affordable Housing Repair Weekend', 'Volunteers will repair roofing, siding, and accessibility ramps for local housing units.', 'Meridian, Idaho', '2026-06-22 08:30:00-06'::timestamptz),
  ('BrightFuture Builders', 'Community Playground Renovation', 'Replacing damaged playground structures and installing safer ground covering.', 'Nampa, Idaho', '2026-07-05 10:00:00-06'::timestamptz),
  ('BrightFuture Builders', 'Senior Center Accessibility Upgrade', 'Improving entryways, handrails, and restroom access at the senior center.', 'Caldwell, Idaho', '2026-07-18 09:30:00-06'::timestamptz),
  ('BrightFuture Builders', 'Riverwalk Bench Installation', 'Building and installing durable benches along the public riverwalk trail.', 'Eagle, Idaho', '2026-08-02 07:45:00-06'::timestamptz),

  -- GreenHarvest Growers
  ('GreenHarvest Growers', 'Downtown Rooftop Garden Setup', 'Installing raised beds, irrigation lines, and compost stations on a rooftop garden.', 'Boise, Idaho', '2026-06-12 08:00:00-06'::timestamptz),
  ('GreenHarvest Growers', 'Schoolyard Vegetable Planting Day', 'Teaching students how to plant and maintain seasonal vegetables in a school garden.', 'Meridian, Idaho', '2026-06-25 09:15:00-06'::timestamptz),
  ('GreenHarvest Growers', 'Neighborhood Compost Workshop', 'Hosting a hands-on composting workshop for residents and community gardeners.', 'Nampa, Idaho', '2026-07-08 18:00:00-06'::timestamptz),
  ('GreenHarvest Growers', 'Urban Orchard Expansion Project', 'Planting additional fruit trees and improving irrigation in the community orchard.', 'Caldwell, Idaho', '2026-07-20 07:30:00-06'::timestamptz),
  ('GreenHarvest Growers', 'Harvest and Food Donation Drive', 'Collecting fresh produce for distribution to local food banks and shelters.', 'Eagle, Idaho', '2026-08-06 06:45:00-06'::timestamptz),

  -- UnityServe Volunteers
  ('UnityServe Volunteers', 'Charity Supply Sorting Event', 'Organizing donated clothing, books, and hygiene supplies for partner charities.', 'Boise, Idaho', '2026-06-14 11:00:00-06'::timestamptz),
  ('UnityServe Volunteers', 'Community Clean-Up Campaign', 'Coordinating volunteers to clean streets, parks, and public gathering spaces.', 'Meridian, Idaho', '2026-06-28 08:00:00-06'::timestamptz),
  ('UnityServe Volunteers', 'Local Shelter Meal Service Night', 'Preparing and serving meals for guests at a local emergency shelter.', 'Nampa, Idaho', '2026-07-11 17:30:00-06'::timestamptz),
  ('UnityServe Volunteers', 'Back-to-School Backpack Drive', 'Assembling backpacks with school supplies for students in need.', 'Caldwell, Idaho', '2026-07-24 13:00:00-06'::timestamptz),
  ('UnityServe Volunteers', 'Holiday Volunteer Planning Fair', 'Recruiting and organizing volunteers for upcoming seasonal service projects.', 'Eagle, Idaho', '2026-08-09 15:00:00-06'::timestamptz)
) AS proj(org_name, title, description, event_location, project_datetime)
  ON org.org_name = proj.org_name;
